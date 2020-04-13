import GUI from "./GUI";
import * as PIXI from "pixi.js";

export default class GUIDebug extends GUI {
    protected coordinates: PIXI.Text = null;

    constructor() {
        super();
    }

    public init(): void {
        this.stage.addChild(this.coordinates = new PIXI.Text(''));
    }

    tick(delta: number): void {
        super.tick(delta);

        if (this.game.getNetworkManager().isInGame()) {
            this.coordinates.text = `${this.game.getNetworkManager().getPlayer().position.x.toFixed(1)} ; ${this.game.getNetworkManager().getPlayer().position.y.toFixed(1)} ; ${this.game.getWorld().entitiesCount()}`;
        }
    }
}
