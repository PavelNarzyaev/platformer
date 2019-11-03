import Sprite = PIXI.Sprite;
import CollisionObject from "./CollisionObject";

export default class Player extends CollisionObject {
	public static readonly LEFT_SKIN_NAME:string = "img/player_left.png";
	public static readonly RIGHT_SKIN_NAME:string = "img/player_right.png";
	public static readonly GRAVITY:number = 0.15;
	public static readonly JUMP_SPEED:number = -8;
	public static readonly MOVING_SPEED:number = 4;
	public static readonly LEFT:symbol = Symbol();
	public static readonly RIGHT:symbol = Symbol();

	public speedY:number = 0;
	public canJump:boolean = true;

	private _skin:Sprite;
	private _movingDirection:symbol = null;
	private _skinDirection:symbol = Player.RIGHT;

	constructor() {
		super();
		this.initSkin();
	}

	private initSkin():void {
		this._skin = Sprite.fromImage(Player.RIGHT_SKIN_NAME);
		this.addChild(this._skin);
	}

	public moveLeft():void {
		this._movingDirection = Player.LEFT;
		this.refreshSkinDirection();
	}

	public moveRight():void {
		this._movingDirection = Player.RIGHT;
		this.refreshSkinDirection();
	}

	public stop():void {
		this._movingDirection = null;
	}

	private refreshSkinDirection():void {
		if (this._skinDirection !== this._movingDirection) {
			this._skinDirection = this._movingDirection;
			switch (this._skinDirection) {
				case Player.LEFT:
					this.removeChild(this._skin);
					this._skin = Sprite.fromImage(Player.LEFT_SKIN_NAME);
					this.addChild(this._skin);
					break;

				case Player.RIGHT:
					this.removeChild(this._skin);
					this._skin = Sprite.fromImage(Player.RIGHT_SKIN_NAME);
					this.addChild(this._skin);
					break;
			}
		}
	}

	public getMovingDirection():symbol {
		return this._movingDirection;
	}

	public collisionLeft():number {
		return 10;
	}

	public collisionRight():number {
		return 40;
	}

	public collisionTop():number {
		return 10;
	}

	public collisionBottom():number {
		return 90;
	}
}