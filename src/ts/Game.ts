import * as PIXI from 'pixi.js';
import Resources from "./Helpers/Resources";
import Camera from "./Camera";
import GUIManager from "./GUI/GUIManager";
import GUIDebug from "./GUI/GUIDebug";
import {EventEmitter2, Listener as EventEmitterListener} from 'eventemitter2';
import WorldClient from "./World/WorldClient";
import NetworkManager from "./Network/NetworkManager";
import EntityPlayerMP from "./World/Entities/Livings/EntityPlayerMP";
import Point from "./Helpers/Point";
import Packet6MoveEntity from "./Network/Packets/Packet6MoveEntity";

PIXI.utils.skipHello();

let _instance: Game = null;

export default class Game {
    private eventBus: EventEmitter2 = null;

    private pixiApp: PIXI.Application = null;

    private camera: Camera = null;
    private world: WorldClient = null;
    private guiManager: GUIManager = null;
    private networkManager: NetworkManager = null;

    protected isPointerDown = false;
    protected pointerPosition: Point = new Point();

    protected keyStates: Map<string, boolean> = new Map<string, boolean>();

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

    public getNetworkManager(): NetworkManager {
        return this.networkManager;
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

        window.addEventListener('keydown', (e) => {
            this.keyStates.set(e.key, true);
        });

        window.addEventListener('keyup', (e) => {
            this.keyStates.set(e.key, false);
        });

        Resources.addAllToLoader(this.pixiApp.loader);

        this.pixiApp.loader.load(this.onLoaded.bind(this));
    }

    public isKeyDown(key: string): boolean {
        return this.keyStates.has(key) && this.keyStates.get(key);
    }

    private onLoaded(): void {
        this.camera.init();
        this.world.init();
        this.guiManager.init();

        this.pixiApp.stage.on('pointerdown', this.onPointerDown.bind(this));
        this.pixiApp.stage.on('pointermove', this.onPointerMove.bind(this));
        this.pixiApp.stage.on('pointerup', this.onPointerUp.bind(this));

        this.world.addToStage(this.pixiApp.stage);
        this.guiManager.addToStage(this.pixiApp.stage);

        this.pixiApp.ticker.add(async delta => {
            await this.networkManager.networkTick();

            if (this.world) {
                this.processPlayerMove();

                this.world.tick(delta);
            }
        });

        // TODO: Debug
        this.guiManager.go(new GUIDebug());
    }

    private onPointerDown(event: PIXI.interaction.InteractionEvent): void {
        const position = event.data.getLocalPosition(this.pixiApp.stage);
        this.pointerPosition.set(position.x, position.y);
        this.isPointerDown = true;
    }

    private onPointerMove(event: PIXI.interaction.InteractionEvent): void {
        const position = event.data.getLocalPosition(this.pixiApp.stage);
        this.pointerPosition.set(position.x, position.y);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private onPointerUp(event: PIXI.interaction.InteractionEvent): void {
        this.isPointerDown = false;
    }

    private processPlayerMove(): void {
        if (!this.networkManager.isInGame())
            return;

        const player: EntityPlayerMP = this.networkManager.getPlayer();
        if (player != null) {
            player.setHeadAngle(player.position.angle(this.pointerPosition.clone().sub(this.camera.getX(), this.camera.getY())));
            let moving = false;
            let summAngle = 0.0;
            if (this.isKeyDown('w')) {
                summAngle = 270.0;
                if (this.isKeyDown('d'))
                    summAngle += 45.0;
                else if (this.isKeyDown('a'))
                    summAngle -= 45.0;
                moving = true;
            } else if (this.isKeyDown('s')) {
                summAngle = 90.0;
                if (this.isKeyDown('a'))
                    summAngle += 45.0;
                else if (this.isKeyDown('d'))
                    summAngle -= 45.0;
                moving = true;
            } else if (this.isKeyDown('a')) {
                summAngle = 180.0;
                if (this.isKeyDown('w'))
                    summAngle += 45.0;
                else if (this.isKeyDown('s'))
                    summAngle -= 45.0;
                moving = true;
            } else if (this.isKeyDown('d')) {
                summAngle = 0.0;
                if (this.isKeyDown('s'))
                    summAngle += 45.0;
                else if (this.isKeyDown('w'))
                    summAngle -= 45.0;
                moving = true;
            }

            if (moving) {
                player.setMoveAngle(summAngle);
                if (!player.isMoving())
                    player.move();
            } else if (player.isMoving()) {
                player.stop();
            }

            const packetMove = new Packet6MoveEntity();
            packetMove.push(player);
            this.networkManager.getNetworkHandler().addPacketToQueue(packetMove);

            this.camera.moveTo(player.positionCenter.x * -1 + this.pixiApp.screen.width / 2, player.positionCenter.y * -1 + this.pixiApp.screen.height / 2);
        }
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
