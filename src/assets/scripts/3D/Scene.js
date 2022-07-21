import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
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
            clearColor: '#ffffff',
            cameraPos: new Vector3(0, 0, 1500),
            is2D: true,
            distance2D: 1500
        });

       // this.initTest();
       this.initParticles();
       DebugPane.setupRender(this.renderer);
    }

    initTest() {
        const geometry = new BoxGeometry();
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
        
        const cube = new WebGLObject(geometry, material, {
            size: new Vector3(50, 50, 50)
        });
        cube.active = true;
        this.scene.add(cube);

        DebugPane.setupObject(cube);
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