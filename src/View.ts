import Container = PIXI.Container;
import Graphics = PIXI.Graphics;
import Random from "./Random";

class View extends Container {
	constructor() {
		super();
	}
}

class ResizableView extends View {
	public w:number;
	public h:number;
	private _inited:boolean = false;

	constructor() {
		super();
	}

	public setW(value:number):void {
		if (this.w !== value) {
			this.w = value;
			this.applySize();
		}
	}

	public setH(value:number) {
		if (this.h !== value) {
			this.h = value;
			this.applySize();
		}
	}

	public setSize(w:number, h:number):void {
		if (this.w !== w || this.h !== h) {
			this.w = w;
			this.h = h;
			this.applySize();
		}
	}

	protected applySize():void {
		if (!this._inited) {
			this._inited = true;
			this.init();
		}
	}

	protected init():void {
	}
}

class ViewWithTestBackground extends ResizableView {
	private _testBackground:Graphics;
	private _testBackgroundColor:number;
	private _testBackgroundAlpha:number;

	constructor() {
		super();
	}

	public showTestBackground(color?:number, alpha:number = .5):void {
		if (!this._testBackground) {
			this._testBackground = new Graphics();
			this.addChildAt(this._testBackground, 0);
			this._testBackgroundColor = color ? color : Random.genColor();
			this._testBackgroundAlpha = alpha;
			if (this.w && this.h) {
				this.applySize();
			}
		}
	}

	protected applySize():void {
		super.applySize();
		if (this._testBackground) {
			this._testBackground.clear();
			this._testBackground.lineStyle(1, this._testBackgroundColor);
			this._testBackground.beginFill(this._testBackgroundColor, this._testBackgroundAlpha);
			this._testBackground.drawRect(0, 0, this.w, this.h);
			this._testBackground.endFill();
		}
	}
}

class ViewWithResizeTest extends ViewWithTestBackground {
	public resizeTest:boolean = false;
	private _sizeWasChanged:boolean = false;

	constructor() {
		super();
	}

	protected applySize():void {
		super.applySize();
		if (this.resizeTest) {
			if (!this._sizeWasChanged) {
				this._sizeWasChanged = true;
				window.setTimeout(() => {
					this._sizeWasChanged = false;
				}, 0);
			} else {
				// * You should to use setSize instead setW and setH if you want to change both parameters
				// * You shouldn't call applySize method manually
				// * You shouldn't call setSize, setW or setH twice
				console.warn("[" + this.constructor.name + "] resize test was failed");
			}
		}
	}
}

export {ViewWithResizeTest as View};