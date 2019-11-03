import Player from "./Player";
import Graphics = PIXI.Graphics;
import {View} from "./View";
import Sprite = PIXI.Sprite;
import {pixiLoading, xhrJsonLoading} from "./Promises";
import {addEvent, default as Globals} from "./Globals";
import {POINTER_DOWN, POINTER_MOVE, POINTER_UP, POINTER_UP_OUTSIDE} from "./consts/PointerEvents";
import InteractionEvent = PIXI.interaction.InteractionEvent;
import Point = PIXI.Point;
import {KEY_BACKQUOTE, KEY_DOWN, KEY_J, KEY_LEFT, KEY_RIGHT, KEY_UP} from "./consts/KeyboardCodes";
import {IBlock, ILevel, IType} from "./Interfaces";
import UnitsControl from "./UnitsControl";

export default class LevelContainer extends View {
	private _pressedButtons:Map<string, boolean> = new Map<string, boolean>();
	private _levelData:ILevel;
	private _blocksData:IBlock[] = [];
	private _blocksTypesData:Map<string, IType> = new Map<string, IType>();
	private _unitsControl:UnitsControl;
	private _draggedBlockData:IBlock;

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
		this._blocksData.push(blockData);

		const blockTypeData:IType = this._blocksTypesData.get(blockData.type);
		const blockHit:Graphics = new Graphics();
		blockHit.x = blockData.x;
		blockHit.y = blockData.y;
		blockHit.beginFill(0x000000, 0);
		blockHit.drawRect(0, 0, blockTypeData.hit.width, blockTypeData.hit.height);
		blockHit.endFill();
		this.addChild(blockHit);
		blockData.hit = blockHit;

		const backSkin:Sprite = Sprite.from(blockTypeData.image);
		backSkin.x = blockData.x - blockTypeData.hit.x;
		backSkin.y = blockData.y - blockTypeData.hit.y;
		this.addChild(backSkin);
		blockData.backSkin = backSkin;
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
		this._unitsControl = new UnitsControl(this._player);
		this._blocksData.forEach((blockData:IBlock) => {
			this._unitsControl.addHit(blockData.hit);
		});
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
				let json:string = '';
				this._blocksData.forEach((blockData:IBlock) => {
					if (json === "") {
						/* tslint:disable */
						json = '{"types":[{"id":"sand","image":"img/sandBlock.png","hit": {"x":31,"y":15,"width":138,"height":138},"blocks":[';
						/* tslint:enable */
					} else {
						json += ',';
					}
					json += '{';
					json += '"type":"sand",';
					json += '"x":' + blockData.hit.x + ',';
					json += '"y":' + blockData.hit.y;
					json += '}'
				});
				json += ']}';
				console.log(json);
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
		this._blocksData.forEach((blockData:IBlock) => {
			const backSkin:Sprite = blockData.backSkin;
			backSkin.interactive = true;
			backSkin.addListener(
				POINTER_DOWN,
				(event:InteractionEvent) => {
					this.blockPointerDownHandler(
						blockData,
						new Point(event.data.global.x, event.data.global.y)
					);
				},
				this
			);
		});
	}

	private blockPointerDownHandler(blockData:IBlock, pointerDownPoint:Point):void {
		this._draggedBlockData = blockData;
		this._draggedBlockData.localDragPoint = this._draggedBlockData.backSkin.toLocal(pointerDownPoint);
		const backSkin:Sprite = this._draggedBlockData.backSkin;
		backSkin.addListener(POINTER_MOVE, this.blockPointerMoveHandler, this);
		backSkin.addListener(POINTER_UP, this.blockPointerUpHandler, this);
		backSkin.addListener(POINTER_UP_OUTSIDE, this.blockPointerUpHandler, this);
	}

	private blockPointerMoveHandler(event:InteractionEvent):void {
		const containerDragPoint:Point = this.toLocal(new Point(event.data.global.x, event.data.global.y));
		const backSkin:Sprite = this._draggedBlockData.backSkin;
		backSkin.x = Math.round(containerDragPoint.x - this._draggedBlockData.localDragPoint.x);
		backSkin.y = Math.round(containerDragPoint.y - this._draggedBlockData.localDragPoint.y);

		const blockTypeData:IType = this._blocksTypesData.get(this._draggedBlockData.type);

		const hit:Graphics = this._draggedBlockData.hit;
		hit.x = backSkin.x + blockTypeData.hit.x;
		hit.y = backSkin.y + blockTypeData.hit.y;
	}

	private blockPointerUpHandler():void {
		const backSkin:Sprite = this._draggedBlockData.backSkin;
		backSkin.removeAllListeners(POINTER_MOVE);
		backSkin.removeAllListeners(POINTER_UP);
		backSkin.removeAllListeners(POINTER_UP_OUTSIDE);
		this._draggedBlockData = null;
	}

	private disableDeveloperMode():void {
		this._blocksData.forEach((blockData:IBlock) => {
			const backSkin:Sprite = blockData.backSkin;
			backSkin.interactive = false;
			backSkin.removeAllListeners(POINTER_DOWN);
			backSkin.removeAllListeners(POINTER_UP);
			backSkin.removeAllListeners(POINTER_UP_OUTSIDE);
		});

		if (this._draggedBlockData) {
			this._draggedBlockData.backSkin.removeAllListeners(POINTER_MOVE);
		}
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