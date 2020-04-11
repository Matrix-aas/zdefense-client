import * as PIXI from "pixi.js";
import World from "./World";
import Game from "../Game";
import Resources from "../Helpers/Resources";

export default class WorldClient extends World {
    protected stage: PIXI.Container = new PIXI.Container;
    protected groundStage: PIXI.Container = new PIXI.Container;
    protected worldStage: PIXI.Container = new PIXI.Container;

    protected spriteGround: PIXI.TilingSprite;

    public init(): void {
        Game.instance.on('window.resize', () => {
            this.spriteGround.width = Game.instance.pixi().screen.width;
            this.spriteGround.height = Game.instance.pixi().screen.height;
        });

        Game.instance.on('camera.move', (x: number, y: number) => {
            this.spriteGround.tilePosition.x = x;
            this.spriteGround.tilePosition.y = y;

            this.worldStage.position.x = x;
            this.worldStage.position.y = y;
        });

        this.initGround();

        Game.instance.pixi().ticker.add(delta => {
            this.entities.forEach(entity => {
                if (!entity.isDied()) {
                    entity.tick(delta);
                } else {
                    this.removeEntity(entity);
                }
            });
        });
    }

    protected initGround(): void {
        this.spriteGround = new PIXI.TilingSprite(Resources.texture(Resources.WORLD.GRASS));
        this.spriteGround.tint = 0x00FF00;
        this.spriteGround.width = Game.instance.pixi().screen.width;
        this.spriteGround.height = Game.instance.pixi().screen.height;
        this.groundStage.addChild(this.spriteGround);
    }

    public addToStage(stage: PIXI.Container): void {
        stage.addChild(this.groundStage);
        stage.addChild(this.worldStage);
    }
}
