import Player from "./Player";
import HitTest from "./HitTest";
import Block from "./Block";
import CollisionObject from "./CollisionObject";

export default class PlayerMover {
	private static readonly HORIZONTAL:symbol = Symbol();
	private static readonly VERTICAL:symbol = Symbol();

	constructor(
		private _player:Player,
		private _blocks:Block[],
	) {
	}

	public refresh():void {
		if (this._player.getSpeedX() !== 0) {
			this.move(
				PlayerMover.HORIZONTAL,
				this._player.getSpeedX(),
				() => {
					this._player.setSpeedX(0)
				},
			);
		}
		if (this._player.getSpeedY() !== 0) {
			this._player.onTheFloor = false;
			this.move(
				PlayerMover.VERTICAL,
				this._player.getSpeedY(),
				() => {
					if (this._player.getSpeedY() > 0) {
						this._player.onTheFloor = true;
					}
					this._player.setSpeedY(0);
				},
			);
		}
	}

	private move(
		direction:symbol,
		speed:number,
		onLimitPosition:() => void = null
	):void {
		let limitPosition:number = null;
		let targetPosition:number = this.getPosition(direction) + speed;
		this._blocks.forEach((block:Block) => {
			let blockLimitPosition:number = this.calculateBlockLimitPosition(block, direction, speed);
			if (speed > 0) {
				if (
					this.getPosition(direction) <= blockLimitPosition &&
					targetPosition > blockLimitPosition &&
					this.hitTest(direction, this._player, block)
				) {
					limitPosition = limitPosition !== null ? Math.min(limitPosition, blockLimitPosition) : blockLimitPosition;
				}
			} else {
				if (
					this.getPosition(direction) >= blockLimitPosition &&
					targetPosition < blockLimitPosition &&
					this.hitTest(direction, this._player, block)
				) {
					limitPosition = limitPosition !== null ? Math.max(limitPosition, blockLimitPosition) : blockLimitPosition;
				}
			}
		});
		if (limitPosition !== null) {
			this.setPosition(direction, limitPosition);
			if (onLimitPosition !== null) {
				onLimitPosition();
			}
		} else {
			this.setPosition(direction, targetPosition);
		}
	}

	private setPosition(direction:symbol, value:number):void {
		if (direction == PlayerMover.HORIZONTAL) {
			this._player.x = value;
		} else {
			this._player.y = value;
		}
	}

	private getPosition(direction:symbol):number {
		if (direction == PlayerMover.HORIZONTAL) {
			return this._player.x;
		} else {
			return this._player.y;
		}
	}

	private calculateBlockLimitPosition(block:CollisionObject, direction:symbol, speed:number):number {
		if (direction == PlayerMover.HORIZONTAL) {
			if (speed > 0) {
				return block.collisionLeft() - this._player.localCollisionRight();
			} else {
				return block.collisionRight() - this._player.localCollisionLeft();
			}
		} else {
			if (speed > 0) {
				return block.collisionTop() - this._player.localCollisionBottom();
			} else {
				return block.collisionBottom() - this._player.localCollisionTop();
			}
		}
	}

	private hitTest(direction:symbol, object1:CollisionObject, object2:CollisionObject):boolean {
		if (direction == PlayerMover.HORIZONTAL) {
			return HitTest.vertical(object1, object2);
		} else {
			return HitTest.horizontal(object1, object2);
		}
	}
}