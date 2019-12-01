import Application = PIXI.Application;
import {IObservableValue, observable} from "mobx";

export default class Globals {
	public static developerMode:IObservableValue<boolean> = observable.box(false);
	public static pixiApp:Application;
}
