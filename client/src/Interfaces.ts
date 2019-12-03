export interface ILevel {
	stage:IStage;
	types:IType[];
	blocks:IBlock[];
	[key:string]:any;
}

export interface IStage {
	width:number,
	height:number,
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