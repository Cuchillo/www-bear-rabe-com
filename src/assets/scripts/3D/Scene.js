import { Vector3 } from 'three';
import WebGLSketch from "../_app/cuchillo/3D/WebGLSketch";
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
    }

    init() {
        this.initParticles();
        DebugPane.setupRender(this.renderer);
    }

    showParticles() {
        this.particles.show();
    }

    initParticles() {
        this.particles = new Particles(this);
		this.scene.add(this.particles.container);
        this.particles.init();
    }

    update () {
        if(this.tick%2===0)this.particles.update(this.tick);
    }

    resize () {
        super.resize();
    }
}