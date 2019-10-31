import Loader = PIXI.loaders.Loader;
import MiniSignalBinding = PIXI.MiniSignalBinding;
import LoaderOptions = PIXI.loaders.LoaderOptions;
import Resource = PIXI.loaders.Resource;

export function pixiLoading(url:string):Promise<any> {
	return new Promise((resolve, reject) => {
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
				resolve(loader.resources[url].data);
			} else {
				reject(errorMessage);
			}
		});
		const loaderOptions:LoaderOptions = {};
		loaderOptions.crossOrigin = false;
		loaderOptions.loadType = Resource.LOAD_TYPE.XHR;
		loader.add(url, url, loaderOptions);
		loader.load();
	});
}