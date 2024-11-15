import {ILevel, ILevelInfo} from "../Interfaces";
import Random from "../utils/Random";

export default class LevelsManager {
	private static readonly _levelById:Map<number, ILevelInfo> = new Map<number, ILevelInfo>();
	private static readonly _levelsIds:number[] = [];

	public static init():void {
		let level:ILevelInfo = JSON.parse("{\n" +
			"  \"id\": 1,\n" +
			"  \"name\": \"Level 1\",\n" +
			"  \"data\": {\n" +
			"    \"stage\": {\"width\": 2000, \"height\": 2000},\n" +
			"    \"types\": [\n" +
			"      {\"id\": \"graphite_cube\", \"image\": \"img/graphite_cube.png\", \"collision\": {\"top\": 15, \"left\": 29, \"right\": 157, \"bottom\": 142}},\n" +
			"      {\"id\": \"metal_cube\", \"image\": \"img/metal_cube.png\", \"collision\": {\"top\": 15, \"left\": 29, \"right\": 157, \"bottom\": 142}},\n" +
			"      {\"id\": \"wood_cube\", \"image\": \"img/wood_cube.png\", \"collision\": {\"top\": 15, \"left\": 29, \"right\": 157, \"bottom\": 142}},\n" +
			"      {\"id\": \"graphite_horizontal\", \"image\": \"img/graphite_horizontal.png\", \"collision\": {\"top\": 15, \"left\": 29, \"right\": 471, \"bottom\": 142}},\n" +
			"      {\"id\": \"metal_horizontal\", \"image\": \"img/metal_horizontal.png\", \"collision\": {\"top\": 15, \"left\": 29, \"right\": 471, \"bottom\": 142}},\n" +
			"      {\"id\": \"wood_horizontal\", \"image\": \"img/wood_horizontal.png\", \"collision\": {\"top\": 15, \"left\": 29, \"right\": 471, \"bottom\": 142}},\n" +
			"      {\"id\": \"graphite_vertical\", \"image\": \"img/graphite_vertical.png\", \"collision\": {\"top\": 15, \"left\": 29, \"right\": 157, \"bottom\": 456}},\n" +
			"      {\"id\": \"metal_vertical\", \"image\": \"img/metal_vertical.png\", \"collision\": {\"top\": 15, \"left\": 29, \"right\": 157, \"bottom\": 456}},\n" +
			"      {\"id\": \"wood_vertical\", \"image\": \"img/wood_vertical.png\", \"collision\": {\"top\": 15, \"left\": 29, \"right\": 157, \"bottom\": 456}}\n" +
			"    ],\n" +
			"    \"blocks\": [\n" +
			"      {\"x\": 1098, \"y\": 1110, \"type\": \"graphite_cube\"},\n" +
			"      {\"x\": 791, \"y\": 306, \"type\": \"graphite_cube\"},\n" +
			"      {\"x\": 912, \"y\": 919, \"type\": \"graphite_cube\"},\n" +
			"      {\"x\": 528, \"y\": 1552, \"type\": \"metal_cube\"},\n" +
			"      {\"x\": 656, \"y\": 1552, \"type\": \"metal_cube\"},\n" +
			"      {\"x\": 528, \"y\": 1425, \"type\": \"metal_cube\"},\n" +
			"      {\"x\": 1226, \"y\": 1552, \"type\": \"wood_cube\"},\n" +
			"      {\"x\": 305, \"y\": 301, \"type\": \"wood_cube\"},\n" +
			"      {\"x\": 1098, \"y\": 714, \"type\": \"wood_cube\"},\n" +
			"      {\"x\": 784, \"y\": 1237, \"type\": \"graphite_horizontal\"},\n" +
			"      {\"x\": 784, \"y\": 1552, \"type\": \"metal_horizontal\"},\n" +
			"      {\"x\": 0, \"y\": 1872, \"type\": \"wood_horizontal\"},\n" +
			"      {\"x\": 442, \"y\": 1872, \"type\": \"wood_horizontal\"},\n" +
			"      {\"x\": 884, \"y\": 1872, \"type\": \"wood_horizontal\"},\n" +
			"      {\"x\": 1326, \"y\": 1872, \"type\": \"wood_horizontal\"},\n" +
			"      {\"x\": 1557, \"y\": 1745, \"type\": \"wood_horizontal\"},\n" +
			"      {\"x\": 784, \"y\": 605, \"type\": \"graphite_vertical\"},\n" +
			"      {\"x\": 1226, \"y\": 923, \"type\": \"metal_vertical\"},\n" +
			"      {\"x\": 1226, \"y\": 482, \"type\": \"wood_vertical\"}\n" +
			"    ]\n" +
			"  }\n" +
			"}") as ILevelInfo;
		this.addLevel(level);
		this.addLevelData(level.id, level.data);
	}

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
}