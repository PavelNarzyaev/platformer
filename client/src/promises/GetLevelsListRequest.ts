import ServerRequest from "./ServerRequest";
import {ILevelInfo} from "../Interfaces";
import LevelsManager from "../model/LevelsManager";

export default class GetLevelsListRequest extends ServerRequest {
	constructor() {
		super();
		this.setRequestData("get_levels_list");
		this._requestId = "GetLevelsListRequest";
	}

	protected parseRequest(levelsList:ILevelInfo[]):void {
		super.parseRequest(levelsList);
		levelsList.forEach((levelInfo:ILevelInfo) => {
			LevelsManager.addLevel(levelInfo);
		});
	}
}
