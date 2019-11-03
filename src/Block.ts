import CollisionObject from "./CollisionObject";
import {IBlock, IType} from "./Interfaces";
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
	}

	public getData():IBlock {
		return this._blockData;
	}

	public getTypeData():IType {
		return this._blockTypeData;
	}

	public collisionLeft():number {
		return this._blockTypeData.collision.left;
	}

	public collisionRight():number {
		return this._blockTypeData.collision.right;
	}

	public collisionTop():number {
		return this._blockTypeData.collision.top;
	}

	public collisionBottom():number {
		return this._blockTypeData.collision.bottom;
	}
}