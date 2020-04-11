import * as PIXI from 'pixi.js';
import Resources from "./Helpers/Resources";
import Camera from "./Camera";
import GUIManager from "./GUI/GUIManager";
import GUIDebug from "./GUI/GUIDebug";
import {EventEmitter2, Listener as EventEmitterListener} from 'eventemitter2';
import WorldClient from "./World/WorldClient";
import NetworkManager from "./Network/NetworkManager";

PIXI.utils.skipHello();

let _instance: Game = null;

export default class Game {
    private eventBus: EventEmitter2 = null;

    private pixiApp: PIXI.Application = null;

    private camera: Camera = null;
    private world: WorldClient = null;
    private guiManager: GUIManager = null;
    private networkManager: NetworkManager = null;

    constructor() {
        this.eventBus = new EventEmitter2({
            wildcard: true,
            delimiter: '.',
            newListener: true,
            maxListeners: 20,
            verboseMemoryLeak: false
        });

        this.pixiApp = new PIXI.Application({
            width: window.innerWidth,
            height: window.innerHeight,
        });

        this.pixiApp.ticker.maxFPS = 60;

        this.camera = new Camera();
        this.world = new WorldClient();
        this.guiManager = new GUIManager();
        this.networkManager = new NetworkManager();
    }

    public pixi(): PIXI.Application {
        return this.pixiApp;
    }

    public getWorld(): WorldClient {
        return this.world;
    }

    public getCamera(): Camera {
        return this.camera;
    }

    public getGuiManager(): GUIManager {
        return this.guiManager;
    }

    public init(): void {
        document.body.appendChild(this.pixiApp.view);

        this.pixiApp.stage.interactive = true;

        window.addEventListener('resize', () => {
            this.pixiApp.renderer.resize(window.innerWidth, window.innerHeight);
            this.emit('window.resize', window.innerWidth, window.innerHeight);
        });

        Resources.addAllToLoader(this.pixiApp.loader);

        this.pixiApp.loader.load(this.onLoaded.bind(this));
    }

    private onLoaded(): void {
        this.camera.init();
        this.world.init();
        this.guiManager.init();

        this.world.addToStage(this.pixiApp.stage);
        this.guiManager.addToStage(this.pixiApp.stage);

        Game.instance.pixi().ticker.add(async delta => {
            await this.networkManager.networkTick();
        });

        // TODO: Debug
        this.guiManager.go(new GUIDebug());
    }

    public on(event: string | string[], listener: EventEmitterListener): void {
        this.eventBus.on(event, listener);
    }

    public emit(event: string | string[], ...values: any[]): void {
        this.eventBus.emit(event, ...values);
    }

    public static get instance(): Game {
        if (!_instance) {
            _instance = new Game();
        }
        return _instance;
    }
}
