import ServerRequest from "./ServerRequest";

export default class GetLevelDataRequest extends ServerRequest {
	constructor(
		private requestData:any,
	) {
		super();
	}

	protected getRequestData():any {
		return this.requestData;
	}
}