import ServerRequest from "./ServerRequest";
import {ILevel} from "../Interfaces";
import LevelsManager from "../model/LevelsManager";

export default class GetLevelDataRequest extends ServerRequest {
	constructor(
		private _id:number,
	) {
		super();
		this.setRequestData("get_level_data", { id:this._id });
		this._requestId = "GetLevelDataRequest::" + this._id;
	}

	protected parseRequest(levelData:ILevel):void {
		super.parseRequest(levelData);
		LevelsManager.addLevelData(this._id, levelData);
	}
}
