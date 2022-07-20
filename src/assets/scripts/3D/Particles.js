import * as THREE from 'three';
import Perlin from '../utils/Perlin';
import { SPRITESHEET_FRAGMENT } from '../shaders/fragment';
import { IMAGE_VERTEXT, PARTICLE_VERTEXT } from '../shaders/vertex';
import { gsap, Power2 } from "gsap";
import { BoxGeometry, MeshBasicMaterial, PlaneBufferGeometry, PlaneGeometry, Vector3 } from 'three';
import WebGLObject from '../_app/cuchillo/3D/WebGLObject';
import { MeshSurfaceSampler } from './MeshSurfaceSampler';
import { Metrics } from '../_app/cuchillo/core/Metrics';
import { Maths } from '../_app/cuchillo/utils/Maths';
import { GetBy } from '../_app/cuchillo/core/Element';
import SpriteSheetGenerator from '../utils/SpriteSheetGenerator';
import DebugPane from './DebugPane';

export default class Particles {

	tick = 0;
	defaults = {
		total: 1000,
		particleSize: Metrics.parseSize("20fpx"),
		spritesheetCols: 10
	}
	mesh;	
	points = [];
	noise = new Perlin(Math.random());
	dummy = new THREE.Object3D();
	geometry = new PlaneBufferGeometry(1,1);
		
	constructor(webgl) {
		this.webgl = webgl;
		this.container = new THREE.Object3D();
	}

	init() {
		this.initPoints();
		this.initGeometry();
		
		SpriteSheetGenerator.dispose();

		DebugPane.setupParticleOptions(this.defaults, ()=> {this.reset();});
	}

	reset() {
		this.dispose();
		this.initPoints();
		this.initGeometry();
	}

	initPoints() {
        const box = new THREE.Mesh(new THREE.TorusGeometry( Metrics.HEIGHT * .3, Metrics.HEIGHT * .15, 16, 100 ));
		box.position.z = -100;
        const sampler = new MeshSurfaceSampler(box).build();
	
		for (let i = 0; i < this.defaults.total; i++) {
			const position = new THREE.Vector3();
			const index = Maths.maxminRandom(IMAGES_PROJECTS.length, 1);
			const image = IMAGES_PROJECTS[index-1];
			const item = {
				index: index,
				scaleX: image.width > image.height? 1 : image.height/image.width,
				scaleY: image.width < image.height? 1 : image.width/image.height
			}

			sampler.sample(position);
						
			this.points.push({
					...item,
					...position
				});
		}
	}

	initGeometry() {
		/* MATERIAL */
		const uniforms = {
			texture1: { type: 't', value: SpriteSheetGenerator.texture },
			sprite: { type: 'f', value: 1.0 },
            cols: { type: 'f', value: this.defaults.spritesheetCols },
            offsetSprite: { type: 'f', value: 1/this.defaults.spritesheetCols },
            offsetPosition: { type: 'f', value: 1/(this.defaults.spritesheetCols-1) },
           	burn: { type: 'f', value: 1.0 },
           	opacity: { type: 'f', value: 1.0 }
          };

        const material = new THREE.ShaderMaterial({
            uniforms,
            fragmentShader: SPRITESHEET_FRAGMENT,
            vertexShader: IMAGE_VERTEXT,
            depthTest: false,
			transparent: false,
          });

		/* MESH */  
		const sprites = [];

		  

		this.mesh = new THREE.InstancedMesh( this.geometry, material, this.defaults.total );		
		this.mesh.instanceMatrix.setUsage( THREE.DynamicDrawUsage );

		for ( let i = 0; i < this.defaults.total; i ++ ) {
			sprites.push(this.points[i].index);

			this.dummy.scale.set(this.points[i].scaleX * this.defaults.particleSize,this.points[i].scaleY * this.defaults.particleSize, 1)
			this.dummy.position.set(this.points[i].x,this.points[i].y,0);
			this.dummy.updateMatrix();
			
			this.mesh.setMatrixAt(i, this.dummy.matrix );

		}
		
		this.mesh.geometry.setAttribute('nSprite', new THREE.InstancedBufferAttribute(new Float32Array(sprites), 1, false));
		this.mesh.instanceMatrix.needsUpdate = true;

		this.container.add( this.mesh );				
	}
	
	// ---------------------------------------------------------------------------------------------
	// PUBLIC
	// ---------------------------------------------------------------------------------------------

	update(delta) {
		this.tick+=.01;

		if ( this.mesh ) {
			const sprites = [];
			let x = 0;
			let y = 0;
			
			for ( let i = 0; i < this.defaults.total; i ++ ) {

				x = this.points[i].x + (this.noise.simplex3(this.points[i].x/50, this.points[i].z/50, this.tick) * Math.PI * 2)*10;
				y = this.points[i].y + (this.noise.simplex3(this.points[i].x/100 + 40000, this.points[i].z/100 + 40000, this.tick))*10;

				this.dummy.scale.set(this.points[i].scaleX * this.defaults.particleSize, this.points[i].scaleY * this.defaults.particleSize, 1)
				this.dummy.position.set(x,y,this.points[i].z);
				this.dummy.updateMatrix();
				
				this.mesh.setMatrixAt(i, this.dummy.matrix );
			}
			
			this.mesh.instanceMatrix.needsUpdate = true;
		}
	}

	show() {}
	hide() {}
	dispose() {
		if (!this.mesh) return;

		this.mesh.parent.remove(this.mesh);
		this.mesh.geometry.dispose();
		this.mesh.material.dispose();
		this.mesh = null;

		this.points = [];
	}

	resize() {
		/*if (!this.object3D) return;

		const scale = this.webgl.fovHeight / this.height;
		this.object3D.scale.set(scale, scale, 1);
		this.hitArea.scale.set(scale, scale, 1);*/
	}
}
