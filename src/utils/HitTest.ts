import CollisionObject from "../level/CollisionObject";

export default class HitTest {
	public static horizontal(obj1:CollisionObject, obj2:CollisionObject):boolean {
		return !(
			obj1.collisionRight() <= obj2.collisionLeft() ||
			obj1.collisionLeft() >= obj2.collisionRight()
		)
	}

	public static vertical(obj1:CollisionObject, obj2:CollisionObject):boolean {
		return !(
			obj1.collisionBottom() <= obj2.collisionTop() ||
			obj1.collisionTop() >= obj2.collisionBottom()
		);
	}
}