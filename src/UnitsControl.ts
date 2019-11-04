import Player from "./Player";
import HitTest from "./utils/HitTest";
import Block from "./Block";

export default class UnitsControl {
	constructor(
		private _player:Player,
		private _blocks:Block[],
	) {
	}

	public refresh():void {
		this.horizontalMoving();
		this.verticalMoving();
	}

	private horizontalMoving():void {
		let limitX:number;
		let targetX:number;
		switch (this._player.getMovingDirection()) {
			case Player.LEFT:
				targetX = Math.round(this._player.x - Player.MOVING_SPEED);
				let maxLimitX:number = null;
				this._blocks.forEach((block:Block) => {
					limitX = block.collisionRight() - this._player.localCollisionLeft();
					if (
						this._player.x >= limitX &&
						targetX < limitX &&
						HitTest.vertical(this._player, block)
					) {
						maxLimitX = maxLimitX !== null ? Math.max(maxLimitX, limitX) : limitX;
					}
				});
				this._player.x = maxLimitX !== null ? maxLimitX : targetX;
				break;

			case Player.RIGHT:
				targetX = Math.round(this._player.x + Player.MOVING_SPEED);
				let minLimitX:number = null;
				this._blocks.forEach((block:Block) => {
					limitX = block.collisionLeft() - this._player.localCollisionRight();
					if (
						this._player.x <= limitX &&
						targetX > limitX &&
						HitTest.vertical(this._player, block)
					) {
						minLimitX = minLimitX !== null ? Math.min(minLimitX, limitX) : limitX;
					}
				});
				this._player.x = minLimitX !== null ? minLimitX : targetX;
				break;
		}
	}

	private verticalMoving():void {
		this._player.speedY += Player.GRAVITY;
		let limitY:number;
		let targetY:number = this._player.y + this._player.speedY;
		if (this._player.speedY > 0) {
			let minLimitY:number = null;
			this._blocks.forEach((block:Block) => {
				limitY = block.collisionTop() - this._player.localCollisionBottom();
				if (
					this._player.y <= limitY &&
					targetY > limitY &&
					HitTest.horizontal(this._player, block)
				) {
					minLimitY = minLimitY !== null ? Math.min(minLimitY, limitY) : limitY;
				}
			});
			if (minLimitY !== null) {
				this._player.y = minLimitY;
				this._player.canJump = true;
				this._player.speedY = 0;
			} else {
				this._player.canJump = false;
				this._player.y = targetY;
			}
		} else if (this._player.speedY < 0) {
			let maxLimitY:number = null;
			this._blocks.forEach((block:Block) => {
				limitY = block.collisionBottom() - this._player.localCollisionTop();
				if (
					this._player.y >= limitY &&
					targetY < limitY &&
					HitTest.horizontal(this._player, block)
				) {
					maxLimitY = maxLimitY !== null ? Math.max(maxLimitY, limitY) : limitY;
				}
			});
			if (maxLimitY !== null) {
				this._player.y = maxLimitY;
				this._player.speedY = 0;
			} else {
				this._player.y = targetY;
			}
		}
	}
}