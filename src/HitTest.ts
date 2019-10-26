import DisplayObject = PIXI.DisplayObject;
import Rectangle = PIXI.Rectangle;

export default class HitTest {
	public static horizontal(obj1:DisplayObject, obj2:DisplayObject):boolean {
		const bounds1:Rectangle = obj1.getBounds();
		const bounds2:Rectangle = obj2.getBounds();
		return !(bounds1.right <= bounds2.left || bounds1.left >= bounds2.right);
	}

	public static vertical(obj1:DisplayObject, obj2:DisplayObject):boolean {
		const bounds1:Rectangle = obj1.getBounds();
		const bounds2:Rectangle = obj2.getBounds();
		return !(bounds1.bottom <= bounds2.top || bounds1.top >= bounds2.bottom);
	}
}