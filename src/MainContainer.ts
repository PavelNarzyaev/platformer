import {View} from "./View";
import {addEvent, default as Globals} from "./Globals";
import Loader = PIXI.loaders.Loader;
import Player from "./Player";

export default class MainContainer extends View {
	private static readonly UP:string = "ArrowUp";
	private static readonly DOWN:string = "ArrowDown";
	private static readonly LEFT:string = "ArrowLeft";
	private static readonly RIGHT:string = "ArrowRight";

	private _pressedUp:boolean = false;
	private _pressedDown:boolean = false;
	private _pressedLeft:boolean = false;
	private _pressedRight:boolean = false;

	private _player:Player;

	constructor() {
		super();
		this.showTestBackground(0xCFCFCF);
	}

	public init():void {
		this.startLoading();
	}

	private startLoading():void {
		const loader:Loader = new Loader;
		loader.add(Player.SKIN_NAME);
		loader.onComplete.add(() => { this.completeLoadingHandler(); });
		loader.load();
	}

	private completeLoadingHandler():void {
		this.initPlayer();
		this.addKeyListeners();
		this.launchTicker();
	}

	private initPlayer():void {
		this._player = new Player();
		this._player.y = this.h - this._player.height;
		this.addChild(this._player);
	}

	private addKeyListeners():void {
		addEvent(
			window,
			"keydown",
			(e:KeyboardEvent) => {
				this.keyDownHandler(e);
			},
		);

		addEvent(
			window,
			"keyup",
			(e:KeyboardEvent) => {
				this.keyUpHandler(e);
			},
		);
	}

	private launchTicker():void {
		Globals.pixiApp.ticker.add(() => {
			const speed:number = 3;
			if (this._player.movingRight) {
				this._player.x += speed;
			} else if (this._player.movingLeft) {
				this._player.x -= speed;
			}
		});
	}

	private keyDownHandler(e:KeyboardEvent):void {
		switch (e.code) {
			case MainContainer.UP:
				this._pressedUp = true;
				break;

			case MainContainer.DOWN:
				this._pressedDown = true;
				break;

			case MainContainer.LEFT:
				this._pressedLeft = true;
				this._player.moveLeft();
				break;

			case MainContainer.RIGHT:
				this._pressedRight = true;
				this._player.moveRight();
				break;
		}
	}

	private keyUpHandler(e:KeyboardEvent):void {
		switch (e.code) {
			case MainContainer.UP:
				this._pressedUp = false;
				break;

			case MainContainer.DOWN:
				this._pressedDown = false;
				break;

			case MainContainer.LEFT:
				this._pressedLeft = false;
				if (this._pressedRight) {
					this._player.moveRight();
				} else {
					this._player.movingLeft = false;
				}
				break;

			case MainContainer.RIGHT:
				this._pressedRight = false;
				if (this._pressedLeft) {
					this._player.moveLeft();
				} else {
					this._player.movingRight = false;
				}
				break;
		}
	}
}