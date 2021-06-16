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
import WindowEvents from "../utils/WindowEvents";
import Globals from "../Globals";
import PixiRequest from "../promises/PixiRequest";
import PromisesGroup from "../promises/PromisesGroup";
import LevelsManager from "../model/LevelsManager";

export default class Level extends View {
	private _pressedButtons:Map<string, boolean> = new Map<string, boolean>();
	private _lastPressedDirectionButton:string;
	private _jump:boolean = false;
	private _blocksTypesData:Map<string, IType> = new Map<string, IType>();
	private _playerMover:PlayerMover;
	private _collisionObjectsSorter:CollisionObjectsSorter;
	private _blocks:Block[] = [];
	private _levelData:ILevel;
	private _keyDownCallback:(...params:any[]) => void = null;
	private _keyUpCallback:(...params:any[]) => void = null;
	private _sortTestResults:Set<number> = new Set<number>();
	private _timerId:number;

	constructor(
		private _player:Player,
		levelId:number,
	) {
		super();
		this._levelData = LevelsManager.getLevel(levelId).data;
	}

	protected init():void {
		super.init();
		this.initTypes();
		this.loading();
	}

	private initTypes():void {
		this._levelData.types.forEach((typeData:IType) => {
			this._blocksTypesData.set(typeData.id, typeData);
		});
	}

	private loading():void {
		const factories:(() => Promise<any>)[] = [];
		this._levelData.types.forEach((typeData:IType) => {
			if (typeData.image) {
				factories.push(() => new PixiRequest(typeData.image).createPromise());
			}
		});
		PromisesGroup.pack(factories)
			.finally(() => { this.onLoadingCompleted(); });
	}

	private onLoadingCompleted():void {
		this.initBlocks();
		this.initPlayer();
		this.addKeyListeners();
		this.initPlayerMover();
		this.initCollisionObjectsSorter();
		// this.launchTicker();
		this._timerId = window.setInterval(
			() => {
				this.sortTest();
			},
			300
		);
	}

	private sortTest():void {
		let startTime:number = performance.now();
		let i = 0;
		while (i < 10000) {
			this._collisionObjectsSorter.sort();
			i++;
		}
		this._sortTestResults.add(performance.now() - startTime);
		if (this._sortTestResults.size == 10) {
			window.clearInterval(this._timerId);
			let totalTime:number = 0;
			this._sortTestResults.forEach((sortTestResult:number) => {
				totalTime += sortTestResult;
			});
			console.log("Sort time: " + (totalTime / this._sortTestResults.size)); // Result: 129
		}
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
		this._keyDownCallback = WindowEvents.add(
			WindowEvents.KEY_DOWN,
			(e:KeyboardEvent) => {
				this.keyDownHandler(e);
			},
		);

		this._keyUpCallback = WindowEvents.add(
			WindowEvents.KEY_UP,
			(e:KeyboardEvent) => {
				this.keyUpHandler(e);
			},
		);
	}

	private removeKeyListeners():void {
		if (this._keyDownCallback) {
			WindowEvents.remove(WindowEvents.KEY_DOWN, this._keyDownCallback);
		}
		if (this._keyUpCallback) {
			WindowEvents.remove(WindowEvents.KEY_UP, this._keyUpCallback);
		}
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
			if (Globals.getDeveloperMode()) {
				this.refreshCollisionRectangles();
			} else {
				this._collisionObjectsSorter.sort();
			}
		});
	}

	private refreshCollisionRectangles():void {
		for (let i:number = 0; i < this._blocks.length; i++) {
			let hit: boolean = false;
			for (let j: number = 0; j < this._blocks.length; j++) {
				if (
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

	private refreshPlayerSpeedX():void {
		const slowdown:boolean = !this._pressedButtons.get(KEY_LEFT) && !this._pressedButtons.get(KEY_RIGHT);
		if (!slowdown || Math.abs(this._player.getSpeedX()) > .1) {
			let direction: number;
			if (this._pressedButtons.get(KEY_LEFT) && this._pressedButtons.get(KEY_RIGHT)) {
				direction = this._lastPressedDirectionButton == KEY_LEFT ? -1 : 1;
			} else if (slowdown) {
				direction = this._player.getSpeedX() > 0 ? -1 : 1;
			} else {
				direction = this._pressedButtons.get(KEY_LEFT) ? -1 : 1;
			}
			let distance: number;
			if (slowdown) {
				distance = Math.abs(this._player.getSpeedX());
			} else {
				distance = Player.MAX_MOVING_SPEED - this._player.getSpeedX() * direction;
			}
			this._player.setSpeedX(this._player.getSpeedX() + distance * direction * Player.MOVING_ACCELERATION_FACTOR);
		} else {
			this._player.setSpeedX(0);
		}
	}

	private refreshPlayerSpeedY():void {
		if (this._player.onTheFloor && this._jump) {
			this._jump = false;
			this._player.setSpeedY(Player.JUMP_SPEED);
		} else if (!this._player.onTheFloor && !this._pressedButtons.get(KEY_UP) && this._player.getSpeedY() < 0) {
			this._player.setSpeedY(this._player.getSpeedY() + Math.min(-this._player.getSpeedY(), Player.JUMP_SLOWDOWN));
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
				if (!this._pressedButtons.get(e.code)) {
					this._jump = true;
					this._pressedButtons.set(e.code, true);
				}
				break;

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
			block.hideBlockHit();
			block.removeAllListeners();
		});
	}

	private printLevelJson():void {
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
			...this._levelData,
			types:typesData,
			blocks:blocksData,
		};
		console.log(JSON.stringify(levelData));
	}

	private keyUpHandler(e:KeyboardEvent):void {
		if (e.code == KEY_UP) {
			this._jump = false;
		}

		switch (e.code) {
			case KEY_UP:
			case KEY_LEFT:
			case KEY_RIGHT:
				this._pressedButtons.set(e.code, false);
		}
	}
}