import {View} from "./View";
import Loader = PIXI.loaders.Loader;
import Player from "./Player";
import LevelContainer from "./LevelContainer";
import Globals from "./Globals";

export default class MainContainer extends View {
	private _levelContainer:LevelContainer;
	private _player:Player;

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
		this.initPlayer();
		this.initLevelContainer();
		this.launchTicker();
	}

	private initPlayer():void {
		this._player = new Player();
	}

	private initLevelContainer():void {
		this._levelContainer = new LevelContainer();
		this._levelContainer.setSize(1500, 1000);
		this._levelContainer.init(this._player);
		this.addChild(this._levelContainer);
	}

	private launchTicker():void {
		Globals.pixiApp.ticker.add(() => {
			this.moveLevelContainer();
		});
	}

	private moveLevelContainer():void {
		const minX:number = (this._levelContainer.w - this.w) * -1;
		const maxX:number = 0;
		const calculatedX:number = ((this.w - this._player.width) / 2) - this._player.x;
		this._levelContainer.x = Math.min(maxX, Math.max(minX, calculatedX));
	}
}