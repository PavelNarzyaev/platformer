import Sprite = PIXI.Sprite;
import Graphics = PIXI.Graphics;

export interface ILevel {
	types:IType[];
	blocks:IBlock[];
}

export interface IType {
	id:string;
	image:string;
	hit:IHit;
	front:IFront;
}

export interface IHit {
	x:number;
	y:number;
	width:number;
	height:number;
}

export interface IFront {
	x:number;
	y:number;
	width:number;
	height:number;
}

export interface IBlock {
	type:string;
	x:number;
	y:number;
	backSkin?:Sprite;
	hit?:Graphics;
	frontSkin?:Sprite;
}