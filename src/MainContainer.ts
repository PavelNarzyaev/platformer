import {View} from "./View";
import {addEvent, default as Globals} from "./Globals";
import Loader = PIXI.loaders.Loader;
import Player from "./Player";
import Graphics = PIXI.Graphics;
import DisplayObject = PIXI.DisplayObject;
import Rectangle = PIXI.Rectangle;

export default class MainContainer extends View {
	private static readonly UP:string = "ArrowUp";
	private static readonly DOWN:string = "ArrowDown";
	private static readonly LEFT:string = "ArrowLeft";
	private static readonly RIGHT:string = "ArrowRight";
	private static readonly GRAVITY:number = 0.1;
	private static readonly JUMP_SPEED:number = -10;

	private _pressedUp:boolean = false;
	private _pressedDown:boolean = false;
	private _pressedLeft:boolean = false;
	private _pressedRight:boolean = false;

	private _player:Player;
	private _block:Graphics;

	constructor() {
		super();
		this.showTestBackground(0xCFCFCF);
	}

	public init():void {
		this.startLoading();
	}

	private startLoading():void {
		const loader:Loader = new Loader;
		loader.add(Player.SKIN_NAME);
		loader.onComplete.add(() => { this.completeLoadingHandler(); });
		loader.load();
	}

	private completeLoadingHandler():void {
		this.initPlayer();
		this.initBlock();
		this.addKeyListeners();
		this.launchTicker();
	}

	private initPlayer():void {
		this._player = new Player();
		this._player.y = this.h - this._player.height;
		this.addChild(this._player);
	}

	private initBlock():void {
		this._block = new Graphics();
		this._block.beginFill(0xff0000);
		this._block.drawRect(0, 0, 200, 50);
		this._block.endFill();
		this._block.x = 200;
		this._block.y = this.h - this._block.height - 200;
		this.addChild(this._block);
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
			const speed:number = 3;
			if (this._player.movingRight) {
				const maxX:number = this.w - this._player.width;
				if (this._player.x + speed < maxX) {
					this._player.x += speed;
					if (
						this.hitTest(this._player, this._block) &&
						(this._player.y + this._player.height > this._block.y)
					) {
						this._player.x = this._block.x - this._player.width;
					}
				} else {
					this._player.x = maxX;
				}
			} else if (this._player.movingLeft) {
				const minX:number = 0;
				if (this._player.x - speed > minX) {
					this._player.x -= speed;
					if (
						this.hitTest(this._player, this._block) &&
						(this._player.y + this._player.height > this._block.y)
					) {
						this._player.x = this._block.x + this._block.width;
					}
				} else {
					this._player.x = minX;
				}
			}

			if (this._pressedUp && this._player.canJump) {
				this._player.canJump = false;
				this._player.speedY = MainContainer.JUMP_SPEED;
			}

			const maxY:number = this.h - this._player.height;
			if (this._player.y + this._player.speedY < maxY) {
				this._player.y += this._player.speedY;
				if (
					this.hitTest(this._player, this._block) &&
					this._player.x + this._player.width > this._block.x &&
					this._player.x < this._block.x + this._block.width
				) {
					if (this._player.speedY < 0) {
						this._player.y = this._block.y + this._block.height;
					} else {
						this._player.y = this._block.y - this._player.height;
						this._player.canJump = true;
					}
					this._player.speedY = 0;
				} else {
					this._player.canJump = false;
					this._player.speedY += MainContainer.GRAVITY;
				}
			} else {
				this._player.y = maxY;
				this._player.speedY = 0;
				this._player.canJump = true;
			}
		});
	}

	private keyDownHandler(e:KeyboardEvent):void {
		switch (e.code) {
			case MainContainer.UP:
				this._pressedUp = true;
				break;

			case MainContainer.DOWN:
				this._pressedDown = true;
				break;

			case MainContainer.LEFT:
				this._pressedLeft = true;
				this._player.moveLeft();
				break;

			case MainContainer.RIGHT:
				this._pressedRight = true;
				this._player.moveRight();
				break;
		}
	}

	private keyUpHandler(e:KeyboardEvent):void {
		switch (e.code) {
			case MainContainer.UP:
				this._pressedUp = false;
				break;

			case MainContainer.DOWN:
				this._pressedDown = false;
				break;

			case MainContainer.LEFT:
				this._pressedLeft = false;
				if (this._pressedRight) {
					this._player.moveRight();
				} else {
					this._player.movingLeft = false;
				}
				break;

			case MainContainer.RIGHT:
				this._pressedRight = false;
				if (this._pressedLeft) {
					this._player.moveLeft();
				} else {
					this._player.movingRight = false;
				}
				break;
		}
	}

	private hitTest(obj1:DisplayObject, obj2:DisplayObject):boolean {
		const bounds1:Rectangle = obj1.getBounds();
		const bounds2:Rectangle = obj2.getBounds();
		return !(
			(bounds1.bottom < bounds2.top) ||
			(bounds1.top > bounds2.bottom) ||
			(bounds1.right < bounds2.left) ||
			(bounds1.left > bounds2.right)
		);
	}
}