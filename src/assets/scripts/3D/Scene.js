import { PlaneGeometry, Vector3 } from 'three';
import { BoxGeometry, MeshBasicMaterial, Mesh } from 'three';
import WebGLObject from '../_app/cuchillo/3D/WebGLObject';
import WebGLSketch from "../_app/cuchillo/3D/WebGLSketch";
import { Metrics } from '../_app/cuchillo/core/Metrics';
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
        const geometry = new PlaneGeometry();
        const material = new MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new WebGLObject(geometry, material, {
            size: new Vector3(400, 400, 400)
        });
        cube.active = true;
        this.scene.add(cube);
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