import * as PIXI from "pixi.js";
import GUIManager from "./GUIManager";
import Game from "../Game";

export default abstract class GUI {
    protected stage: PIXI.Container = null;
    protected guiManager: GUIManager = null;

    constructor() {
        this.stage = new PIXI.Container();
    }

    public abstract init(): void;

    public getStage(): PIXI.Container {
        return this.stage;
    }

    public setGUIManager(guiManager: GUIManager): void {
        this.guiManager = guiManager;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public tick(delta: number): void {
        //
    }

    protected get game(): Game {
        return Game.instance;
    }
}
