import {View} from "./View";
import Player from "./level/Player";
import Level from "./level/Level";
import Globals from "./Globals";
import {ILevel} from "./Interfaces";
import Server from "./Server";
import XhrRequest from "./promises/XhrRequest";
import PixiRequest from "./promises/PixiRequest";

export default class MainContainer extends View {
	private _level:Level;
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
		new XhrRequest().createPromise(Server.getLink(), {action:"get_level_data", id:"2"})
			.then((level:ILevel) => {
				this._levelData = level;
				new PixiRequest().createPromise(Player.LEFT_SKIN_NAME)
					.then(() => {
						new PixiRequest().createPromise(Player.RIGHT_SKIN_NAME)
							.then(() => {
								this.completeLoadingHandler()
							});
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
		this._level = new Level(this._player, this._levelData);
		this._level.setSize(this._levelData.stage.width, this._levelData.stage.height);
		this.addChild(this._level);
	}

	private launchTicker():void {
		Globals.pixiApp.ticker.add(() => {
			this.moveLevelContainer();
		});
	}

	private moveLevelContainer():void {
		const minX:number = (this._level.w - this.w) * -1;
		const maxX:number = 0;
		const calculatedX:number = ((this.w - this._player.width) / 2) - this._player.x;
		this._level.x = Math.round(Math.min(maxX, Math.max(minX, calculatedX)));

		const minY:number = (this._level.h - this.h) * -1;
		const maxY:number = 0;
		const calculatedY:number = ((this.h - this._player.height) / 2) - this._player.y;
		this._level.y = Math.round(Math.min(maxY, Math.max(minY, calculatedY)));
	}
}