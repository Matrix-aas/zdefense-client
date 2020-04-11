import Game from "./Game";

export default class Camera {
    protected X = 0;
    protected Y = 0;

    protected isPointerDown = false;
    protected pointerDownX = 0;
    protected pointerDownY = 0;

    public init(): void {
        Game.instance.pixi().stage.on('pointerdown', this.onPointerDown.bind(this));
        Game.instance.pixi().stage.on('pointermove', this.onPointerMove.bind(this));
        Game.instance.pixi().stage.on('pointerup', this.onPointerUp.bind(this));
    }

    private onPointerDown(event: PIXI.interaction.InteractionEvent): void {
        const position = event.data.getLocalPosition(Game.instance.pixi().stage);
        this.pointerDownX = position.x;
        this.pointerDownY = position.y;
        this.isPointerDown = true;
    }

    private onPointerMove(event: PIXI.interaction.InteractionEvent): void {
        if (this.isPointerDown) {
            const position = event.data.getLocalPosition(Game.instance.pixi().stage);

            const diffX = position.x - this.pointerDownX;
            const diffY = position.y - this.pointerDownY;

            this.pointerDownX = position.x;
            this.pointerDownY = position.y;

            this.move(diffX, diffY);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private onPointerUp(event: PIXI.interaction.InteractionEvent): void {
        this.isPointerDown = false;
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
