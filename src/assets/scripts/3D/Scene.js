import { PlaneGeometry, Vector3 } from 'three';
import { BoxGeometry, MeshBasicMaterial, Mesh } from 'three';
import WebGLObject from '../_app/cuchillo/3D/WebGLObject';
import WebGLSketch from "../_app/cuchillo/3D/WebGLSketch";
import { Metrics } from '../_app/cuchillo/core/Metrics';

export default class Scene extends WebGLSketch {
    cube; 

    constructor () {
        super({
            container: 'SceneParticles',
            clearColor: '#FFFFFF',
            cameraPos: new Vector3(0, 0, 1500),
            is2D: true,
            distance2D: 1500
        });

        const size = 400;

        const geometry = new PlaneGeometry();
        const material = new MeshBasicMaterial({ color: 0x00ff00 });
        this.cube = new WebGLObject(geometry, material, {
            size: new Vector3(400, 400, 400)
        });
        this.cube.active = true;

        this.scene.add(this.cube);
    }

    update () {
                
        /*const rot = {
            x: this.cube.rotation.x += .002,
            y: this.cube.rotation.y += .002,
            z: 0
        }*/
       // this.cube.rot = rot;
    }

    resize () {
        super.resize();
    }
}