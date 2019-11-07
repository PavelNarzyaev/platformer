import Container = PIXI.Container;
import Graphics = PIXI.Graphics;

export default class CollisionObject extends Container {
	private _localLeft:number;
	private _localRight:number;
	private _localTop:number;
	private _localBottom:number;

	private _collisionLeft:number;
	private _collisionRight:number;
	private _collisionTop:number;
	private _collisionBottom:number;

	constructor() {
		super();
	}

	public setLocalCollisionValues(
		left:number,
		right:number,
		top:number,
		bottom:number
	):void {
		this._localLeft = left;
		this._localRight = right;
		this._localTop = top;
		this._localBottom = bottom;
	}

	public set x(x:number) {
		super.x = x;
		this._collisionLeft = x + this._localLeft;
		this._collisionRight = x + this._localRight;
	}

	public get x():number {
		return super.x;
	}

	public set y(y:number) {
		super.y = y;
		this._collisionTop = y + this._localTop;
		this._collisionBottom = y + this._localBottom;
	}

	public get y():number {
		return super.y;
	}

	public showCollisionRectangle():void {
		const graphics:Graphics = new Graphics();
		graphics.beginFill(0xff0000, .5);
		graphics.drawRect(
			this._localLeft,
			this._localTop,
			this._localRight - this._localLeft,
			this._localBottom - this._localTop,
		);
		this.addChild(graphics);
	}

	public collisionLeft():number {
		return this._collisionLeft;
	}

	public collisionRight():number {
		return this._collisionRight;
	}

	public collisionTop():number {
		return this._collisionTop;
	}

	public collisionBottom():number {
		return this._collisionBottom;
	}

	public localCollisionLeft():number {
		return this._localLeft;
	}

	public localCollisionRight():number {
		return this._localRight;
	}

	public localCollisionTop():number {
		return this._localTop;
	}

	public localCollisionBottom():number {
		return this._localBottom;
	}
}