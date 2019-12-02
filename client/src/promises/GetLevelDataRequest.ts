import ServerRequest from "./ServerRequest";
import {ILevel} from "../Interfaces";

export default class GetLevelDataRequest extends ServerRequest {
	constructor(action:string, id:number) {
		super({action, id});
	}

	public createPromise():Promise<ILevel> {
		return super.createPromise();
	}
}
