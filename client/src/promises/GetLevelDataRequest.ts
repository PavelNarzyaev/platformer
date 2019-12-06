import ServerRequest from "./ServerRequest";
import {ILevel} from "../Interfaces";

export default class GetLevelDataRequest extends ServerRequest {
	constructor(id:number) {
		super({action:"get_level_data", id});
		this._requestId = "GetLevelDataRequest::" + id;
	}

	public createPromise():Promise<ILevel> {
		return super.createPromise();
	}
}
