import CollisionObject from "./CollisionObject";
import {IBlock, ICollision, IType} from "../Interfaces";
import Sprite = PIXI.Sprite;
import Point = PIXI.Point;

export default class Block extends CollisionObject {
	public localDragPoint:Point;

	constructor(
		private _blockData:IBlock,
		private _blockTypeData:IType,
	) {
		super();

		if (this._blockTypeData.image) {
			this.addChild(Sprite.from(this._blockTypeData.image));
		}

		if (this._blockTypeData.collision) {
			const collision:ICollision = this._blockTypeData.collision;
			this.setLocalCollisionValues(collision.left, collision.right, collision.top, collision.bottom);
		}
	}

	public getData():IBlock {
		return this._blockData;
	}

	public getTypeData():IType {
		return this._blockTypeData;
	}
}