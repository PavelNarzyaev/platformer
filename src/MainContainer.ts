import {View} from "./View";
import {addEvent} from "./Globals";
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
	}

	private initPlayer():void {
		this._player = new Player();
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
				this._player.setDirection(Player.LEFT_DIRECTION);
				break;

			case MainContainer.RIGHT:
				this._pressedRight = true;
				this._player.setDirection(Player.RIGHT_DIRECTION);
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
				break;

			case MainContainer.RIGHT:
				this._pressedRight = false;
				break;
		}
	}
}