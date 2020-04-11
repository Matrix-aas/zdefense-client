import fragment from './colorOverlay.frag';

import * as PIXI from 'pixi.js';

class ColorOverlayFilter extends PIXI.Filter {
    constructor(r: number, g: number, b: number, a: number) {
        super(PIXI.defaultFilterVertex, fragment);
        this.uniforms.color = new Float32Array(4);
        this.uniforms.color[0] = r / 255;
        this.uniforms.color[1] = g / 255;
        this.uniforms.color[2] = b / 255;
        this.uniforms.color[3] = a / 255;
    }
}

export {ColorOverlayFilter};
