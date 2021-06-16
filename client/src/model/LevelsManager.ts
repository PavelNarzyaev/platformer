import {ILevel, ILevelInfo} from "../Interfaces";
import Random from "../utils/Random";

export default class LevelsManager {
	private static readonly _levelById:Map<number, ILevelInfo> = new Map<number, ILevelInfo>();
	private static readonly _levelsIds:number[] = [];

	public static addLevel(levelInfo:ILevelInfo):void {
		LevelsManager._levelsIds.push(levelInfo.id);
		LevelsManager._levelById.set(levelInfo.id, levelInfo);
	}

	public static addLevelData(levelId:number, data:ILevel):void {
		const levelInfo:ILevelInfo = LevelsManager._levelById.get(levelId);
		if (levelInfo) {
			levelInfo.data = data;
		}
	}

	public static getLevel(levelId:number):ILevelInfo {
		return LevelsManager._levelById.get(levelId);
	}

	public static levelsNum():number {
		return LevelsManager._levelsIds.length;
	}

	public static getRandomLevelId():number {
		return Random.choose.apply(null, LevelsManager._levelsIds);
	}

	public static getFirstLevelId():number {
		return LevelsManager._levelsIds[0];
	}
}