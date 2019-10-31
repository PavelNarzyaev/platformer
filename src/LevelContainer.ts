import Player from "./Player";
import Graphics = PIXI.Graphics;
import {addEvent, default as Globals} from "./Globals";
import HitTest from "./HitTest";
import {View} from "./View";
import Sprite = PIXI.Sprite;
import MainContainer from "./MainContainer";
import Container = PIXI.Container;
import Texture = PIXI.Texture;
import Rectangle = PIXI.Rectangle;
import {xhrJsonLoading} from "./Promises";

export default class LevelContainer extends View {
	private static readonly UP:string = "ArrowUp";
	private static readonly DOWN:string = "ArrowDown";
	private static readonly LEFT:string = "ArrowLeft";
	private static readonly RIGHT:string = "ArrowRight";
	private _pressedButtons:Map<string, boolean> = new Map<string, boolean>();
	private _blocks:Graphics[] = [];
	private _backContainer:Container;
	private _frontContainer:Container;
	private _level:ILevel;

	constructor(
		private _player:Player,
	) {
		super();
	}

	protected init():void {
		super.init();
		this.loading();
	}

	private loading():void {
		xhrJsonLoading("levels/level_1.json")
			.then((level:ILevel) => {
				this._level = level;
				this.initBackContainer();
				this.initPlayer();
				this.initFrontContainer();
				this.initBlocks();
				this.addKeyListeners();
				this.launchTicker();
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
		this.initBlock(-50, 0, 50, this.h);
		this.initBlock(0, this.h, this.w, 50);
		this.initBlock(this.w, 0, 50, this.h);
		this.initBlock(0, -50, this.w, 50);
		this._level.blocks.forEach((block:IBlock) => {
			this.initSandBlock(block.x, block.y);
		});
	}

	private initSandBlock(posX:number, posY:number):void {
		const blockWidth:number = 138;
		const blockHeight:number = 138;
		const blockX:number = posX;
		const blockY:number = posY;
		this.initBlock(blockX, blockY, blockWidth, blockHeight);

		const backSkin:Sprite = Sprite.from(MainContainer.SANDBLOCK_SKIN_NAME);
		backSkin.x = blockX - 31;
		backSkin.y = blockY - 15;
		this._backContainer.addChild(backSkin);

		const frontSkin:Sprite = new Sprite(
			new Texture(
				Texture.from(MainContainer.SANDBLOCK_SKIN_NAME).baseTexture,
				new Rectangle(0, 15, 169, 156),
			)
		);
		frontSkin.x = backSkin.x;
		frontSkin.y = backSkin.y + 15;
		this._frontContainer.addChild(frontSkin);
	}

	private initBlock(blockX:number, blockY:number, blockWidth:number, blockHeight:number):void {
		const newBlock:Graphics = new Graphics();
		newBlock.x = blockX;
		newBlock.y = blockY;
		newBlock.beginFill(0x000000, 0);
		newBlock.drawRect(0, 0, blockWidth, blockHeight);
		newBlock.endFill();
		this.addChild(newBlock);
		this._blocks.push(newBlock);
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
	blocks:IBlock[];
}

interface IBlock {
	x:number;
	y:number;
}