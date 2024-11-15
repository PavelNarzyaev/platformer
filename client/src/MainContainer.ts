import {View} from "./View";
import Player from "./level/Player";
import Level from "./level/Level";
import Globals from "./Globals";
import PixiRequest from "./promises/PixiRequest";
import PromisesGroup from "./promises/PromisesGroup";
import LevelsManager from "./model/LevelsManager";
import {ILevelInfo} from "./Interfaces";

export default class MainContainer extends View {
	private _level:Level;
	private _player:Player;

	constructor() {
		super();
	}

	protected init():void {
		super.init();
		this.loading();
	}

	private loading():void {
		PromisesGroup.pack([
			() => this.loadLevel("level1.json"),
			() => this.loadLevel("level2.json"),
			() => new PixiRequest(Player.LEFT_SKIN_NAME).createPromise(),
			() => new PixiRequest(Player.RIGHT_SKIN_NAME).createPromise(),
		])
			.finally(() => {
				this.completeLoadingHandler();
			});
	}

	private async loadLevel(fileName: string): Promise<void> {
		const request = new PixiRequest("levels/" + fileName);
		await request.createPromise();
		const levelData = request.getResult();
		LevelsManager.addLevel(levelData);
		LevelsManager.addLevelData(levelData.id, levelData.data);
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
		const levelId:number = Math.ceil(Math.random() * 2);
		const levelInfo:ILevelInfo = LevelsManager.getLevel(levelId);
		if (levelInfo && levelInfo.data) {
			this._level = new Level(this._player, levelId);
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