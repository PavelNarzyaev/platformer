export default class Server {
	private static readonly RELEASE_LINK:string = 'http://dolgofor.ru/platformer-server/';
	private static readonly TEST_LINK:string = 'http://dolgofor.ru/platformer-server-test/';

	public static getLink():string {
		return process.env.RELEASE ? Server.RELEASE_LINK : Server.TEST_LINK;
	}
}