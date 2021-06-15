import Container = PIXI.Container;
import CollisionObject from "./CollisionObject";
import HitTest from "./HitTest";

export default class CollisionObjectsSorter {
	constructor(
		private _collisionsLayer:Container
	) {}

	public sort():void {
		this._collisionsLayer.children = this.mySort(this._collisionsLayer.children as CollisionObject[]);
	}

	private mySort(children:CollisionObject[]):CollisionObject[] {
		const oldArray:CollisionObject[] = children.slice();
		const newArray:CollisionObject[] = [];
		while (oldArray.length) {
			const index:number = this.findMinObjectIndex(oldArray, 0);
			newArray.push(oldArray[index]);
			oldArray.splice(index, 1);
		}
		return newArray;
	}

	private findMinObjectIndex(
		array:CollisionObject[],
		index:number,
	):number {
		for (let i:number = 0; i < array.length; i++) {
			if (i !== index && this.firstObjectIndexIsBigger(array[index], array[i])) {
				index = this.findMinObjectIndex(array, i);
				break;
			}
		}
		return index;
	}

	private firstObjectIndexIsBigger(a:CollisionObject, b:CollisionObject):boolean {
		const hitH: boolean = HitTest.horizontal(a, b);
		const hitV: boolean = HitTest.vertical(a, b);
		if (hitH === hitV) {
			return false;
		} else if (hitV) {
			return a.collisionLeft() >= b.collisionRight();
		} else {
			return a.collisionBottom() <= b.collisionTop();
		}
	}
}