import Player from "./Player";
import Graphics = PIXI.Graphics;
import {View} from "./View";
import Sprite = PIXI.Sprite;
import Container = PIXI.Container;
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
	private _blocks:IBlock[] = [];
	private _blocksTypes:Map<string, IType> = new Map<string, IType>();
	private _backContainer:Container;
	private _hitsContainer:Container;
	private _level:ILevel;
	private _unitsControl:UnitsControl;
	private _draggedBlock:IBlock;

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
				this._level = level;
				typesNum = this._level.types.length;
				this._level.types.forEach((type:IType) => {
					pixiLoading(type.image).then(() => {
						this._blocksTypes.set(type.id, type);
						loadedTypesImagesCounter++;
						if (loadedTypesImagesCounter == typesNum) {
							this.initBackContainer();
							this.initHitsContainer();
							this.initPlayer();
							this.initBlocks();
							this.addKeyListeners();
							this.initUnitsControl();
							this.launchTicker();
						}
					});
				});
			});
	}

	private initBackContainer():void {
		this._backContainer = new Container();
		this.addChild(this._backContainer);
	}

	private initHitsContainer():void {
		this._hitsContainer = new Container();
		this.addChild(this._hitsContainer);
		this.refreshHitsContainerVisibility();
	}

	private refreshHitsContainerVisibility():void {
		this._hitsContainer.visible = Globals.developerMode.get();
	}

	private initPlayer():void {
		this._player.x = 50;
		this._player.y = this.h - this._player.height - 200;
		this.addChild(this._player);
	}

	private initBlocks():void {
		this._level.blocks.forEach((block:IBlock) => {
			this.initBlock(block);
		});
	}

	private initBlock(block:IBlock):void {
		this._blocks.push(block);

		const blockType:IType = this._blocksTypes.get(block.type);
		const blockHit:Graphics = new Graphics();
		blockHit.x = block.x;
		blockHit.y = block.y;
		blockHit.beginFill(0x000000, 1);
		blockHit.drawRect(0, 0, blockType.hit.width, blockType.hit.height);
		blockHit.endFill();
		this._hitsContainer.addChild(blockHit);
		block.hit = blockHit;

		const backSkin:Sprite = Sprite.from(blockType.image);
		backSkin.x = block.x - blockType.hit.x;
		backSkin.y = block.y - blockType.hit.y;
		this._backContainer.addChild(backSkin);
		block.backSkin = backSkin;
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
		this._blocks.forEach((block:IBlock) => {
			this._unitsControl.addHit(block.hit);
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
					this.refreshHitsContainerVisibility();
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
				this._blocks.forEach((block:IBlock) => {
					if (json === "") {
						/* tslint:disable */
						json = '{"types":[{"id":"sand","image":"img/sandBlock.png","hit": {"x":31,"y":15,"width":138,"height":138},"blocks":[';
						/* tslint:enable */
					} else {
						json += ',';
					}
					json += '{';
					json += '"type":"sand",';
					json += '"x":' + block.hit.x + ',';
					json += '"y":' + block.hit.y;
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
		this._blocks.forEach((block:IBlock) => {
			const backSkin:Sprite = block.backSkin;
			backSkin.interactive = true;
			backSkin.addListener(
				POINTER_DOWN,
				(event:InteractionEvent) => {
					this.blockPointerDownHandler(
						block,
						new Point(event.data.global.x, event.data.global.y)
					);
				},
				this
			);
		});
	}

	private blockPointerDownHandler(block:IBlock, pointerDownPoint:Point):void {
		this._draggedBlock = block;
		this._draggedBlock.localDragPoint = this._draggedBlock.backSkin.toLocal(pointerDownPoint);
		const backSkin:Sprite = this._draggedBlock.backSkin;
		backSkin.addListener(POINTER_MOVE, this.blockPointerMoveHandler, this);
		backSkin.addListener(POINTER_UP, this.blockPointerUpHandler, this);
		backSkin.addListener(POINTER_UP_OUTSIDE, this.blockPointerUpHandler, this);
	}

	private blockPointerMoveHandler(event:InteractionEvent):void {
		const containerDragPoint:Point = this.toLocal(new Point(event.data.global.x, event.data.global.y));
		const backSkin:Sprite = this._draggedBlock.backSkin;
		backSkin.x = Math.round(containerDragPoint.x - this._draggedBlock.localDragPoint.x);
		backSkin.y = Math.round(containerDragPoint.y - this._draggedBlock.localDragPoint.y);

		const blockType:IType = this._blocksTypes.get(this._draggedBlock.type);

		const hit:Graphics = this._draggedBlock.hit;
		hit.x = backSkin.x + blockType.hit.x;
		hit.y = backSkin.y + blockType.hit.y;
	}

	private blockPointerUpHandler():void {
		const backSkin:Sprite = this._draggedBlock.backSkin;
		backSkin.removeAllListeners(POINTER_MOVE);
		backSkin.removeAllListeners(POINTER_UP);
		backSkin.removeAllListeners(POINTER_UP_OUTSIDE);
		this._draggedBlock = null;
	}

	private disableDeveloperMode():void {
		this._blocks.forEach((block:IBlock) => {
			const backSkin:Sprite = block.backSkin;
			backSkin.interactive = false;
			backSkin.removeAllListeners(POINTER_DOWN);
			backSkin.removeAllListeners(POINTER_UP);
			backSkin.removeAllListeners(POINTER_UP_OUTSIDE);
		});

		if (this._draggedBlock) {
			this._draggedBlock.backSkin.removeAllListeners(POINTER_MOVE);
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