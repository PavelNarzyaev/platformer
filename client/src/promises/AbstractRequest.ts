export default class AbstractRequest {
	private static readonly _successRequestsIds:Set<string> = new Set<string>();
	private static readonly _executingUniqueRequests:Map<string, AbstractRequest> = new Map<string, AbstractRequest>();

	protected _requestId:string = null;
	private _requestPromise:Promise<void>;

	public createPromise(forcedRequest:boolean = false):Promise<void> {
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

	public getRequestPromise():Promise<void> {
		return this._requestPromise;
	}

	private createEmptyPromise():Promise<void> {
		return new Promise<void>((resolve) => {
			resolve();
		});
	}

	private createWaitPromise(uniqueRequest:AbstractRequest):Promise<void> {
		return new Promise<void>((resolve, reject) => {
			uniqueRequest.getRequestPromise()
				.then(() => resolve())
				.catch(() => reject());
		});
	}

	private createUniqueRequestPromise():Promise<void> {
		AbstractRequest._executingUniqueRequests.set(this._requestId, this);
		return new Promise<void>((resolve, reject) => {
			this._requestPromise = this.requestPromiseFactory();
			this._requestPromise
				.then(() => {
					AbstractRequest._executingUniqueRequests.delete(this._requestId);
					AbstractRequest._successRequestsIds.add(this._requestId);
					resolve();
				})
				.catch(() => {
					AbstractRequest._executingUniqueRequests.delete(this._requestId);
					reject();
				});
		});
	}

	protected requestPromiseFactory():Promise<void> {
		return null;
	}
}