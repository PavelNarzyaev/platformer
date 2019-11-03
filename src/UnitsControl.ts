import Player from "./Player";
import {IHit} from "./Interfaces";
import HitTest from "./utils/HitTest";

export default class UnitsControl {
	private _hitsData:IHit[] = [];

	constructor(
		private _player:Player,
	) {
	}

	public addHit(hitData:IHit):void {
		this._hitsData.push(hitData);
	}

	public refresh():void {
		this.horizontalMoving();
		this.verticalMoving();
	}

	private horizontalMoving():void {
		let canMove:boolean = true;
		let limitX:number;
		switch (this._player.getMovingDirection()) {
			case Player.LEFT:
				this._hitsData.forEach((hitData:IHit) => {
					limitX = hitData.x + hitData.width - this._player.collisionLeft();
					if (
						this._player.x >= limitX &&
						this._player.x - Player.MOVING_SPEED < limitX &&
						HitTest.vertical(this._player, hitData)
					) {
						this._player.x = limitX;
						canMove = false;
					}
				});
				if (canMove) {
					this._player.x -= Player.MOVING_SPEED;
				}
				break;

			case Player.RIGHT:
				this._hitsData.forEach((hitData:IHit) => {
					limitX = hitData.x - this._player.collisionRight();
					if (
						this._player.x <= limitX &&
						this._player.x + Player.MOVING_SPEED > limitX &&
						HitTest.vertical(this._player, hitData)
					) {
						this._player.x = limitX;
						canMove = false;
					}
				});
				if (canMove) {
					this._player.x += Player.MOVING_SPEED;
				}
				break;
		}
	}

	private verticalMoving():void {
		let limitY:number;
		this._player.speedY += Player.GRAVITY;
		if (this._player.speedY > 0) {
			this._hitsData.forEach((hitData:IHit) => {
				limitY = hitData.y - this._player.collisionBottom();
				if (
					this._player.y <= limitY &&
					this._player.y + this._player.speedY > limitY &&
					HitTest.horizontal(this._player, hitData)
				) {
					this._player.y = limitY;
					this._player.canJump = true;
					this._player.speedY = 0;
				}
			});
			if (this._player.speedY !== 0) {
				this._player.canJump = false;
				this._player.y += this._player.speedY;
			}
		} else if (this._player.speedY < 0) {
			this._hitsData.forEach((hitData:IHit) => {
				limitY = hitData.y + hitData.height - this._player.collisionTop();
				if (
					this._player.y >= limitY &&
					this._player.y + this._player.speedY < limitY &&
					HitTest.horizontal(this._player, hitData)
				) {
					this._player.y = limitY;
					this._player.speedY = 0;
				}
			});
			if (this._player.speedY !== 0) {
				this._player.y += this._player.speedY;
			}
		}
	}
}