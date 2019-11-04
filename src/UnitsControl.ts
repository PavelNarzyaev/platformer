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
		let canMove:boolean = true;
		let limitX:number;
		let targetX:number;
		switch (this._player.getMovingDirection()) {
			case Player.LEFT:
				targetX = Math.round(this._player.x - Player.MOVING_SPEED);
				this._blocks.forEach((block:Block) => {
					limitX = block.collisionRight() - this._player.localCollisionLeft();
					if (
						this._player.x >= limitX &&
						targetX < limitX &&
						HitTest.vertical(this._player, block)
					) {
						this._player.x = limitX;
						canMove = false;
					}
				});
				if (canMove) {
					this._player.x = targetX;
				}
				break;

			case Player.RIGHT:
				targetX = Math.round(this._player.x + Player.MOVING_SPEED);
				this._blocks.forEach((block:Block) => {
					limitX = block.collisionLeft() - this._player.localCollisionRight();
					if (
						this._player.x <= limitX &&
						targetX > limitX &&
						HitTest.vertical(this._player, block)
					) {
						this._player.x = limitX;
						canMove = false;
					}
				});
				if (canMove) {
					this._player.x = targetX;
				}
				break;
		}
	}

	private verticalMoving():void {
		this._player.speedY += Player.GRAVITY;
		let limitY:number;
		let targetY:number = this._player.y + this._player.speedY;
		if (this._player.speedY > 0) {
			this._blocks.forEach((block:Block) => {
				limitY = block.collisionTop() - this._player.localCollisionBottom();
				if (
					this._player.y <= limitY &&
					targetY > limitY &&
					HitTest.horizontal(this._player, block)
				) {
					this._player.y = limitY;
					this._player.canJump = true;
					this._player.speedY = 0;
				}
			});
			if (this._player.speedY !== 0) {
				this._player.canJump = false;
				this._player.y = targetY;
			}
		} else if (this._player.speedY < 0) {
			this._blocks.forEach((block:Block) => {
				limitY = block.collisionBottom() - this._player.localCollisionTop();
				if (
					this._player.y >= limitY &&
					targetY < limitY &&
					HitTest.horizontal(this._player, block)
				) {
					this._player.y = limitY;
					this._player.speedY = 0;
				}
			});
			if (this._player.speedY !== 0) {
				this._player.y = targetY;
			}
		}
	}
}