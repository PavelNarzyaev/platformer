import {View} from "./View";
import Player from "./level/Player";
import Level from "./level/Level";
import Globals from "./Globals";
import PixiRequest from "./promises/PixiRequest";
import GetLevelDataRequest from "./promises/GetLevelDataRequest";
import PromisesGroup from "./promises/PromisesGroup";
import GetLevelsListRequest from "./promises/GetLevelsListRequest";
import LevelsManager from "./model/LevelsManager";
import {ILevelInfo} from "./Interfaces";

export default class MainContainer extends View {
	private _level:Level;
	private _player:Player;
	private _randomLevelId:number;

	constructor() {
		super();
	}

	protected init():void {
		super.init();
		this.loading();
	}

	private loading():void {
		PromisesGroup.pack([
			() => this.loadingRandomLevel(),
			// TODO: move into Level.ts
			() => new PixiRequest(Player.LEFT_SKIN_NAME).createPromise(),
			() => new PixiRequest(Player.RIGHT_SKIN_NAME).createPromise(),
		])
			.finally(() => {
				this.completeLoadingHandler();
			});
	}

	private async loadingRandomLevel():Promise<void> {
		await new GetLevelsListRequest().createPromise();
		if (LevelsManager.levelsNum()) {
			this._randomLevelId = LevelsManager.getRandomLevelId();
			await new GetLevelDataRequest(this._randomLevelId).createPromise();
		}
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
		const levelInfo:ILevelInfo = LevelsManager.getLevel(this._randomLevelId);
		if (levelInfo && levelInfo.data) {
			this._level = new Level(this._player, this._randomLevelId);
			this._level.setSize(levelInfo.data.stage.width, levelInfo.data.stage.height);
			this.addChild(this._level);
		}
	}

	private launchTicker():void {
		Globals.pixiApp.ticker.add(() => {
			if (this._level) {
				this._level.x = this.calculateLevelPosition(this.w, this._level.w, this._player.width, this._player.x);
				this._level.y = this.calculateLevelPosition(this.h, this._level.h, this._player.height, this._player.y);
			}
		});
	}

	private calculateLevelPosition(thisSize:number, levelSize:number, playerSize:number, playerPosition:number):number {
		const minLevelPosition:number = thisSize - levelSize;
		const maxLevelPosition:number = 0;
		const calculatedLevelPosition:number = (thisSize - playerSize) / 2 - playerPosition;
		return Math.round(Math.min(maxLevelPosition, Math.max(minLevelPosition, calculatedLevelPosition)));
	}
}