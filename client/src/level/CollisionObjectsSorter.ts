import Container = PIXI.Container;
import CollisionObject from "./CollisionObject";
import HitTest from "./HitTest";

export default class CollisionObjectsSorter {
	private _oldArray:CollisionObject[];

	constructor(
		private _collisionsLayer:Container
	) {}

	public sort():void {
		this._collisionsLayer.children = this.mySort(this._collisionsLayer.children as CollisionObject[]);
	}

	private mySort(children:CollisionObject[]):CollisionObject[] {
		this._oldArray = children.slice();
		const newArray:CollisionObject[] = [];
		while (this._oldArray.length) {
			newArray.push(this._oldArray.splice(this.findMinObjectIndex(), 1)[0]);
		}
		return newArray;
	}

	private findMinObjectIndex(index:number = 0):number {
		for (let i:number = 0; i < this._oldArray.length; i++) {
			if (i !== index && this.firstObjectIndexIsBigger(this._oldArray[index], this._oldArray[i])) {
				index = this.findMinObjectIndex(i);
				break;
			}
		}
		return index;
	}

	private firstObjectIndexIsBigger(a:CollisionObject, b:CollisionObject):boolean {
		if (HitTest.horizontal(a, b)) {
			return a.collisionLeft() >= b.collisionRight();
		} else if (HitTest.vertical(a, b)) {
			return a.collisionBottom() <= b.collisionTop();
		} else {
			return false;
		}
	}
}