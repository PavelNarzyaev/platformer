import AbstractRequest from "./AbstractRequest";

export default class XhrRequest extends AbstractRequest {
	constructor(
		protected requestData:object
	) {
		super();
	}

	public createPromise():Promise<any> {
		return new Promise<any>((resolve, reject) => {
			const xhr:XMLHttpRequest = new XMLHttpRequest();
			xhr.open(
				"GET",
				this.getUrl() + "?" + this.stringifyRequestData(this.requestData),
				true
			);
			xhr.setRequestHeader("Accept", "text/plain");
			xhr.responseType = "json";
			xhr.onreadystatechange = () => {
				if (xhr.readyState === 4) {
					if (xhr.status === 200) {
						resolve(xhr.response);
					} else {
						reject(xhr.status);
					}
				}
			};
			xhr.send();
		});
	}

	protected getUrl():string {
		return null;
	}

	private stringifyRequestData(data:any):string {
		let response:string = "";
		for (const dataKey in data) {
			if (data.hasOwnProperty(dataKey) && data[dataKey] !== undefined) {
				if (response !== "") {
					response += "&";
				}
				let value:string;
				if (typeof data[dataKey] === "object") {
					value = JSON.stringify(data[dataKey]);
				} else {
					value = data[dataKey];
				}
				response += dataKey + "=" + value;
			}
		}
		return response;
	}
}