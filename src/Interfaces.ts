export interface ILevel {
	types:IType[];
	blocks:IBlock[];
}

export interface IType {
	id:string;
	image:string;
	collision:ICollision;
}

export interface ICollision {
	left:number;
	right:number;
	top:number;
	bottom:number;
}

export interface IBlock {
	type:string;
	x:number;
	y:number;
}