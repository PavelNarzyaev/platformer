import Container = PIXI.Container;

export default class HitTest {
	public static horizontal(obj1:Container, obj2:Container):boolean {
		return !(
			obj1.x + obj1.width <= obj2.x ||
			obj1.x >= obj2.x + obj2.width
		)
	}

	public static vertical(obj1:Container, obj2:Container):boolean {
		return !(
			obj1.y + obj1.height <= obj2.y ||
			obj1.y >= obj2.y + obj2.height
		);
	}
}