export const PARTICLE_VERTEXT = `
    attribute float size;
    attribute float alpha;
    uniform sampler2D pointTexture;
    uniform sampler2D pointTexture2;
    varying vec3 vColor;
    varying float vTextIndex;

    void main() {
        vColor = color;
        vTextIndex = alpha;
        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
        gl_PointSize = size * ( 300.0 / -mvPosition.z );
        gl_Position = projectionMatrix * mvPosition;
    }
`;