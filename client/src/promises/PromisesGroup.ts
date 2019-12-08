export default class PromisesGroup {
	public static pack(factories:(() => Promise<void>)[]):Promise<void> {
		return new Promise<void>((resolve) => {
			let completedCounter:number = 0;
			factories.forEach((factory:() => Promise<void>) => {
				factory()
					.finally(() => {
						completedCounter++;
						if (completedCounter == factories.length) {
							resolve();
						}
					});
			});
		});
	}

	public static queue(factories:(() => Promise<void>)[]):Promise<void> {
		return new Promise<void>((resolve, reject) => {
			let completedCounter:number = 0;
			createPromise();
			function createPromise():void {
				factories[completedCounter]()
					.then(() => {
						completedCounter++;
						if (completedCounter < factories.length) {
							createPromise();
						} else {
							resolve();
						}
					})
					.catch(() => {
						reject();
					});
			}
		});
	}
}