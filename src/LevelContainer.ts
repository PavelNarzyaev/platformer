import Player from "./Player";
import Graphics = PIXI.Graphics;
import {View} from "./View";
import Sprite = PIXI.Sprite;
import Container = PIXI.Container;
import Texture = PIXI.Texture;
import Rectangle = PIXI.Rectangle;
import {pixiLoading, xhrJsonLoading} from "./Promises";
import {addEvent, default as Globals} from "./Globals";
import {POINTER_DOWN, POINTER_MOVE, POINTER_UP, POINTER_UP_OUTSIDE} from "./consts/PointerEvents";
import InteractionEvent = PIXI.interaction.InteractionEvent;
import Point = PIXI.Point;
import {KEY_BACKQUOTE, KEY_DOWN, KEY_LEFT, KEY_RIGHT, KEY_UP} from "./consts/KeyboardCodes";
import {IBlock, IFront, ILevel, IType} from "./Interfaces";
import UnitsControl from "./UnitsControl";

export default class LevelContainer extends View {
	private _pressedButtons:Map<string, boolean> = new Map<string, boolean>();
	private _blocks:IBlock[] = [];
	private _blocksTypes:Map<string, IType> = new Map<string, IType>();
	private _backContainer:Container;
	private _hitsContainer:Container;
	private _frontContainer:Container;
	private _frontTexturesCache:Map<string, Texture> = new Map<string, Texture>();
	private _level:ILevel;
	private _unitsControl:UnitsControl;

	// DEVELOP_MODE
	private _draggedBlock:IBlock;
	private _draggedBlockShiftPoint:Point;

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
							this.initFrontContainer();
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
	}

	private initPlayer():void {
		this._player.x = 50;
		this._player.y = this.h - this._player.height - 200;
		this.addChild(this._player);
	}

	private initFrontContainer():void {
		this._frontContainer = new Container();
		this.addChild(this._frontContainer);
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

		const front:IFront = blockType.front;
		let frontTexture:Texture;
		if (!this._frontTexturesCache.get(blockType.id)) {
			frontTexture = new Texture(
				Texture.from(blockType.image).baseTexture,
				new Rectangle(front.x, front.y, front.width, front.height),
			);
			this._frontTexturesCache.set(blockType.id, frontTexture);
		} else {
			frontTexture = this._frontTexturesCache.get(blockType.id);
		}
		const frontSkin:Sprite = new Sprite(frontTexture);
		frontSkin.x = backSkin.x + blockType.front.x;
		frontSkin.y = backSkin.y + blockType.front.y;
		this._frontContainer.addChild(frontSkin);
		block.frontSkin = frontSkin;
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
					this._hitsContainer.visible = Globals.developerMode.get();
					this._frontContainer.alpha = Globals.developerMode.get() ? .3 : 1;
					if (Globals.developerMode.get()) {
						this.enableDeveloperMode();
					} else {
						this.disableDeveloperMode();
					}
					console.log("Developer mode is " + (Globals.developerMode.get() ? "ON" : "OFF"));
				}
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
		this._draggedBlockShiftPoint = this._draggedBlock.backSkin.toLocal(pointerDownPoint);
		const backSkin:Sprite = this._draggedBlock.backSkin;
		backSkin.addListener(POINTER_MOVE, this.blockPointerMoveHandler, this);
		backSkin.addListener(POINTER_UP, this.blockPointerUpHandler, this);
		backSkin.addListener(POINTER_UP_OUTSIDE, this.blockPointerUpHandler, this);
	}

	private blockPointerMoveHandler(event:InteractionEvent):void {
		const containerPoint:Point = this.toLocal(new Point(event.data.global.x, event.data.global.y));
		const backSkin:Sprite = this._draggedBlock.backSkin;
		backSkin.x = Math.round(containerPoint.x - this._draggedBlockShiftPoint.x);
		backSkin.y = Math.round(containerPoint.y - this._draggedBlockShiftPoint.y);

		const blockType:IType = this._blocksTypes.get(this._draggedBlock.type);

		const hit:Graphics = this._draggedBlock.hit;
		hit.x = backSkin.x + blockType.hit.x;
		hit.y = backSkin.y + blockType.hit.y;

		const frontSkin:Sprite = this._draggedBlock.frontSkin;
		frontSkin.x = backSkin.x + blockType.front.x;
		frontSkin.y = backSkin.y + blockType.front.y;
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