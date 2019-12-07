import {View} from "./View";
import Player from "./level/Player";
import Level from "./level/Level";
import Globals from "./Globals";
import {ILevel} from "./Interfaces";
import PixiRequest from "./promises/PixiRequest";
import GetLevelDataRequest from "./promises/GetLevelDataRequest";
import PromisesGroup from "./promises/PromisesGroup";

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
		new GetLevelDataRequest(1).createPromise()
			.then((levelData:ILevel) => {
				this._levelData = levelData;
				PromisesGroup.pack([
					() => new PixiRequest(Player.LEFT_SKIN_NAME).createPromise(),
					() => new PixiRequest(Player.RIGHT_SKIN_NAME).createPromise(),
				])
					.finally(() => {
						this.completeLoadingHandler();
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
			this._level.x = this.calculateLevelPosition(this.w, this._level.w, this._player.width, this._player.x);
			this._level.y = this.calculateLevelPosition(this.h, this._level.h, this._player.height, this._player.y);
		});
	}

	private calculateLevelPosition(thisSize:number, levelSize:number, playerSize:number, playerPosition:number):number {
		const minLevelPosition:number = thisSize - levelSize;
		const maxLevelPosition:number = 0;
		const calculatedLevelPosition:number = (thisSize - playerSize) / 2 - playerPosition;
		return Math.round(Math.min(maxLevelPosition, Math.max(minLevelPosition, calculatedLevelPosition)));
	}
}