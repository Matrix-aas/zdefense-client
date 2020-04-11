import * as PIXI from "pixi.js";

import Game from "../Game";
import GUI from "./GUI";

export default class GUIManager {
    protected stage: PIXI.Container = new PIXI.Container();

    protected previousGui: GUI = null;
    protected currentGui: GUI = null;

    public init(): void {
        Game.instance.pixi().ticker.add(delta => {
            if (this.currentGui) {
                this.currentGui.tick(delta);
            }
        });
    }

    public addToStage(stage: PIXI.Container): void {
        stage.addChild(this.stage);
    }

    go(gui: GUI): void {
        this.previousGui = this.currentGui;
        this.currentGui = gui;

        if (this.currentGui) {
            this.currentGui.setGUIManager(this);
        }

        if (this.previousGui) {
            this.stage.removeChild(this.previousGui.getStage());
        }

        if (this.currentGui) {
            this.stage.addChild(this.currentGui.getStage());
            this.currentGui.init();
        }
    }
}
