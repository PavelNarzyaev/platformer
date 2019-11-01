import Player from "./Player";
import Graphics = PIXI.Graphics;
import HitTest from "./HitTest";
import {View} from "./View";
import Sprite = PIXI.Sprite;
import Container = PIXI.Container;
import Texture = PIXI.Texture;
import Rectangle = PIXI.Rectangle;
import {pixiLoading, xhrJsonLoading} from "./Promises";
import {addEvent, default as Globals} from "./Globals";
import {POINTER_DOWN, POINTER_MOVE, POINTER_UP, POINTER_UP_OUTSIDE} from "./PointerEvents";
import InteractionEvent = PIXI.interaction.InteractionEvent;
import Point = PIXI.Point;

export default class LevelContainer extends View {
	private static readonly UP:string = "ArrowUp";
	private static readonly DOWN:string = "ArrowDown";
	private static readonly LEFT:string = "ArrowLeft";
	private static readonly RIGHT:string = "ArrowRight";
	private static readonly BACKQUOTE:string = "Backquote";
	private _pressedButtons:Map<string, boolean> = new Map<string, boolean>();
	private _blocksHits:Graphics[] = [];
	private _backSkins:Map<Graphics, Sprite> = new Map<Graphics, Sprite>();
	private _frontSkins:Map<Graphics, Sprite> = new Map<Graphics, Sprite>();
	private _blocks:Map<Graphics, IBlock> = new Map<Graphics, IBlock>();
	private _blocksTypes:Map<string, IType> = new Map<string, IType>();
	private _backContainer:Container;
	private _frontContainer:Container;
	private _frontTexturesCache:Map<string, Texture> = new Map<string, Texture>();
	private _level:ILevel;

	// DEVELOP_MODE
	private _draggedBlock:Graphics;
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
							this.initPlayer();
							this.initFrontContainer();
							this.initBlocks();
							this.addKeyListeners();
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
		const blockType:IType = this._blocksTypes.get(block.type);
		const newBlockHit:Graphics = new Graphics();
		newBlockHit.x = block.x;
		newBlockHit.y = block.y;
		newBlockHit.beginFill(0x000000, 1);
		newBlockHit.drawRect(0, 0, blockType.hit.width, blockType.hit.height);
		newBlockHit.endFill();
		// newBlockHit.alpha = 0;
		this.addChild(newBlockHit);
		this._blocksHits.push(newBlockHit);
		this._blocks.set(newBlockHit, block);

		const backSkin:Sprite = Sprite.from(blockType.image);
		backSkin.x = block.x - blockType.hit.x;
		backSkin.y = block.y - blockType.hit.y;
		this._backContainer.addChild(backSkin);
		this._backSkins.set(newBlockHit, backSkin);

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
		this._frontSkins.set(newBlockHit, frontSkin);
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

	private launchTicker():void {
		Globals.pixiApp.ticker.add(() => {
			this.jumping();
			this.horizontalMoving();
			this.verticalMoving();
		});
	}

	private jumping():void {
		if (this._pressedButtons.get(LevelContainer.UP) && this._player.canJump) {
			this._player.canJump = false;
			this._player.speedY = Player.JUMP_SPEED;
		}
	}

	private horizontalMoving():void {
		let canMove:boolean = true;
		let limitX:number;
		switch (this._player.getMovingDirection()) {
			case Player.LEFT:
				this._blocksHits.forEach((blockHit:Graphics) => {
					limitX = blockHit.x + blockHit.width - this._player.collisionLeft();
					if (
						this._player.x >= limitX &&
						this._player.x - Player.MOVING_SPEED < limitX &&
						HitTest.vertical(this._player, blockHit)
					) {
						this._player.x = limitX;
						canMove = false;
					}
				});
				if (canMove) {
					this._player.x -= Player.MOVING_SPEED;
				}
				break;

			case Player.RIGHT:
				this._blocksHits.forEach((blockHit:Graphics) => {
					limitX = blockHit.x - this._player.collisionRight();
					if (
						this._player.x <= limitX &&
						this._player.x + Player.MOVING_SPEED > limitX &&
						HitTest.vertical(this._player, blockHit)
					) {
						this._player.x = limitX;
						canMove = false;
					}
				});
				if (canMove) {
					this._player.x += Player.MOVING_SPEED;
				}
				break;
		}
	}

	private verticalMoving():void {
		let limitY:number;
		this._player.speedY += Player.GRAVITY;
		if (this._player.speedY > 0) {
			this._blocksHits.forEach((blockHit:Graphics) => {
				limitY = blockHit.y - this._player.collisionBottom();
				if (
					this._player.y <= limitY &&
					this._player.y + this._player.speedY > limitY &&
					HitTest.horizontal(this._player, blockHit)
				) {
					this._player.y = limitY;
					this._player.canJump = true;
					this._player.speedY = 0;
				}
			});
			if (this._player.speedY !== 0) {
				this._player.canJump = false;
				this._player.y += this._player.speedY;
			}
		} else if (this._player.speedY < 0) {
			this._blocksHits.forEach((blockHit:Graphics) => {
				limitY = blockHit.y + blockHit.height - this._player.collisionTop();
				if (
					this._player.y >= limitY &&
					this._player.y + this._player.speedY < limitY &&
					HitTest.horizontal(this._player, blockHit)
				) {
					this._player.y = limitY;
					this._player.speedY = 0;
				}
			});
			if (this._player.speedY !== 0) {
				this._player.y += this._player.speedY;
			}
		}
	}

	private keyDownHandler(e:KeyboardEvent):void {
		switch (e.code) {
			case LevelContainer.LEFT:
				if (!this._pressedButtons.get(e.code)) {
					this._player.moveLeft();
				}
				break;

			case LevelContainer.RIGHT:
				if (!this._pressedButtons.get(e.code)) {
					this._player.moveRight();
				}
				break;
		}

		switch (e.code) {
			case LevelContainer.UP:
			case LevelContainer.DOWN:
			case LevelContainer.LEFT:
			case LevelContainer.RIGHT:
				this._pressedButtons.set(e.code, true);
		}

		if (e.code === LevelContainer.BACKQUOTE && !process.env.RELEASE) {
			Globals.developerMode.set(!Globals.developerMode.get());

			if (Globals.developerMode.get()) {
				this.enableDeveloperMode();
			} else {
				this.disableDeveloperMode();
			}
			console.log("Developer mode is " + (Globals.developerMode.get() ? "ON" : "OFF"));
		}
	}

	private enableDeveloperMode():void {
		this._blocksHits.forEach((blockHit:Graphics) => {
			blockHit.interactive = true;
			blockHit.addListener(POINTER_DOWN, this.blockPointerDownHandler, this);
		});
	}

	private blockPointerDownHandler(event:InteractionEvent):void {
		this._draggedBlock = event.currentTarget as Graphics;
		this._draggedBlockShiftPoint = this._draggedBlock.toLocal(new Point(event.data.global.x, event.data.global.y));
		this._draggedBlock.addListener(POINTER_MOVE, this.blockPointerMoveHandler, this);
		this._draggedBlock.addListener(POINTER_UP, this.blockPointerUpHandler, this);
		this._draggedBlock.addListener(POINTER_UP_OUTSIDE, this.blockPointerUpHandler, this);
	}

	private blockPointerMoveHandler(event:InteractionEvent):void {
		const containerPoint:Point = this.toLocal(new Point(event.data.global.x, event.data.global.y));
		this._draggedBlock.x = Math.round(containerPoint.x - this._draggedBlockShiftPoint.x);
		this._draggedBlock.y = Math.round(containerPoint.y - this._draggedBlockShiftPoint.y);

		const blockType:IType = this._blocksTypes.get(this._blocks.get(this._draggedBlock).type);

		const backSkin:Sprite = this._backSkins.get(this._draggedBlock);
		backSkin.x = this._draggedBlock.x - blockType.hit.x;
		backSkin.y = this._draggedBlock.y - blockType.hit.y;

		const frontSkin:Sprite = this._frontSkins.get(this._draggedBlock);
		frontSkin.x = backSkin.x + blockType.front.x;
		frontSkin.y = backSkin.y + blockType.front.y;
	}

	private blockPointerUpHandler():void {
		this._draggedBlock.removeAllListeners(POINTER_MOVE);
		this._draggedBlock.removeAllListeners(POINTER_UP);
		this._draggedBlock.removeAllListeners(POINTER_UP_OUTSIDE);
		this._draggedBlock = null;
	}

	private disableDeveloperMode():void {
		this._blocksHits.forEach((blockHit:Graphics) => {
			blockHit.interactive = false;
			blockHit.removeAllListeners(POINTER_DOWN);
			blockHit.removeAllListeners(POINTER_UP);
			blockHit.removeAllListeners(POINTER_UP_OUTSIDE);
		});

		if (this._draggedBlock) {
			this._draggedBlock.removeAllListeners(POINTER_MOVE);
		}
	}

	private keyUpHandler(e:KeyboardEvent):void {
		switch (e.code) {
			case LevelContainer.LEFT:
				if (this._pressedButtons.get(LevelContainer.RIGHT)) {
					this._player.moveRight();
				} else {
					this._player.stop();
				}
				break;

			case LevelContainer.RIGHT:
				if (this._pressedButtons.get(LevelContainer.LEFT)) {
					this._player.moveLeft();
				} else {
					this._player.stop();
				}
				break;
		}

		switch (e.code) {
			case LevelContainer.UP:
			case LevelContainer.DOWN:
			case LevelContainer.LEFT:
			case LevelContainer.RIGHT:
				this._pressedButtons.set(e.code, false);
		}
	}
}

interface ILevel {
	types:IType[];
	blocks:IBlock[];
}

interface IType {
	id:string;
	image:string;
	hit:IHit;
	front:IFront;
}

interface IHit {
	x:number;
	y:number;
	width:number;
	height:number;
}

interface IFront {
	x:number;
	y:number;
	width:number;
	height:number;
}

interface IBlock {
	type:string;
	x:number;
	y:number;
}