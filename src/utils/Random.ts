export default class Random {
	public static genInteger(min:number, max:number):number {
		return Math.floor(Random.genNumber(min, max + 1));
	}

	public static genNumber(min:number, max:number):number {
		return Math.random() * (max - min) + min;
	}

	public static genStr(length:number):string {
		const chars:string[] = [
			"1", "2", "3", "4", "5", "6", "7", "8", "9", "0",
			"a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m",
			"n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
			"A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
			"N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
		];
		let result:string = "";
		for (let i:number = 0; i < length; i++) {
			result += Random.choose.apply(Random, chars);
		}
		return result;
	}

	public static genBoolean():boolean {
		return Random.choose(true, false);
	}

	public static genColor():number {
		return Random.genInteger(0x000000, 0xffffff);
	}

	public static choose(...args:any[]):any {
		return args[Random.genInteger(0, args.length - 1)];
	}
}
