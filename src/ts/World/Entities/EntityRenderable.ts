import * as PIXI from 'pixi.js';
import Entity from "./Entity";
import {ColorOverlayFilter} from "../../Filters/ColorBlendFilter";
import World from "../World";

const GREEN_FILTER = new ColorOverlayFilter(0, 255, 0, 255);
const RED_FILTER = new ColorOverlayFilter(255, 0, 0, 255);

interface FilterAnimation {
    ttl: number;
    step: number;
    filter: PIXI.Filter;
}

export default abstract class EntityRenderable extends Entity {
    public readonly stage: PIXI.Container = new PIXI.Container();
    protected mainSprite: PIXI.Sprite = null;
    private _filterAnimation: FilterAnimation = null;

    constructor() {
        super();
        this.subscribeEvent('heal', () => {
            this.filterAnimation = {
                filter: GREEN_FILTER,
                step: 5,
                ttl: 20
            };
        });

        this.subscribeEvent('damage', () => {
            this.filterAnimation = {
                filter: RED_FILTER,
                step: 5,
                ttl: 20
            };
        });
    }

    init(id: number, world: World): void {
        super.init(id, world);
        this.stage.pivot.set(this.size.x / 2, this.size.y / 2);
    }

    public tick(delta: number): void {
        super.tick(delta);

        if (this.mainSprite && this.filterAnimation) {
            if (this.filterAnimation.ttl > 0) {
                if (this.filterAnimation.ttl-- % this.filterAnimation.step === 0) {
                    if (!this.mainSprite.filters) {
                        this.mainSprite.filters = [];
                    }
                    if (!this.mainSprite.filters.includes(this.filterAnimation.filter)) {
                        this.mainSprite.filters.push(this.filterAnimation.filter);
                    } else {
                        const index = this.mainSprite.filters.findIndex(filter => filter === this.filterAnimation.filter);
                        if (index > -1) {
                            this.mainSprite.filters.splice(index);
                        }
                    }
                }
            } else {
                this.filterAnimation = null;
            }
        }
    }

    public get filterAnimation(): FilterAnimation {
        return this._filterAnimation;
    }

    public set filterAnimation(filterAnimation) {
        if (this._filterAnimation && this.mainSprite && this.mainSprite.filters) {
            const index = this.mainSprite.filters.findIndex(filter => filter === this._filterAnimation.filter);
            if (index > -1) {
                this.mainSprite.filters.splice(index);
            }
        }
        this._filterAnimation = filterAnimation;
    }
}
