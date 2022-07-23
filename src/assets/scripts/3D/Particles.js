import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import Perlin from '../utils/Perlin';
import { SPRITESHEET_FRAGMENT } from '../shaders/fragment';
import { IMAGE_VERTEXT, PARTICLE_VERTEXT } from '../shaders/vertex';
import { gsap, Power2 } from "gsap";
import { BoxGeometry, MeshBasicMaterial, PlaneBufferGeometry, PlaneGeometry, Vector3 } from 'three';
import WebGLObject from '../_app/cuchillo/3D/WebGLObject';
import { MeshSurfaceSampler } from './MeshSurfaceSampler';
import { Metrics } from '../_app/cuchillo/core/Metrics';
import { Interaction } from '../_app/cuchillo/core/Interaction';
import { Maths } from '../_app/cuchillo/utils/Maths';
import { GetBy } from '../_app/cuchillo/core/Element';
import SpriteSheetGenerator from '../utils/SpriteSheetGenerator';
import DebugPane from './DebugPane';
import { isDebug } from '../_app/cuchillo/core/Basics';
import { Sizes } from '../_app/cuchillo/core/Sizes';

export default class Particles {

	tick = 0;
	tickAux = 0;
	defaults = {
		spritesheetCols: 20,
		
		cursor: {
			position: {
				x:0,
				y:0
			},
			radius: Metrics.parseSize("200fpx"),
			rectangle: {
				x0: 0,
				x1: 0,
				y0: 0,
				y1: 0
			}
		},
		animation: {
			tick: 0,
			hasAnimation: true,
			finePosition: 500,
			isPixelMove: false,
			speed: 5,
			scaleHover: 2.5,
		},
		x: {
			force:119,//239,
			amplitude:511,//326,
			period: 45109,//32609,
			z_dif: 0.22,//0.033
		},
		y: {
			force:54.3,//100,
			amplitude:413,//100,
			period: 40000,
			z_dif: 0
		},
		z: {
			force:130,//210,
			amplitude:446,//10,
			period: 37500,//14674,
			z_dif: 0.152,//0.807
		},
		scale: {
			force:30,
			amplitude:174,
			period: 40000,
			z_dif: 0.163,//0.054
		},
		particles: {
			total: 8000,
			size: Metrics.parseSize("20fpx")//Metrics.parseSize("14fpx"),
		},
		pixels: {
			snap: true,
			porcentaje: 2,	
			size: Metrics.parseSize("14fpx"),
		},
		container: {
			scale: Metrics.parseSize("4.1fpx"),
			logoVisible: true,
			scaleZ: 4,
		}
	}

	logoMesh;;
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
		this.loadLogo(()=> {
			this.initPoints();
			this.initGeometry();
			
			SpriteSheetGenerator.dispose();
			DebugPane.setupParticleOptions(this.defaults, ()=> {this.reset();});
		})
	}

	loadLogo(__call) {
		console.log("LOAD")
		const loader = new OBJLoader();
		loader.load(
			'/assets/obj/logo_v02.obj',
			( object ) => {
				object.traverse((child) => {
					if (child.isMesh) {
						this.logoMesh = child;
						this.logoMesh.scale.x = this.defaults.container.scale;
						this.logoMesh.scale.y = this.defaults.container.scale;
					}
				})

				if(isDebug && false) {
					const mat = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
					this.logoMesh.material = mat					
					this.logoMesh.material.visible = this.defaults.logoVisible;

					this.container.add(this.logoMesh);
					DebugPane.setupObject(this.logoMesh, ()=> {
						this.defaults.container.scale = this.logoMesh.scale.x;
						this.reset();
					});
				}

				if(__call) __call();
			},
			function ( xhr ) {},
			function ( error ) {}
		);
	}

	reset() {
		this.dispose();
		this.initPoints();
		this.initGeometry();

		if(isDebug) {
			this.logoMesh.material.visible = this.defaults.logoVisible;
		}
	}

	initPoints() {
        //const box = new THREE.Mesh(new THREE.TorusGeometry( Metrics.HEIGHT * .3, Metrics.HEIGHT * .15, 16, 100 ));
		const sampler = new MeshSurfaceSampler(this.logoMesh).build();
	
		for (let i = 0; i < this.defaults.particles.total; i++) {
			const isPixel = Maths.maxminRandom(100, 0) <= 100 * (this.defaults.pixels.porcentaje/100) && this.defaults.pixels.porcentaje > 0;
			const position = new THREE.Vector3();
			const index = !isPixel? Maths.maxminRandom(IMAGES_PROJECTS.length, 1) : Maths.maxminRandom(IMAGES_PROJECTS.length + 2, IMAGES_PROJECTS.length + 1);
			const image = !isPixel? IMAGES_PROJECTS[index-1] : {width:1,height:1};
			const item = {
				index: index,
				fixed: false,
				movable: Math.random() > -.6,
				isPixel: isPixel,
				scaleX: image.width > image.height? 1 : image.height/image.width,
				scaleY: image.width < image.height? 1 : image.width/image.height,
				scaleMod: 1,
				scaleNoiseMod: 1,
				scaleMax: 1,
			}

			sampler.sample(position);
			position.x *= this.defaults.container.scale;
			position.y *= this.defaults.container.scale;
			position.z *= (this.defaults.container.scale * this.defaults.container.scaleZ);
						
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

		this.mesh = new THREE.InstancedMesh( this.geometry, material, this.defaults.particles.total );		
		this.mesh.instanceMatrix.setUsage( THREE.DynamicDrawUsage );

		for ( let i = 0; i < this.defaults.particles.total; i ++ ) {
			sprites.push(this.points[i].index);

			this.dummy.scale.set(this.points[i].scaleX * this.defaults.particles.size,this.points[i].scaleY * this.defaults.particles.size, 1)
			this.dummy.position.set(this.points[i].x,this.points[i].y,this.points[i].z);
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
		

		if(this.defaults.animation.hasAnimation) {
			this.tick+=.001*this.defaults.animation.speed;
			this.defaults.animation.tick = this.tick;
			this.defaults.animation.finePosition = 0;
			this.setCursorPosition();
		} else {
			this.tick = this.defaults.animation.tick + this.defaults.animation.finePosition/100;
		}

		if (this.mesh) {
			const POSITION = {x:0,y:0,z:0}
			const ROTATION = {x:0,y:0,z:0}
			const SCALE = {x:0,y:0,z:1}
			
			let speedMod = 1;
			
			for ( let i = 0; i < this.defaults.particles.total; i ++ ) {

				if(this.points[i].fixed) {
					speedMod = 1;
					this.points[i].scaleMod = Math.min(this.points[i].scaleMod+10, this.points[i].scaleMax);
					this.points[i].scaleNoiseMod = 0;//Math.max(this.points[i].scaleMod-.1, 0);
					this.points[i].fixed = false;
				} else {
					this.points[i].scaleMod = Math.max(this.points[i].scaleMod-.2, 1);
					this.points[i].scaleNoiseMod = Math.min(this.points[i].scaleNoiseMod+.01, 1);
					speedMod = 1;
				}
				
				POSITION.x = this.points[i].x + this.noise.simplex3(
					this.points[i].x/this.defaults.x.amplitude + this.defaults.x.period + this.points[i].z*this.defaults.x.z_dif,
					this.points[i].y/this.defaults.x.amplitude + this.defaults.x.period + this.points[i].z*this.defaults.x.z_dif,
					this.tick) * this.defaults.x.force;

				POSITION.y = this.points[i].y + this.noise.simplex3(
					this.points[i].x/this.defaults.y.amplitude + this.defaults.y.period + this.points[i].z*this.defaults.y.z_dif,
					this.points[i].y/this.defaults.y.amplitude + this.defaults.y.period + this.points[i].z*this.defaults.y.z_dif,
					this.tick) * this.defaults.y.force;

				POSITION.z = this.points[i].z + this.noise.simplex3(
					this.points[i].x/this.defaults.z.amplitude + this.defaults.z.period + this.points[i].z*this.defaults.z.z_dif,
					this.points[i].y/this.defaults.z.amplitude + this.defaults.z.period + this.points[i].z*this.defaults.z.z_dif,
					this.tick) * this.defaults.z.force;

				//y = this.points[i].y + this.noise.simplex3(this.points[i].x/100 + 40000, this.points[i].y/100 + 40000, this.tick) * this.defaults.forces.y;
				//z = this.points[i].z + this.noise.simplex3(this.points[i].x/10 + 4000, this.points[i].y/10 + 4000, this.tick) * this.defaults.forces.z;

				if(this.points[i].isPixel && this.defaults.pixels.snap) {
					SCALE.x = this.defaults.pixels.size;
					SCALE.y = this.defaults.pixels.size;
					POSITION.z = 0;
				} else {
					const tempScale = this.noise.simplex3(
						this.points[i].x/this.defaults.scale.amplitude + this.defaults.scale.period,
						this.points[i].y/this.defaults.scale.amplitude + this.defaults.scale.period,
						this.tick * speedMod) * (this.defaults.scale.force * this.points[i].scaleNoiseMod);

					SCALE.x = (this.points[i].scaleX * this.defaults.particles.size + tempScale) * this.points[i].scaleMod;
					SCALE.y = (this.points[i].scaleY * this.defaults.particles.size + tempScale) * this.points[i].scaleMod;
				}

				if(this.defaults.animation.isPixelMove || (this.points[i].isPixel && this.defaults.pixels.snap)) {
					POSITION.x = Math.floor(POSITION.x/Metrics.GRIDSUB) * Metrics.GRIDSUB;
					POSITION.y = Math.floor(POSITION.y/Metrics.GRIDSUB) * Metrics.GRIDSUB;
				} else if(this.defaults.animation.hasAnimation){
					this.checkCursorDistance(POSITION, this.points[i], SCALE, ROTATION, this.dummy);
				}
				
				
				
				this.dummy.scale.set(SCALE.x,SCALE.y,SCALE.z)
				this.dummy.position.set(POSITION.x,POSITION.y,POSITION.z);
				this.dummy.updateMatrix();
				
				this.mesh.setMatrixAt(i, this.dummy.matrix );
			}
			
			this.mesh.instanceMatrix.needsUpdate = true;
		}
	}

	setCursorPosition() {
		this.defaults.cursor.position = Maths.point2Dto3D(
			{
				x: Interaction.positions.mouse.x,
				y: Interaction.positions.mouse.y
			},
			Metrics.WIDTH,
			Metrics.HEIGHT
		);

		const p0 = {
			x: this.defaults.cursor.position.x - this.defaults.cursor.radius,
			y: this.defaults.cursor.position.y - this.defaults.cursor.radius
		}
		const p1 = {
			x: this.defaults.cursor.position.x + this.defaults.cursor.radius,
			y: this.defaults.cursor.position.y + this.defaults.cursor.radius
		}

		this.defaults.cursor.rectangle = {
			x0: p0.x,
			x1: p1.x,
			y0: p0.y,
			y1: p1.y,
		}
	}

	checkCursorDistance(__position, __particle, __scale, __rotation, dummy) {
		
		const mod = (__position.z * 0);
		const p1 = {
			x: __position.x + mod,
			y: __position.y + mod,
			z: __position.z
		}
		const p2 = {
			x: __particle.x + mod,
			y: __particle.y + mod,
			z: __particle.z
		}
		let p=null;

		if(Maths.isInsideRectagle(p1, this.defaults.cursor.rectangle) && __particle.movable) {
			p = p1;
		}

		if(p) {
			const norm = Maths.normalize(200, 0, Maths.lineDistance(p, this.defaults.cursor.position) - 100);
			const distance = Maths.lineDistance(p, this.defaults.cursor.position);
			
			if(distance < 150 && distance > 100) {
				//__scale.x =  __particle.scaleX * this.defaults.particles.size * 6
				// __scale.y =  __particle.scaleY * this.defaults.particles.size * 6;
				__position.z = 0;
				__particle.fixed = true;
				__particle.scaleMax = this.defaults.animation.scaleHover;
				

				

			} else if(Maths.lineDistance(p, this.defaults.cursor.position) < 100) {
				
				//__position.z = 0;
			}
			
			/*__scale.x = __particle.scaleX * this.defaults.particles.size * distance;
			__scale.y = __particle.scaleY * this.defaults.particles.size * distance;*/
			__scale.z = 1;
		} else {
			dummy.rotation.set(0,0,0);
			__rotation.y = 0;
			__rotation.z = 0;
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
