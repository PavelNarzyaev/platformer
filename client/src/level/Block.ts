import CollisionObject from "./CollisionObject";
import {IBlock, ICollision, IType} from "../Interfaces";
import Sprite = PIXI.Sprite;
import Point = PIXI.Point;

export default class Block extends CollisionObject {
	public localDragPoint:Point;
	private _sprite:Sprite;
	private _hit:boolean = null;

	constructor(
		private _blockData:IBlock,
		private _blockTypeData:IType,
	) {
		super();

		this.initSprite();
		if (this._blockTypeData.collision) {
			const collision:ICollision = this._blockTypeData.collision;
			this.setLocalCollisionValues(collision.left, collision.right, collision.top, collision.bottom);
		}
	}

	private initSprite():void {
		if (this._blockTypeData.image) {
			this._sprite = Sprite.from(this._blockTypeData.image);
			this.addChild(this._sprite);
		}
	}

	public getData():IBlock {
		return this._blockData;
	}

	public getTypeData():IType {
		return this._blockTypeData;
	}

	public showBlockHit(value:boolean):void {
		if (this._hit !== value) {
			this._hit = value;
			this.showCollisionRectangle(this._hit ? 0xff0000 : 0x0000ff);
			if (this._sprite) {
				this._sprite.alpha = .3;
			}
		}
	}

	public hideBlockHit():void {
		this.hideCollisionRectangle();
		this._hit = null;
		if (this._sprite) {
			this._sprite.alpha = 1;
		}
	}

	public isVisible():boolean {
		return !!this._sprite;
	}
}