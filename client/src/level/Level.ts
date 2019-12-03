import Player from "./Player";
import {View} from "../View";
import {POINTER_DOWN, POINTER_MOVE, POINTER_UP, POINTER_UP_OUTSIDE} from "../consts/PointerEvents";
import InteractionEvent = PIXI.interaction.InteractionEvent;
import Point = PIXI.Point;
import {KEY_BACKQUOTE, KEY_J, KEY_LEFT, KEY_RIGHT, KEY_UP} from "../consts/KeyboardCodes";
import {IBlock, ILevel, IType} from "../Interfaces";
import PlayerMover from "./PlayerMover";
import Block from "./Block";
import CollisionObjectsSorter from "./CollisionObjectsSorter";
import HitTest from "./HitTest";
import BrowserEvents from "../utils/BrowserEvents";
import Globals from "../Globals";
import PixiRequest from "../promises/PixiRequest";

export default class Level extends View {
	private static readonly VERTICAL_BORDER_ID:string = "vertical_border";
	private static readonly HORIZONTAL_BORDER_ID:string = "horizontal_border";
	private _pressedButtons:Map<string, boolean> = new Map<string, boolean>();
	private _lastPressedDirectionButton:string;
	private _blocksTypesData:Map<string, IType> = new Map<string, IType>();
	private _playerMover:PlayerMover;
	private _collisionObjectsSorter:CollisionObjectsSorter;
	private _blocks:Block[] = [];

	constructor(
		private _player:Player,
		private _levelData:ILevel
	) {
		super();
	}

	protected init():void {
		super.init();
		this.addVerticalBorderType();
		this.addHorizontalBorderType();
		this.initTypes();
		this.addVerticalBordersBlocks();
		this.addHorizontalBordersBlocks();
		this.loading();
	}

	private initTypes():void {
		this._levelData.types.forEach((typeData:IType) => {
			this._blocksTypesData.set(typeData.id, typeData);
		});
	}

	private addVerticalBorderType():void {
		this._levelData.types.push({
			id:Level.VERTICAL_BORDER_ID,
			image:null,
			collision:{
				left:0,
				right:50,
				top:0,
				bottom:this._levelData.stage.height
			}
		});
	}

	private addHorizontalBorderType():void {
		this._levelData.types.push({
			id:Level.HORIZONTAL_BORDER_ID,
			image:null,
			collision:{
				left:0,
				right:this._levelData.stage.width,
				top:0,
				bottom:50,
			}
		});
	}

	private addVerticalBordersBlocks():void {
		this._levelData.blocks.push({
			type:Level.VERTICAL_BORDER_ID,
			x:-this._blocksTypesData.get(Level.VERTICAL_BORDER_ID).collision.right,
			y:0
		});
		this._levelData.blocks.push({
			type:Level.VERTICAL_BORDER_ID,
			x:this._levelData.stage.width,
			y:0
		})
	}

	private addHorizontalBordersBlocks():void {
		this._levelData.blocks.push({
			type:Level.HORIZONTAL_BORDER_ID,
			x:0,
			y:-this._blocksTypesData.get(Level.HORIZONTAL_BORDER_ID).collision.bottom
		});
		this._levelData.blocks.push({
			type:Level.HORIZONTAL_BORDER_ID,
			x:0,
			y:this._levelData.stage.height
		})
	}

	private loading():void {
		let needLoadImagesCounter:number = this._levelData.types.length;
		this._levelData.types.forEach((typeData:IType) => {
			if (typeData.image) {
				new PixiRequest().createPromise(typeData.image).then(() => {
					needLoadImagesCounter--;
					if (!needLoadImagesCounter) {
						this.onLoadingCompleted();
					}
				});
			} else {
				needLoadImagesCounter--;
			}
		});
	}

	private onLoadingCompleted():void {
		this.initBlocks();
		this.initPlayer();
		this.addKeyListeners();
		this.initPlayerMover();
		this.initCollisionObjectsSorter();
		this.launchTicker();
	}

	private initPlayer():void {
		this._player.x = 50;
		this._player.y = this.h - this._player.height - 200;
		this.addChild(this._player);
	}

	private initBlocks():void {
		this._levelData.blocks.forEach((blockData:IBlock) => {
			this.initBlock(blockData);
		});
	}

	private initBlock(blockData:IBlock):void {
		const blockTypeData:IType = this._blocksTypesData.get(blockData.type);
		const block:Block = new Block(blockData, blockTypeData);
		block.x = blockData.x - blockTypeData.collision.left;
		block.y = blockData.y - blockTypeData.collision.top;
		this.addChild(block);
		this._blocks.push(block);
	}

	private addKeyListeners():void {
		BrowserEvents.addEvent(
			window,
			BrowserEvents.KEY_DOWN,
			(e:KeyboardEvent) => {
				this.keyDownHandler(e);
			},
		);

		BrowserEvents.addEvent(
			window,
			BrowserEvents.KEY_UP,
			(e:KeyboardEvent) => {
				this.keyUpHandler(e);
			},
		);
	}

	private initPlayerMover():void {
		this._playerMover = new PlayerMover(this._player, this._blocks);
	}

	private initCollisionObjectsSorter():void {
		this._collisionObjectsSorter = new CollisionObjectsSorter(this);
	}

	private launchTicker():void {
		Globals.pixiApp.ticker.add(() => {
			this.refreshPlayerSpeedX();
			this.refreshPlayerSpeedY();
			this._playerMover.refresh();
			this._collisionObjectsSorter.sort();
			if (Globals.getDeveloperMode()) {
				this.refreshCollisionRectangles();
			}
		});
	}

	private refreshCollisionRectangles():void {
		for (let i:number = 0; i < this._blocks.length; i++) {
			if (this._blocks[i].isVisible()) {
				let hit: boolean = false;
				for (let j: number = 0; j < this._blocks.length; j++) {
					if (
						this._blocks[j].isVisible() &&
						i != j &&
						HitTest.horizontal(this._blocks[i], this._blocks[j]) &&
						HitTest.vertical(this._blocks[i], this._blocks[j])
					) {
						hit = true;
						break;
					}
				}
				this._blocks[i].showBlockHit(hit);
			}
		}
	}

	private refreshPlayerSpeedX():void {
		if (this._pressedButtons.get(KEY_LEFT) || this._pressedButtons.get(KEY_RIGHT)) {
			let direction:number;
			if (this._pressedButtons.get(KEY_LEFT) && this._pressedButtons.get(KEY_RIGHT)) {
				direction = this._lastPressedDirectionButton == KEY_LEFT ? -1 : 1;
			} else {
				direction = this._pressedButtons.get(KEY_LEFT) ? -1 : 1;
			}
			this._player.setSpeedX(Player.MOVING_SPEED * direction);
		} else {
			this._player.setSpeedX(0);
		}
	}

	private refreshPlayerSpeedY():void {
		if (this._pressedButtons.get(KEY_UP) && this._player.onTheFloor) {
			this._player.setSpeedY(Player.JUMP_SPEED);
		} else {
			this._player.setSpeedY(this._player.getSpeedY() + Player.GRAVITY);
		}
	}

	private keyDownHandler(e:KeyboardEvent):void {
		switch (e.code) {
			case KEY_LEFT:
			case KEY_RIGHT:
				this._lastPressedDirectionButton = e.code;
				this._pressedButtons.set(e.code, true);
				break;
			case KEY_UP:
				this._pressedButtons.set(e.code, true);
		}

		if (!process.env.RELEASE) {
			switch (e.code) {
				case KEY_BACKQUOTE:
					Globals.setDeveloperMode(!Globals.getDeveloperMode());
					if (Globals.getDeveloperMode()) {
						this.enableDeveloperMode();
					} else {
						this.disableDeveloperMode();
					}
					console.log("Developer mode is " + (Globals.getDeveloperMode() ? "ON" : "OFF"));
					break;

				case KEY_J:
					this.printLevelJson();
					break;
			}
		}
	}

	private enableDeveloperMode():void {
		this._player.showCollisionRectangle(0x00ff00);
		this._blocks.forEach((block:Block) => {
			block.interactive = true;
			block.addListener(POINTER_DOWN, this.blockPointerDownHandler, this);
		});
	}

	private blockPointerDownHandler(event:InteractionEvent):void {
		const currentBlock:Block = (event.currentTarget as Block);
		const pointerDownPoint:Point = new Point(event.data.global.x, event.data.global.y);
		currentBlock.localDragPoint = currentBlock.toLocal(pointerDownPoint);
		currentBlock.addListener(POINTER_MOVE, this.blockPointerMoveHandler, this);
		currentBlock.addListener(POINTER_UP, this.blockPointerUpHandler, this);
		currentBlock.addListener(POINTER_UP_OUTSIDE, this.blockPointerUpHandler, this);
	}

	private blockPointerMoveHandler(event:InteractionEvent):void {
		const currentBlock:Block = (event.currentTarget as Block);
		const containerDragPoint:Point = this.toLocal(new Point(event.data.global.x, event.data.global.y));
		currentBlock.x = Math.round(containerDragPoint.x - currentBlock.localDragPoint.x);
		currentBlock.y = Math.round(containerDragPoint.y - currentBlock.localDragPoint.y);
	}

	private blockPointerUpHandler(event:InteractionEvent):void {
		const currentBlock:Block = (event.currentTarget as Block);
		currentBlock.removeAllListeners(POINTER_MOVE);
		currentBlock.removeAllListeners(POINTER_UP);
		currentBlock.removeAllListeners(POINTER_UP_OUTSIDE);
	}

	private disableDeveloperMode():void {
		this._player.hideCollisionRectangle();
		this._blocks.forEach((block:Block) => {
			block.interactive = false;
			block.hideBlockHit();
			block.removeAllListeners();
		});
	}

	private printLevelJson():void {
		const addedTypes:Set<string> = new Set<string>();
		const typesData:IType[] = [];
		const blocksData:IBlock[] = [];
		this._blocks.forEach((block:Block) => {
			if (
				block.getTypeData().id !== Level.HORIZONTAL_BORDER_ID &&
				block.getTypeData().id !== Level.VERTICAL_BORDER_ID
			) {
				if (!addedTypes.has(block.getTypeData().id)) {
					typesData.push(block.getTypeData());
					addedTypes.add(block.getTypeData().id);
				}
				blocksData.push({
					...block.getData(),
					x: block.collisionLeft(),
					y: block.collisionTop(),
				});
			}
		});
		const levelData:ILevel = {
			...this._levelData,
			types:typesData,
			blocks:blocksData,
		};
		console.log(JSON.stringify(levelData));
	}

	private keyUpHandler(e:KeyboardEvent):void {
		switch (e.code) {
			case KEY_UP:
			case KEY_LEFT:
			case KEY_RIGHT:
				this._pressedButtons.set(e.code, false);
		}
	}
}