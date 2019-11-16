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

	public onTheFloor:boolean = false;

	private _speedX:number = 0;
	private _speedY:number = 0;
	private _skin:Sprite;
	private _skinDirection:symbol = Player.RIGHT;

	constructor() {
		super();
		this.initSkin();
		this.setLocalCollisionValues(10, 40, 10, 90);
	}

	private initSkin():void {
		this._skin = Sprite.fromImage(Player.RIGHT_SKIN_NAME);
		this.addChild(this._skin);
	}

	public setSpeedX(value:number):void {
		this._speedX = value;
		this.refreshSkinDirection();
	}

	public getSpeedX():number {
		return this._speedX;
	}

	public setSpeedY(value:number):void {
		this._speedY = value;
	}

	public getSpeedY():number {
		return this._speedY;
	}

	private refreshSkinDirection():void {
		if (
			this._skinDirection == Player.RIGHT && this._speedX < 0 ||
			this._skinDirection == Player.LEFT && this._speedX > 0
		) {
			if (this._speedX > 0) {
				this._skinDirection = Player.RIGHT;
				this.removeChild(this._skin);
				this._skin = Sprite.from(Player.RIGHT_SKIN_NAME);
				this.addChild(this._skin);
			} else {
				this._skinDirection = Player.LEFT;
				this.removeChild(this._skin);
				this._skin = Sprite.from(Player.LEFT_SKIN_NAME);
				this.addChild(this._skin);
			}
		}
	}
}