import * as PIXI from 'pixi.js'

const resourcesFolder = 'resources';

let _loader: PIXI.Loader = null;

export default {
    WORLD: {
        GRASS: 'grass.png',
        PLAYER: 'player.png',
        ZOMBIE: 'zombie.png',
    },

    addAllToLoader(loader: PIXI.Loader, o: {} = null): void {
        if (!o) {
            _loader = loader;
            return this.addAllToLoader(loader, this);
        }
        Object.entries(o).forEach(entry => {
            if (typeof entry[1] === 'string') {
                loader.add(`${resourcesFolder}/${entry[1]}`);
            } else if (typeof entry[1] === 'object') {
                this.addAllToLoader(loader, entry[1]);
            }
        });
    },

    texture(texture: string): PIXI.Texture {
        if (_loader) {
            return _loader.resources[`${resourcesFolder}/${texture}`].texture;
        }
        return null;
    }
};
