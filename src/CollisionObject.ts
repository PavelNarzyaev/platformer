import Container = PIXI.Container;

export default class CollisionObject extends Container {
	constructor() {
		super();
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