import XhrRequest from "./XhrRequest";
import Server from "../Server";

export default class ServerRequest extends XhrRequest {
	protected getUrl():string {
		return Server.getLink();
	}
}