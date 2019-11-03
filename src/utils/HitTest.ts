import CollisionObject from "../CollisionObject";

export default class HitTest {
	public static horizontal(obj1:CollisionObject, obj2:CollisionObject):boolean {
		return !(
			obj1.x + obj1.collisionRight() <= obj2.x + obj2.collisionLeft() ||
			obj1.x + obj1.collisionLeft() >= obj2.x + obj2.collisionRight()
		)
	}

	public static vertical(obj1:CollisionObject, obj2:CollisionObject):boolean {
		return !(
			obj1.y + obj1.collisionBottom() <= obj2.y + obj2.collisionTop() ||
			obj1.y + obj1.collisionTop() >= obj2.y + obj2.collisionBottom()
		);
	}
}