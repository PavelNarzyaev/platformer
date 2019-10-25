import Rectangle = PIXI.Rectangle;
import Globals, {addEvent} from "./Globals";
import MainContainer from "./MainContainer";

export class Main {
	private _windowSize:Rectangle;
	private _mainContainer:MainContainer;

	constructor(canvasId:string) {
		this.initialize(canvasId);
	}

	private initialize(canvasId:string):void {
		this.createPixiApp(canvasId);
		this._windowSize = new Rectangle();
		this._mainContainer = new MainContainer();
		this._mainContainer.setSize(1000, 1000);
		this._mainContainer.init();
		Globals.pixiApp.stage.addChild(this._mainContainer);
		addEvent(window, "resize", () => { this.windowResizeHandler(); });
		this.refreshSize();
		this.printWelcomeMessage();
	}

	private createPixiApp(canvasId:string):void {
		const appConfig:PIXI.ApplicationOptions = {
			backgroundColor:0xffffff,
			view:document.getElementById(canvasId) as HTMLCanvasElement,
			// rounding resolution for escape troubles with invisible fonts on some Android devices
			resolution:((devicePixelRatio || 1) < 2) ? 1 : 2,
		};
		Globals.pixiApp = new PIXI.Application(appConfig);
	}

	private printWelcomeMessage():void {
		let welcomeString:string = process.env.PROJECT_NAME + " " + process.env.PROJECT_VERSION;
		if (!process.env.RELEASE) {
			welcomeString += " (test)";
			welcomeString += "\n>>> " + (process.env.LOCAL ? "LOCAL" : "SERVER") + " <<<";
		}
		welcomeString += "\nDeveloped by «" + process.env.PROJECT_AUTHOR + "»";
		console.log(welcomeString);
	}

	private windowResizeHandler():void {
		this.refreshSize();
	}

	private refreshSize():void {
		this.refreshWindowSize();
		this.alignPixiApp();
		this.alignMainContainer();
	}

	private refreshWindowSize():void {
		this._windowSize.width = window.innerWidth;
		this._windowSize.height = window.innerHeight;
	}

	private alignPixiApp():void {
		Globals.pixiApp.renderer.view.style.width = this._windowSize.width + "px";
		Globals.pixiApp.renderer.view.style.height = this._windowSize.height + "px";
		Globals.pixiApp.renderer.resize(this._windowSize.width, this._windowSize.height);
	}

	private alignMainContainer():void {
		const factorW:number = this._windowSize.width / this._mainContainer.w;
		const factorH:number = this._windowSize.height / this._mainContainer.h;
		const scale:number = Math.min(factorW, factorH);
		this._mainContainer.scale.x = this._mainContainer.scale.y = scale;
		this._mainContainer.x = Math.round((this._windowSize.width - this._mainContainer.w * scale) / 2);
		this._mainContainer.y = Math.round((this._windowSize.height - this._mainContainer.h * scale) / 2);
	}
}