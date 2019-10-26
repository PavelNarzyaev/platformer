import {View} from "./View";
import Loader = PIXI.loaders.Loader;
import Player from "./Player";
import LevelContainer from "./LevelContainer";

export default class MainContainer extends View {
	private _levelContainer:LevelContainer;

	constructor() {
		super();
		this.showTestBackground(0x00FF00);
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
		this.initLevelContainer();
	}

	private initLevelContainer():void {
		this._levelContainer = new LevelContainer();
		this._levelContainer.setSize(1500, 1000);
		this._levelContainer.init();
		this.addChild(this._levelContainer);
	}
}