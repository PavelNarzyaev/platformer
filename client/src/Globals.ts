import Application = PIXI.Application;
import {IObservableValue, observable} from "mobx";

export default class Globals {
	public static developerMode:IObservableValue<boolean> = observable.box(false);
	public static pixiApp:Application;

	constructor() {
	}
}

export function addEvent(object:any, type:string, callback:(...params:any[]) => void):(...params:any[]) => void {
	if (object.addEventListener) {
		object.addEventListener(type, callback, { passive: false });
	} else if (object.attachEvent) {
		object.attachEvent("on" + type, callback);
	} else {
		object["on" + type] = callback;
	}
	return callback;
}

export function removeEvent(object:any, type:string, callback:(...params:any[]) => void) {
	if (object.removeEventListener) {
		object.removeEventListener(type, callback, false);
	} else if (object.dettachEvent) {
		object.detachEvent("on" + type, callback);
	} else {
		object["on" + type] = null;
	}
}