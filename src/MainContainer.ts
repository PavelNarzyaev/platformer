import {View} from "./View";
import Player from "./Player";
import LevelContainer from "./LevelContainer";
import Globals from "./Globals";
import {pixiLoading} from "./Promises";

export default class MainContainer extends View {
	private _levelContainer:LevelContainer;
	private _player:Player;

	constructor() {
		super();
	}

	protected init():void {
		super.init();
		this.loading();
	}

	private loading():void {
		pixiLoading(Player.SKIN_NAME)
			.then(() => { this.completeLoadingHandler(); });
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
		this._levelContainer = new LevelContainer(
			this._player,
			"levels/level_2.json"
		);
		this._levelContainer.setSize(2000, 2000);
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