import {View} from "./View";
import {addEvent} from "./Globals";

export default class MainContainer extends View {
	private static readonly UP:string = "ArrowUp";
	private static readonly DOWN:string = "ArrowDown";
	private static readonly LEFT:string = "ArrowLeft";
	private static readonly RIGHT:string = "ArrowRight";

	private _pressedUp:boolean = false;
	private _pressedDown:boolean = false;
	private _pressedLeft:boolean = false;
	private _pressedRight:boolean = false;

	constructor() {
		super();
		this.showTestBackground(0xCFCFCF);
	}

	public init():void {
		this.addKeyListeners();
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
				break;

			case MainContainer.RIGHT:
				this._pressedRight = true;
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