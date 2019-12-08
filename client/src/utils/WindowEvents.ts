export default class WindowEvents {
	public static readonly RESIZE:string = "resize";
	public static readonly KEY_DOWN:string = "keydown";
	public static readonly KEY_UP:string = "keyup";

	public static add(type:string, callback:(...params:any[]) => void):(...params:any[]) => void {
		const w:any = window;
		if (w.addEventListener) {
			w.addEventListener(type, callback, { passive: false });
		} else if (w.attachEvent) {
			w.attachEvent("on" + type, callback);
		} else {
			w["on" + type] = callback;
		}
		return callback;
	}

	public static remove(type:string, callback:(...params:any[]) => void) {
		const w:any = window;
		if (w.removeEventListener) {
			w.removeEventListener(type, callback, false);
		} else if (w.detachEvent) {
			w.detachEvent("on" + type, callback);
		} else {
			w["on" + type] = null;
		}
	}
}