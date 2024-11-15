import Loader = PIXI.loaders.Loader;
import MiniSignalBinding = PIXI.MiniSignalBinding;
import LoaderOptions = PIXI.loaders.LoaderOptions;
import Resource = PIXI.loaders.Resource;
import AbstractRequest from "./AbstractRequest";

export default class PixiRequest extends AbstractRequest {
	private _result:any;

	constructor(
		private _url:string,
	) {
		super();
		this._requestId = "PixiRequest::" + this._url;
	}

	public getResult():any {
		return this._result;
	}

	protected requestPromiseFactory():Promise<void> {
		return new Promise<void>((resolve, reject) => {
			const loader:Loader = new Loader();

			let success:boolean = false;
			const onLoadSignal:MiniSignalBinding = loader.onLoad.add(() => {
				success = true;
			});

			let error:boolean = false;
			let errorMessage:string;
			const onErrorSignal:MiniSignalBinding = loader.onError.add((data:any) => {
				error = true;
				errorMessage = data.message;
			});

			let onCompleteSignal:MiniSignalBinding;
			onCompleteSignal = loader.onComplete.add(() => {
				onLoadSignal.detach();
				onErrorSignal.detach();
				onCompleteSignal.detach();
				if (success && !error) {
					this._result = loader.resources[this._url]?.data;
					resolve();
				} else {
					console.error("Error loading resource:", errorMessage);
					reject(errorMessage);
				}
			});

			const loaderOptions:LoaderOptions = {};
			loaderOptions.crossOrigin = false;
			loaderOptions.loadType = Resource.LOAD_TYPE.XHR;

			loader.add(this._url, this._url, loaderOptions);
			loader.load();
		});
	}
}
