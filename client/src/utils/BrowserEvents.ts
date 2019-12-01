export default class BrowserEvents {
	public static readonly RESIZE:string = "resize";
	public static readonly KEY_DOWN:string = "keydown";
	public static readonly KEY_UP:string = "keyup";

	public static addEvent(object:any, type:string, callback:(...params:any[]) => void):(...params:any[]) => void {
		if (object.addEventListener) {
			object.addEventListener(type, callback, { passive: false });
		} else if (object.attachEvent) {
			object.attachEvent("on" + type, callback);
		} else {
			object["on" + type] = callback;
		}
		return callback;
	}

	public static removeEvent(object:any, type:string, callback:(...params:any[]) => void) {
		if (object.removeEventListener) {
			object.removeEventListener(type, callback, false);
		} else if (object.dettachEvent) {
			object.detachEvent("on" + type, callback);
		} else {
			object["on" + type] = null;
		}
	}
}