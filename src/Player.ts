import Container = PIXI.Container;
import Sprite = PIXI.Sprite;
import Rectangle = PIXI.Rectangle;
import Texture = PIXI.Texture;

export default class Player extends Container {
	public static readonly SKIN_NAME:string = "img/alien.png";
	public static readonly GRAVITY:number = 0.15;
	public static readonly JUMP_SPEED:number = -8;
	public static readonly MOVING_SPEED:number = 4;
	public static readonly LEFT:symbol = Symbol();
	public static readonly RIGHT:symbol = Symbol();

	public speedY:number = 0;
	public canJump:boolean = true;

	private _skin:Sprite;
	private _skinFlipContainer:Container;
	private _movingDirection:symbol = null;
	private _skinDirection:symbol = Player.RIGHT;

	constructor() {
		super();
		this.initSkinFlipContainer();
		this.initSkin();
	}

	private initSkinFlipContainer():void {
		this._skinFlipContainer = new Container();
		this.addChild(this._skinFlipContainer);
	}

	private initSkin():void {
		this._skin = new Sprite(
			new Texture(
				Texture.from(Player.SKIN_NAME).baseTexture,
				new Rectangle(0, 0, 358, 147)
			)
		);
		this._skinFlipContainer.addChild(this._skin);
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
					this._skinFlipContainer.scale.x = -1;
					this._skinFlipContainer.x = this._skin.width;
					break;

				case Player.RIGHT:
					this._skinFlipContainer.scale.x = 1;
					this._skinFlipContainer.x = 0;
					break;
			}
		}
	}

	public getMovingDirection():symbol {
		return this._movingDirection;
	}
}