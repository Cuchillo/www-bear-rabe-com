import * as THREE from 'three';
import { PlaneGeometry, Vector3 } from 'three';
import { BoxGeometry, MeshBasicMaterial, Mesh } from 'three';
import { SPRITESHEET_FRAGMENT } from '../shaders/fragment';
import { IMAGE_VERTEXT } from '../shaders/vertex';
import SpriteSheetGenerator from '../utils/SpriteSheetGenerator';
import WebGLObject from '../_app/cuchillo/3D/WebGLObject';
import WebGLSketch from "../_app/cuchillo/3D/WebGLSketch";
import { Metrics } from '../_app/cuchillo/core/Metrics';
import DebugPane from './DebugPane';
import Particles from './Particles';

export default class Scene extends WebGLSketch {
    constructor () {
        super({
            container: 'SceneParticles',
            clearColor: '#FFFFFF',
            cameraPos: new Vector3(0, 0, 1500),
            is2D: true,
            distance2D: 1500
        });

        //this.initTest();
        this.initParticles();
    }

    initTest() {
        const cols = 10;
        const uniforms = {
            sprite: { type: 'f', value:1.0 },
            cols: { type: 'f', value:cols },
            offsetSprite: { type: 'f', value:1/cols },
            offsetPosition: { type: 'f', value:1/(cols-1) },

            texture1: { type: 't', value: SpriteSheetGenerator.texture },
            progress: { type: 'f', value: .1 },
            scaleCenter: { type: 'v2',value: { x:0, y:1}},
            alpha: { type: 'f', value: 1.0 },
            burn: { type: 'f', value: 1.0 },
            aspectRatio: { type: 'f', value: 1.0 },
            opacity: { type: 'f', value: 1.0 },
            resolution: {
              type: 'v2',
              value: { x:1, y:1, z:1, w:1 }
            }
          };

        const geometry = new PlaneGeometry();
        const material = new THREE.ShaderMaterial({
            uniforms,
            fragmentShader: SPRITESHEET_FRAGMENT,
            vertexShader: IMAGE_VERTEXT,
            transparent: true
          });
        
        const cube = new WebGLObject(geometry, material, {
            size: new Vector3(50, 50, 50)
        });
        cube.active = true;
        this.scene.add(cube);

        DebugPane.uniforms_image = material.uniforms;
        DebugPane.init();
    }

    initParticles() {
        this.particles = new Particles(this);
		this.scene.add(this.particles.container);
        this.particles.init("/assets/images/logo-sample.jpg");
    }

    update () {
        this.particles.update(this.tick);
    }

    resize () {
        super.resize();
    }
}