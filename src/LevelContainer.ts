import Player from "./Player";
import Graphics = PIXI.Graphics;
import {addEvent, default as Globals} from "./Globals";
import HitTest from "./HitTest";
import {View} from "./View";
import Sprite = PIXI.Sprite;
import Container = PIXI.Container;
import Texture = PIXI.Texture;
import Rectangle = PIXI.Rectangle;
import {pixiLoading, xhrJsonLoading} from "./Promises";

export default class LevelContainer extends View {
	private static readonly UP:string = "ArrowUp";
	private static readonly DOWN:string = "ArrowDown";
	private static readonly LEFT:string = "ArrowLeft";
	private static readonly RIGHT:string = "ArrowRight";
	private _pressedButtons:Map<string, boolean> = new Map<string, boolean>();
	private _blocks:Graphics[] = [];
	private _blocksTypes:Map<string, IType> = new Map<string, IType>();
	private _backContainer:Container;
	private _frontContainer:Container;
	private _frontTexturesCache:Map<string, Texture> = new Map<string, Texture>();
	private _level:ILevel;

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
		const newBlock:Graphics = new Graphics();
		newBlock.x = block.x;
		newBlock.y = block.y;
		newBlock.beginFill(0x000000, 0);
		newBlock.drawRect(0, 0, blockType.hit.width, blockType.hit.height);
		newBlock.endFill();
		this.addChild(newBlock);
		this._blocks.push(newBlock);

		const backSkin:Sprite = Sprite.from(blockType.image);
		backSkin.x = block.x - blockType.hit.x;
		backSkin.y = block.y - blockType.hit.y;
		this._backContainer.addChild(backSkin);

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
		frontSkin.x = backSkin.x;
		frontSkin.y = backSkin.y + 15;
		this._frontContainer.addChild(frontSkin);
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
				this._blocks.forEach((block:Graphics) => {
					limitX = block.x + block.width - this._player.collisionLeft();
					if (
						this._player.x >= limitX &&
						this._player.x - Player.MOVING_SPEED < limitX &&
						HitTest.vertical(this._player, block)
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
				this._blocks.forEach((block:Graphics) => {
					limitX = block.x - this._player.collisionRight();
					if (
						this._player.x <= limitX &&
						this._player.x + Player.MOVING_SPEED > limitX &&
						HitTest.vertical(this._player, block)
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
			this._blocks.forEach((block:Graphics) => {
				limitY = block.y - this._player.collisionBottom();
				if (
					this._player.y <= limitY &&
					this._player.y + this._player.speedY > limitY &&
					HitTest.horizontal(this._player, block)
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
			this._blocks.forEach((block:Graphics) => {
				limitY = block.y + block.height - this._player.collisionTop();
				if (
					this._player.y >= limitY &&
					this._player.y + this._player.speedY < limitY &&
					HitTest.horizontal(this._player, block)
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