import Player from "./Player";
import {View} from "./View";
import {pixiLoading, xhrJsonLoading} from "./Promises";
import {addEvent, default as Globals} from "./Globals";
import {POINTER_DOWN, POINTER_MOVE, POINTER_UP, POINTER_UP_OUTSIDE} from "./consts/PointerEvents";
import InteractionEvent = PIXI.interaction.InteractionEvent;
import Point = PIXI.Point;
import {KEY_BACKQUOTE, KEY_DOWN, KEY_J, KEY_LEFT, KEY_RIGHT, KEY_UP} from "./consts/KeyboardCodes";
import {IBlock, ILevel, IType} from "./Interfaces";
import UnitsControl from "./UnitsControl";
import Block from "./Block";

export default class LevelContainer extends View {
	private _pressedButtons:Map<string, boolean> = new Map<string, boolean>();
	private _levelData:ILevel;
	private _blocksTypesData:Map<string, IType> = new Map<string, IType>();
	private _unitsControl:UnitsControl;
	private _blocks:Block[] = [];

	constructor(
		private _player:Player,
		private _levelUrl:string,
	) {
		super();
	}

	protected init():void {
		super.init();
		this.loading();
	}

	private loading():void {
		let typesNum:number;
		let loadedTypesImagesCounter:number = 0;
		xhrJsonLoading(this._levelUrl)
			.then((level:ILevel) => {
				this._levelData = level;
				typesNum = this._levelData.types.length;
				this._levelData.types.forEach((typeData:IType) => {
					pixiLoading(typeData.image).then(() => {
						this._blocksTypesData.set(typeData.id, typeData);
						loadedTypesImagesCounter++;
						if (loadedTypesImagesCounter == typesNum) {
							this.initBlocks();
							this.initPlayer();
							this.addKeyListeners();
							this.initUnitsControl();
							this.launchTicker();
						}
					});
				});
			});
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
		addEvent(
			window,
			"keydown",
			(e:KeyboardEvent) => {
				this.keyDownHandler(e);
			},
		);

		addEvent(
			window,
			"keyup",
			(e:KeyboardEvent) => {
				this.keyUpHandler(e);
			},
		);
	}

	private initUnitsControl():void {
		this._unitsControl = new UnitsControl(this._player, this._blocks);
	}

	private launchTicker():void {
		Globals.pixiApp.ticker.add(() => {
			this.jumping();
			this._unitsControl.refresh();
		});
	}

	private jumping():void {
		if (this._pressedButtons.get(KEY_UP) && this._player.canJump) {
			this._player.canJump = false;
			this._player.speedY = Player.JUMP_SPEED;
		}
	}

	private keyDownHandler(e:KeyboardEvent):void {
		switch (e.code) {
			case KEY_LEFT:
				if (!this._pressedButtons.get(e.code)) {
					this._player.moveLeft();
				}
				break;

			case KEY_RIGHT:
				if (!this._pressedButtons.get(e.code)) {
					this._player.moveRight();
				}
				break;

			case KEY_BACKQUOTE:
				if (!process.env.RELEASE) {
					Globals.developerMode.set(!Globals.developerMode.get());
					if (Globals.developerMode.get()) {
						this.enableDeveloperMode();
					} else {
						this.disableDeveloperMode();
					}
					console.log("Developer mode is " + (Globals.developerMode.get() ? "ON" : "OFF"));
				}
				break;

			case KEY_J:
				const addedTypes:Set<string> = new Set<string>();
				const typesData:IType[] = [];
				const blocksData:IBlock[] = [];
				this._blocks.forEach((block:Block) => {
					if (!addedTypes.has(block.getTypeData().id)) {
						typesData.push(block.getTypeData());
						addedTypes.add(block.getTypeData().id);
					}
					blocksData.push({
						...block.getData(),
						x: block.collisionLeft(),
						y: block.collisionTop(),
					});
				});
				const levelData:ILevel = {
					types:typesData,
					blocks:blocksData,
				};
				console.log(JSON.stringify(levelData));
				break;
		}

		switch (e.code) {
			case KEY_UP:
			case KEY_DOWN:
			case KEY_LEFT:
			case KEY_RIGHT:
				this._pressedButtons.set(e.code, true);
		}
	}

	private enableDeveloperMode():void {
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
		this._blocks.forEach((block:Block) => {
			block.interactive = false;
			block.removeAllListeners();
		});
	}

	private keyUpHandler(e:KeyboardEvent):void {
		switch (e.code) {
			case KEY_LEFT:
				if (this._pressedButtons.get(KEY_RIGHT)) {
					this._player.moveRight();
				} else {
					this._player.stop();
				}
				break;

			case KEY_RIGHT:
				if (this._pressedButtons.get(KEY_LEFT)) {
					this._player.moveLeft();
				} else {
					this._player.stop();
				}
				break;
		}

		switch (e.code) {
			case KEY_UP:
			case KEY_DOWN:
			case KEY_LEFT:
			case KEY_RIGHT:
				this._pressedButtons.set(e.code, false);
		}
	}
}