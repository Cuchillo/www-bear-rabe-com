export const PARTICLE_FRAGMENT = `
    uniform sampler2D pointTexture;
    uniform sampler2D pointTexture2;
    varying vec3 vColor;
    varying float vTextIndex;

    struct Sprites {
        sampler2D text;
    };

    uniform Sprites sprite[2];

    void main() {
        gl_FragColor = vec4( vColor, 1.0 );

       
        if(vTextIndex == 1.0) {
            gl_FragColor = gl_FragColor * texture2D( pointTexture, gl_PointCoord );
        } else {
            gl_FragColor = gl_FragColor * texture2D( pointTexture2, gl_PointCoord );
        }
    }
`;

export const SPRITESHEET_FRAGMENT = `
    uniform sampler2D texture1;
    
    uniform float cols;
    uniform float sprite;
    uniform float offsetPosition;
    uniform float offsetSprite;
    uniform float progress;
    uniform float opacity;
    uniform float burn;

    varying vec2 vUv;
    varying float vSprite;
    
    void main() {
        float nTile = vSprite - 1.0;
        vec2 vCenter = vec2((mod(nTile,cols) * offsetPosition), 1.0 - floor(nTile/cols) * offsetPosition);

        vec2 newUVScale = (vUv - vCenter) * offsetSprite + vCenter;
        vec4 color = texture2D(texture1,newUVScale);
        gl_FragColor = vec4(color.rgb * burn, color.a * opacity);
    }
`;

export const TEXT_FRAGMENT = `
    uniform float blur;
    uniform float opacity;
    uniform sampler2D texture1;
    uniform vec2 resolution;
    float scaleCenter = 0.5;

    varying vec2 vUv;

    // GAUSSIAN BLUR SETTINGS
    float directions = 16.0; // BLUR DIRECTIONS (Default 16.0 - More is better but slower)
    float quality = 3.0; // BLUR QUALITY (Default 4.0 - More is better but slower)
    float size = 8.0; // BLUR SIZE (Radius)
    // GAUSSIAN BLUR SETTINGS

    vec4 Blur2D(sampler2D image, vec2 uv) {
        vec4 color = vec4(0.0);

        color += texture2D(image, vec2(uv.x - 4.0 * blur, uv.y)) * 0.051;
        color += texture2D(image, vec2(uv.x - 3.0 * blur, uv.y)) * 0.0918;
        color += texture2D(image, vec2(uv.x - 2.0 * blur, uv.y)) * 0.12245;
        color += texture2D(image, vec2(uv.x - 1.0 * blur, uv.y)) * 0.1531;
        color += texture2D(image, vec2(uv.x, uv.y)) * 0.1633;
        color += texture2D(image, vec2(uv.x + 1.0 * blur, uv.y)) * 0.1531;
        color += texture2D(image, vec2(uv.x + 2.0 * blur, uv.y)) * 0.12245;
        color += texture2D(image, vec2(uv.x + 3.0 * blur, uv.y)) * 0.0918;
        color += texture2D(image, vec2(uv.x + 4.0 * blur, uv.y)) * 0.051;

        return color;
    }

    void main() {
        vec2 newUV = (vUv - vec2(scaleCenter)) * resolution.xy + vec2(scaleCenter);
        vec4 color = Blur2D(texture1, newUV);

        gl_FragColor = vec4(color.rgb, color.a * opacity);
    }
`;