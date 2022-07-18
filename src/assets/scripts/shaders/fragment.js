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