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

export const IMAGE_VERTEXT = `
    attribute float nSprite;
    attribute float nAlpha;

    varying vec2 vUv;
    varying float vSprite;
    
    void main() {
        vSprite = nSprite;
       
        vec3 transformed = vec3(position);
        vec4 mvPosition = vec4(transformed, 1.0);
        
        #ifdef USE_INSTANCING
            mvPosition = instanceMatrix * mvPosition;
        #endif
        
        vec4 modelViewPosition = modelViewMatrix * mvPosition;
        vUv = uv;
        gl_Position = projectionMatrix * modelViewPosition;
    }
`;

export const TEXT_VERTEX = `
    #define PI 3.1415926538

    varying vec2 vUv;

    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;