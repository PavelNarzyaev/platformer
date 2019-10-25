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
	private _pressedButtons:Map<string, boolean> = new Map<string, boolean>();
	private _player:Player;
	private _blocks:Graphics[] = [];

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
		this.initBlocks();
		this.addKeyListeners();
		this.launchTicker();
	}

	private initPlayer():void {
		this._player = new Player();
		this._player.x = 50;
		this._player.y = this.h - this._player.height - 100;
		this.addChild(this._player);
	}

	private initBlocks():void {
		this.initBlock(-50, 0, 50, this.h);
		this.initBlock(0, this.h, this.w, 50);
		this.initBlock(this.w, 0, 50, this.h);
		this.initBlock(0, -50, this.w, 50);
		this.initBlock(
			Math.round(this.w / 2) - 100,
			Math.round(this.h / 2) - 25,
			200,
			50,
		);
		this.initBlock(
			Math.round(this.w * .75) - 100,
			Math.round(this.h * .75) - 25,
			200,
			50,
		);
		this.initBlock(
			Math.round(this.w * .25) - 100,
			Math.round(this.h * .25) - 25,
			200,
			50,
		);
	}

	private initBlock(blockX:number, blockY:number, blockWidth:number, blockHeight:number):void {
		const newBlock:Graphics = new Graphics();
		newBlock.x = blockX;
		newBlock.y = blockY;
		newBlock.beginFill(0xff0000);
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
		if (this._pressedButtons.get(MainContainer.UP) && this._player.canJump) {
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
					limitX = block.x + block.width;
					if (
						this._player.x >= limitX &&
						this._player.x - Player.MOVING_SPEED < limitX &&
						MainContainer.verticalHitTest(this._player, block)
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
					limitX = block.x - this._player.width;
					if (
						this._player.x <= limitX &&
						this._player.x + Player.MOVING_SPEED > limitX &&
						MainContainer.verticalHitTest(this._player, block)
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
				limitY = block.y - this._player.height;
				if (
					this._player.y <= limitY &&
					this._player.y + this._player.speedY > limitY &&
					MainContainer.horizontalHitTest(this._player, block)
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
				limitY = block.y + block.height;
				if (
					this._player.y >= limitY &&
					this._player.y + this._player.speedY < limitY &&
					MainContainer.horizontalHitTest(this._player, block)
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
			case MainContainer.LEFT:
				if (!this._pressedButtons.get(e.code)) {
					this._player.moveLeft();
				}
				break;

			case MainContainer.RIGHT:
				if (!this._pressedButtons.get(e.code)) {
					this._player.moveRight();
				}
				break;
		}

		switch (e.code) {
			case MainContainer.UP:
			case MainContainer.DOWN:
			case MainContainer.LEFT:
			case MainContainer.RIGHT:
				this._pressedButtons.set(e.code, true);
		}
	}

	private keyUpHandler(e:KeyboardEvent):void {
		switch (e.code) {
			case MainContainer.LEFT:
				if (this._pressedButtons.get(MainContainer.RIGHT)) {
					this._player.moveRight();
				} else {
					this._player.stop();
				}
				break;

			case MainContainer.RIGHT:
				if (this._pressedButtons.get(MainContainer.LEFT)) {
					this._player.moveLeft();
				} else {
					this._player.stop();
				}
				break;
		}

		switch (e.code) {
			case MainContainer.UP:
			case MainContainer.DOWN:
			case MainContainer.LEFT:
			case MainContainer.RIGHT:
				this._pressedButtons.set(e.code, false);
		}
	}

	private static horizontalHitTest(obj1:DisplayObject, obj2:DisplayObject):boolean {
		const bounds1:Rectangle = obj1.getBounds();
		const bounds2:Rectangle = obj2.getBounds();
		return !(bounds1.right <= bounds2.left || bounds1.left >= bounds2.right);
	}

	private static verticalHitTest(obj1:DisplayObject, obj2:DisplayObject):boolean {
		const bounds1:Rectangle = obj1.getBounds();
		const bounds2:Rectangle = obj2.getBounds();
		return !(bounds1.bottom <= bounds2.top || bounds1.top >= bounds2.bottom);
	}
}