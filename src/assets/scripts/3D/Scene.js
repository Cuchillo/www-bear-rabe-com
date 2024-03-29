import { Vector3 } from 'three';
import WebGLSketch from "../_app/cuchillo/3D/WebGLSketch";
import Particles from './Particles';
import { gsap, Power2 } from "gsap";

export default class Scene extends WebGLSketch {
    is404 = false;

    constructor () {
        super({
            container: 'SceneParticles',
            clearColor: '#ffffff',
            cameraPos: new Vector3(0, 0, 1500),
            is2D: true,
            distance2D: 1500
        });
    }

    init(__is404 = false) {
        this.is404 = __is404;
        this.initParticles();
    }

    showParticles() {
        this.particles.show();
    }

    initParticles() {
        this.particles = new Particles(this, this.is404);
		this.scene.add(this.particles.container);
        this.particles.init();
    }

    update () {
        if(this.tick%2===0)this.particles.update(this.tick);
    }

    show(){
        this.resume();
        gsap.to(this.container,{alpha:1, duration:.2, ease:Power2.easeOut});
    }
    hide(){
        gsap.to(this.container,{alpha:0, duration:.2, ease:Power2.easeOut, onComplete:()=> {
            this.pause();
        }});
    }

    resize () {
        if(this.particles) this.particles.resize();
        super.resize();
    }
}