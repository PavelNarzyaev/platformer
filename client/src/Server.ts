export default class Server {
	private static readonly RELEASE_LINK:string = 'http://narzyaevplatformer.com';
	private static readonly TEST_LINK:string = 'http://narzyaevplatformertest.com';

	public static getLink():string {
		return process.env.RELEASE ? Server.RELEASE_LINK : Server.TEST_LINK;
	}
}