varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform vec4 color;

void main(void) {
    vec4 currentColor = texture2D(uSampler, vTextureCoord);
    gl_FragColor = currentColor * color;
}
