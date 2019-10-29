import Container = PIXI.Container;
import Graphics = PIXI.Graphics;

export default class CollisionObject extends Container {
	constructor() {
		super();
	}

	public showCollisionRectangle():void {
		const graphics:Graphics = new Graphics();
		graphics.beginFill(0xff0000, .5);
		graphics.drawRect(
			this.collisionLeft(),
			this.collisionTop(),
			this.collisionRight() - this.collisionLeft(),
			this.collisionBottom() - this.collisionTop(),
		);
		this.addChild(graphics);
	}

	public collisionLeft():number {
		return null;
	}

	public collisionRight():number {
		return null;
	}

	public collisionTop():number {
		return null;
	}

	public collisionBottom():number {
		return null;
	}
}