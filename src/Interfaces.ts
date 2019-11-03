import Sprite = PIXI.Sprite;
import Graphics = PIXI.Graphics;
import Point = PIXI.Point;

export interface ILevel {
	types:IType[];
	blocks:IBlock[];
}

export interface IType {
	id:string;
	image:string;
	hit:IHit;
}

export interface IHit {
	x:number;
	y:number;
	width:number;
	height:number;
}

export interface IBlock {
	type:string;
	x:number;
	y:number;
}