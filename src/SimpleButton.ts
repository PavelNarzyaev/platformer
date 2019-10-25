import {View} from "./View";
import Graphics = PIXI.Graphics;
import {POINTER_DOWN, POINTER_OUT, POINTER_OVER, POINTER_UP, POINTER_UP_OUTSIDE} from "./PointerEvents";
import OneLineTextField from "./OneLineTextField";

export default class SimpleButton extends View {
	public static readonly CLICK:symbol = Symbol();
	private static readonly OUT_COLOR:number = 0x00ff00;
	private static readonly OVER_COLOR:number = 0xffff00;
	private static readonly DOWN_COLOR:number = 0xff0000;
	private _background:Graphics;
	private _textField:OneLineTextField;
	private _overState:boolean = false;
	private _downState:boolean = false;

	constructor(
		private _text:string,
	) {
		super();
		this.buttonMode = true;
		this.interactive = true;
	}

	protected applySize():void {
		super.applySize();
		this.refreshBackground();
		if (this._text) {
			if (!this._textField) {
				this._textField = new OneLineTextField(this._text);
				this.addChild(this._textField);
			}
			this._textField.setSize(this.w, this.h);
		}
	}

	private pointerOverHandler():void {
		this.removeListener(POINTER_OVER, this.pointerOverHandler, this);
		this.addListener(POINTER_OUT, this.pointerOutHandler, this);
		this.addListener(POINTER_DOWN, this.pointerDownHandler, this);
		this._overState = true;
		this.refreshBackground();
	}

	private pointerOutHandler():void {
		this.removeListener(POINTER_OUT, this.pointerOutHandler, this);
		this.removeListener(POINTER_DOWN, this.pointerDownHandler, this);
		this.addListener(POINTER_OVER, this.pointerOverHandler, this);
		this._overState = false;
		this.refreshBackground();
	}

	private pointerDownHandler():void {
		this.removeListener(POINTER_DOWN, this.pointerDownHandler, this);
		this.removeListener(POINTER_OUT, this.pointerOutHandler, this);
		this.addListener(POINTER_UP, this.pointerUpHandler, this);
		this.addListener(POINTER_UP_OUTSIDE, this.pointerUpOutsideHandler, this);
		this._downState = true;
		this.refreshBackground();
	}

	private pointerUpHandler():void {
		this.removeListener(POINTER_UP, this.pointerUpHandler, this);
		this.removeListener(POINTER_UP_OUTSIDE, this.pointerUpOutsideHandler, this);
		this.addListener(POINTER_DOWN, this.pointerDownHandler, this);
		this.addListener(POINTER_OUT, this.pointerOutHandler, this);
		this._downState = false;
		this.refreshBackground();
		this.emit(SimpleButton.CLICK);
	}

	private pointerUpOutsideHandler():void {
		this.removeListener(POINTER_UP, this.pointerUpHandler, this);
		this.removeListener(POINTER_UP_OUTSIDE, this.pointerUpOutsideHandler, this);
		this.addListener(POINTER_OVER, this.pointerOverHandler, this);
		this._downState = false;
		this._overState = false;
		this.refreshBackground();
	}

	private refreshBackground():void {
		if (!this._background) {
			this._background = new Graphics();
			this.addListener(POINTER_OVER, this.pointerOverHandler);
			this.addChild(this._background);
		} else {
			this._background.clear();
		}

		if (this._downState) {
			this._background.beginFill(SimpleButton.DOWN_COLOR);
		} else if (this._overState) {
			this._background.beginFill(SimpleButton.OVER_COLOR);
		} else {
			this._background.beginFill(SimpleButton.OUT_COLOR);
		}

		this._background.drawRect(0, 0, this.w, this.h);
		this._background.endFill();
	}
}