import Container = PIXI.Container;
import Sprite = PIXI.Sprite;

export default class Player extends Container {
	private static readonly LEFT_DIRECTION:string = "leftDirection";
	private static readonly RIGHT_DIRECTION:string = "rightDirection";

	public static readonly SKIN_NAME:string = "img/player.png";

	public movingLeft:boolean = false;
	public movingRight:boolean = false;

	private _skin:Sprite;
	private _direction:string = Player.RIGHT_DIRECTION;

	constructor() {
		super();
		this.initSkin();
	}

	private initSkin():void {
		this._skin = Sprite.from(Player.SKIN_NAME);
		this.addChild(this._skin);
	}

	public moveLeft():void {
		this.movingLeft = true;
		this.movingRight = false;
		this.setDirection(Player.LEFT_DIRECTION);
	}

	public moveRight():void {
		this.movingRight = true;
		this.movingLeft = false;
		this.setDirection(Player.RIGHT_DIRECTION);
	}

	private setDirection(value:string):void {
		if (this._direction !== value) {
			this._direction = value;
			switch (this._direction) {
				case Player.LEFT_DIRECTION:
					this._skin.scale.x = -1;
					this._skin.x = this._skin.width;
					break;

				case Player.RIGHT_DIRECTION:
					this._skin.scale.x = 1;
					this._skin.x = 0;
					break;
			}
		}
	}
}