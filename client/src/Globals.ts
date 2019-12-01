import Application = PIXI.Application;
import EventEmitter = PIXI.utils.EventEmitter;

export default class Globals {
	public static readonly CHANGE_DEVELOPER_MODE_EVENT:symbol = Symbol();

	public static pixiApp:Application;
	private static _developerMode:boolean = false;
	private static _emitter:EventEmitter;

	public static setDeveloperMode(value:boolean):void {
		Globals._developerMode = value;
		Globals.getEmitter().emit(Globals.CHANGE_DEVELOPER_MODE_EVENT);
	}

	public static getDeveloperMode():boolean {
		return Globals._developerMode;
	}

	public static getEmitter():EventEmitter {
		if (!Globals._emitter) {
			Globals._emitter = new EventEmitter();
		}
		return Globals._emitter;
	}
}
