import Container = PIXI.Container;
import Sprite = PIXI.Sprite;

export default class Player extends Container {
	public static readonly SKIN_NAME:string = "img/player.png";
	public static readonly GRAVITY:number = 0.15;
	public static readonly JUMP_SPEED:number = -15;
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
		this._skin = Sprite.from(Player.SKIN_NAME);
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
					this._skin.scale.x = -1;
					this._skin.x = this._skin.width;
					break;

				case Player.RIGHT:
					this._skin.scale.x = 1;
					this._skin.x = 0;
					break;
			}
		}
	}

	public getMovingDirection():symbol {
		return this._movingDirection;
	}
}