import Rectangle = PIXI.Rectangle;
import Globals, {addEvent} from "./Globals";
import MainContainer from "./MainContainer";
import Graphics = PIXI.Graphics;

export class Main {
	private _windowSize:Rectangle;
	private _mainContainer:MainContainer;
	private _outOfBoundsCover:Graphics;

	constructor(canvasId:string) {
		this.initialize(canvasId);
	}

	private initialize(canvasId:string):void {
		this.createPixiApp(canvasId);
		this._windowSize = new Rectangle();
		this.initMainContainer();
		this.initOutOfBoundsCover();
		addEvent(window, "resize", () => { this.windowResizeHandler(); });
		this.refreshSize();
		this.printWelcomeMessage();
	}

	private initMainContainer():void {
		this._mainContainer = new MainContainer();
		this._mainContainer.setSize(1500, 1000);
		Globals.pixiApp.stage.addChild(this._mainContainer);
	}

	private initOutOfBoundsCover():void {
		this._outOfBoundsCover = new Graphics();
		Globals.pixiApp.stage.addChild(this._outOfBoundsCover);
	}

	private createPixiApp(canvasId:string):void {
		const appConfig:PIXI.ApplicationOptions = {
			antialias:true,
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
		this.alignOutOfBoundsCover();
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
		let scale:number;
		const windowRatio:number = this._windowSize.width / this._windowSize.height;
		const containerRatio:number = this._mainContainer.w / this._mainContainer.h;
		if (windowRatio !== containerRatio) {
			if (windowRatio < containerRatio) {
				scale = this._windowSize.width / this._mainContainer.w;
				this._mainContainer.scale.x = this._mainContainer.scale.y = scale;
				this._mainContainer.x = 0;
				this._mainContainer.y = Math.round((this._windowSize.height - this._mainContainer.h * scale) / 2);
			} else {
				scale = this._windowSize.height / this._mainContainer.h;
				this._mainContainer.scale.x = this._mainContainer.scale.y = scale;
				this._mainContainer.x = Math.round((this._windowSize.width - this._mainContainer.w * scale) / 2);
				this._mainContainer.y = 0;
			}
		} else {
			scale = this._windowSize.width / this._mainContainer.w;
			this._mainContainer.scale.x = this._mainContainer.scale.y = scale;
			this._mainContainer.x = 0;
			this._mainContainer.y = 0;
		}
	}

	private alignOutOfBoundsCover():void {
		this._outOfBoundsCover.clear();
		this._outOfBoundsCover.beginFill(0x000000);
		if (this._mainContainer.h * this._mainContainer.scale.y < this._windowSize.height) {
			const coverHeight:number = this._mainContainer.y;
			this._outOfBoundsCover.drawRect(0, 0, this._windowSize.width, coverHeight);
			this._outOfBoundsCover.drawRect(
				0,
				this._windowSize.height - coverHeight,
				this._windowSize.width, coverHeight,
			)
		} else if (this._mainContainer.w * this._mainContainer.scale.x < this._windowSize.width) {
			const coverWidth:number = this._mainContainer.x;
			this._outOfBoundsCover.drawRect(0, 0, coverWidth, this._windowSize.height);
			this._outOfBoundsCover.drawRect(
				this._windowSize.width - coverWidth,
				0,
				coverWidth,
				this._windowSize.height,
			);
		}
	}
}