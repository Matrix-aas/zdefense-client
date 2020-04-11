import * as PIXI from 'pixi.js';
import ArrayBufferStream from "../Network/ArrayBufferStream";
import MathUtils from "./MathUtils";

export default class Point {
    public x: number;
    public y: number;

    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    public static distance(point1: Point, point2: Point): number {
        return Math.sqrt(Point.squareDistance(point1, point2));
    }

    public static squareDistance(point1: Point, point2: Point): number {
        return ((point2.x - point1.x) * (point2.x - point1.x)) + ((point2.y - point1.y) * (point2.y - point1.y));
    }

    public static angle(point1: Point, point2: Point): number {
        let res = 0;
        if (point1.y == point2.y) {
            if (point2.x >= point1.x)
                res = 0;
            if (point2.x < point1.x)
                res = Math.PI;
        } else if (point1.x == point2.x) {
            if (point2.y == point1.y)
                res = 0;
            if (point2.y > point1.y)
                res = MathUtils.toRadians(90.0);
            if (point2.y < point1.y)
                res = MathUtils.toRadians(270.0);
        } else {
            res = Math.atan2(point2.y - point1.y, point2.x - point1.x);
            if (res < 0) {
                res = res * -1;
                res = (Math.PI - res + Math.PI);
            }
        }
        return res;
    }

    public static writeToBuffer(point: Point, stream: ArrayBufferStream): void {
        stream.writeFloat32(point.x);
        stream.writeFloat32(point.y);
    }

    public static createFromBuffer(stream: ArrayBufferStream): Point {
        return new Point(
            stream.readFloat32(),
            stream.readFloat32()
        );
    }

    public set(x: number | Point, y: number): this {
        if (x instanceof Point) {
            this.copyFrom(x);
        } else {
            this.x = x;
            this.y = y;
        }
        return this;
    }

    public copyFrom(point: Point): this {
        this.x = point.x;
        this.y = point.y;
        return this;
    }

    public add(x: number | Point, y?: number): this {
        if (x instanceof Point) {
            this.x += x.x;
            this.y += x.y;
        } else if (y === undefined) {
            this.add(x, x);
        } else {
            this.x += x;
            this.y += y;
        }
        return this;
    }

    public sub(x: number | Point, y?: number): this {
        if (x instanceof Point) {
            this.x -= x.x;
            this.y -= x.y;
        } else if (y === undefined) {
            this.sub(x, x);
        } else {
            this.x -= x;
            this.y -= y;
        }
        return this;
    }

    public mul(x: number | Point, y?: number): this {
        if (x instanceof Point) {
            this.x *= x.x;
            this.y *= x.y;
        } else if (y === undefined) {
            this.mul(x, x);
        } else {
            this.x *= x;
            this.y *= y;
        }
        return this;
    }

    public div(x: number | Point, y?: number): this {
        if (x instanceof Point) {
            this.x /= x.x;
            this.y /= x.y;
        } else if (y === undefined) {
            this.div(x, x);
        } else {
            this.x /= x;
            this.y /= y;
        }
        return this;
    }

    public clone(): Point {
        return new Point(this.x, this.y);
    }

    public distance(another: Point): number {
        return Point.distance(this, another);
    }

    public squareDistance(another: Point): number {
        return Point.squareDistance(this, another);
    }

    public angle(another: Point): number {
        return Point.angle(this, another);
    }

    public writeToBuffer(stream: ArrayBufferStream): void {
        Point.writeToBuffer(this, stream);
    }

    public readFromBuffer(stream: ArrayBufferStream): Point {
        this.x = stream.readFloat32();
        this.y = stream.readFloat32();
        return this;
    }

    public toPIXI(): PIXI.IPoint {
        return new PIXI.Point(this.x, this.y);
    }
}