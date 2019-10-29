import Container = PIXI.Container;
import CollisionObject from "./CollisionObject";

export default class HitTest {
	public static horizontal(obj1:CollisionObject, obj2:Container):boolean {
		return !(
			obj1.x + obj1.collisionRight() <= obj2.x ||
			obj1.x + obj1.collisionLeft() >= obj2.x + obj2.width
		)
	}

	public static vertical(obj1:CollisionObject, obj2:Container):boolean {
		return !(
			obj1.y + obj1.collisionBottom() <= obj2.y ||
			obj1.y + obj1.collisionTop() >= obj2.y + obj2.height
		);
	}
}