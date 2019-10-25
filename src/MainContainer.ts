import {View} from "./View";
import Graphics = PIXI.Graphics;

export default class MainContainer extends View {
	private _player:Graphics;

	constructor() {
		super();
		this.showTestBackground(0xCFCFCF);
	}

	public init():void {
		this.initPlayer();
	}

	private initPlayer():void {
		this._player = new Graphics();
		this._player.beginFill(0xff0000);
		this._player.drawRect(0, 0, 30, 30);
		this._player.endFill();
		this.addChild(this._player);
	}
}