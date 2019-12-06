export default class AbstractRequest {
	private static readonly _successRequestsIds:Set<string> = new Set<string>();
	private static readonly _executingUniqueRequests:Map<string, AbstractRequest> = new Map<string, AbstractRequest>();

	protected _requestId:string = null;
	private _requestPromise:Promise<any>;

	public createPromise(forcedRequest:boolean = false):Promise<any> {
		if (this._requestId !== null) {
			if (forcedRequest) {
				return this.createUniqueRequestPromise();
			} else {
				if (AbstractRequest._successRequestsIds.has(this._requestId)) {
					return this.createEmptyPromise();
				} else {
					const uniqueRequest:AbstractRequest = AbstractRequest._executingUniqueRequests.get(this._requestId);
					if (uniqueRequest) {
						return this.createWaitPromise(uniqueRequest);
					} else {
						return this.createUniqueRequestPromise();
					}
				}
			}
		} else {
			return this.requestPromiseFactory();
		}
	}

	public getRequestPromise():Promise<any> {
		return this._requestPromise;
	}

	private createEmptyPromise():Promise<any> {
		return new Promise<any>((resolve) => {
			resolve();
		});
	}

	private createWaitPromise(uniqueRequest:AbstractRequest):Promise<any> {
		return new Promise<any>((resolve, reject) => {
			uniqueRequest.getRequestPromise()
				.then((...params:any[]) => { resolve.apply(this, params); })
				.catch((...params:any[]) => { reject.apply(this, params); });
		});
	}

	private createUniqueRequestPromise():Promise<any> {
		AbstractRequest._executingUniqueRequests.set(this._requestId, this);
		return new Promise<any>((resolve, reject) => {
			this._requestPromise = this.requestPromiseFactory();
			this._requestPromise
				.then((...params:any[]) => {
					AbstractRequest._executingUniqueRequests.delete(this._requestId);
					AbstractRequest._successRequestsIds.add(this._requestId);
					resolve.apply(this, params);
				})
				.catch((...params:any[]) => {
					AbstractRequest._executingUniqueRequests.delete(this._requestId);
					reject.apply(this, params);
				});
		});
	}

	protected requestPromiseFactory():Promise<any> {
		return null;
	}
}