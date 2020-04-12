import Game from "./Game";

export default class Camera {
    protected X = 0;
    protected Y = 0;

    public init(): void {
        //
    }

    public getX(): number {
        return this.X;
    }

    public getY(): number {
        return this.Y;
    }

    public moveTo(x: number, y: number): void {
        this.X = x;
        this.Y = y;
        Game.instance.emit('camera.move', this.X, this.Y);
    }

    public move(diffX: number, diffY: number): void {
        this.moveTo(this.X + diffX, this.Y + diffY);
    }
}
