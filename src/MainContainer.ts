import {View} from "./View";
import Player from "./level/Player";
import Level from "./level/Level";
import Globals from "./Globals";
import {pixiLoading, xhrJsonLoading} from "./Promises";
import {ILevel} from "./Interfaces";

export default class MainContainer extends View {
	private _levelContainer:Level;
	private _levelData:ILevel;
	private _player:Player;

	constructor() {
		super();
	}

	protected init():void {
		super.init();
		this.loading();
	}

	private loading():void {
		xhrJsonLoading("levels/level_2.json")
			.then((level:ILevel) => {
				this._levelData = level;
				pixiLoading(Player.LEFT_SKIN_NAME)
					.then(() => {
						pixiLoading(Player.RIGHT_SKIN_NAME)
							.then(() => {
								this.completeLoadingHandler()
							})
					});
			});
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
		this._levelContainer = new Level(this._player, this._levelData);
		this._levelContainer.setSize(this._levelData.stage.width, this._levelData.stage.height);
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