import Sprite = PIXI.Sprite;
import CollisionObject from "./CollisionObject";

export default class Player extends CollisionObject {
	public static readonly LEFT_SKIN_NAME:string = "img/player_left.png";
	public static readonly RIGHT_SKIN_NAME:string = "img/player_right.png";
	public static readonly GRAVITY:number = 0.6;
	public static readonly JUMP_SPEED:number = -16;
	public static readonly MOVING_SPEED:number = 8;
	public static readonly LEFT:symbol = Symbol();
	public static readonly RIGHT:symbol = Symbol();

	public onTheFloor:boolean = false;

	private _speedX:number = 0;
	private _speedY:number = 0;
	private _skin:Sprite;
	private _skinDirection:symbol;

	constructor() {
		super();
		this.initSkin();
		this.setLocalCollisionValues(10, 40, 10, 90);
	}

	private initSkin():void {
		this._skinDirection = Player.RIGHT;
		this.refreshSkin();
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
			} else {
				this._skinDirection = Player.LEFT;
			}
			this.refreshSkin();
		}
	}

	private refreshSkin():void {
		if (this._skin) {
			this._skin.parent.removeChild(this._skin);
		}
		switch (this._skinDirection) {
			case Player.RIGHT:
				this._skin = Sprite.from(Player.RIGHT_SKIN_NAME);
				break;

			case Player.LEFT:
				this._skin = Sprite.from(Player.LEFT_SKIN_NAME);
				break;
		}
		if (this._skin) {
			this.addChild(this._skin);
		}
	}
}