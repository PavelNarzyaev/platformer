import {View} from "./View";
import Loader = PIXI.loaders.Loader;
import Player from "./Player";
import LevelContainer from "./LevelContainer";
import Globals from "./Globals";

export default class MainContainer extends View {
	public static readonly SANDBLOCK_BACK_SKIN_NAME:string = "img/SandBlock_back.png";
	public static readonly SANDBLOCK_FRONT_SKIN_NAME:string = "img/SandBlock_front.png";
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
		loader.add(MainContainer.SANDBLOCK_BACK_SKIN_NAME);
		loader.add(MainContainer.SANDBLOCK_FRONT_SKIN_NAME);
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
		this._levelContainer.setSize(2000, 2000);
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
		this._levelContainer.x = Math.round(Math.min(maxX, Math.max(minX, calculatedX)));

		const minY:number = (this._levelContainer.h - this.h) * -1;
		const maxY:number = 0;
		const calculatedY:number = ((this.h - this._player.height) / 2) - this._player.y;
		this._levelContainer.y = Math.round(Math.min(maxY, Math.max(minY, calculatedY)));
	}
}