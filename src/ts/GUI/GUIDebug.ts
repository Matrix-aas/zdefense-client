import GUI from "./GUI";
import * as PIXI from "pixi.js";

export default class GUIDebug extends GUI {
    protected coordinates: PIXI.Text = null;

    constructor() {
        super();
    }

    public init(): void {
        this.stage.addChild(this.coordinates = new PIXI.Text('0 ; 0'));
    }

    tick(delta: number): void {
        super.tick(delta);

        this.coordinates.text = `${this.game.getCamera().getX()} ; ${this.game.getCamera().getY()} ; ${this.game.getWorld().entitiesCount()}`;
    }
}
