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
			gridSize: Metrics.GRIDSUB,
			speed: 0.008,
			scaleHover: 3,
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
			force:19,
			amplitude:174,
			period: 40000,
			z_dif: 0.163,//0.054
		},
		particles: {
			total: 8000,
			size: Metrics.parseSize("35fpx")//Metrics.parseSize("14fpx"),
		},
		pixels: {
			snap: true,
			porcentaje: 2,	
			size: Metrics.parseSize("14fpx"),
		},
		container: {
			scale: Metrics.parseSize("5.05fpx"),//Metrics.parseSize("4.4fpx"),
			logoVisible: true,
			scaleZ: 10,
		}
	}

	logoMesh;
	mesh;	
	points = [];
	noise = new Perlin(Math.random());
	dummy = new THREE.Object3D();
	geometry = new PlaneBufferGeometry(1,1);
	_is404 = false;
	objUrl;
	
	get is404() { return this._is404; }
	set is404(__bol) {
		this._is404 = __bol;
		this.objUrl = !this.is404? '/assets/obj/logo_v02.obj' : '/assets/obj/logo-404.obj';
	}

	constructor(webgl, is404 = false) {
		this.webgl = webgl;
		this.is404 = is404;
		this.container = new THREE.Object3D();

		this.setupOptions();
	}

	setupOptions() {
		if(this.is404) {
			this.defaults.container.scaleZ = 0;
			this.defaults.container.scale = Metrics.parseSize("4fpx");
			this.defaults.x.force = 60;
			this.defaults.y.force = 32;
			this.defaults.z.force = 54;
			this.defaults.pixels.porcentaje = 0;
			this.defaults.scale.force = 28;
			this.defaults.particles.size = Metrics.parseSize("10fpx")//Metrics.parseSize("14fpx"),
		}
	}

	init() {
		this.loadLogo(()=> {
			this.initPoints();
			this.setupPoints();
			this.initGeometry();
						
			//SpriteSheetGenerator.dispose();
			if(this.is404 || isDebug) {
				this.defaults.container.scaleZ = 0;
				DebugPane.init(this);
			} else {
				this.randomValues();
			}
		})
	}

	loadLogo(__call) {
		console.log("LOAD")
		const loader = new OBJLoader();
		loader.load(
			this.objUrl,
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
		this.setupPoints();
		this.initGeometry();

		if(isDebug) {
			this.logoMesh.material.visible = this.defaults.logoVisible;
		}
	}

	initPoints() {
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
				scaleX: image.width > image.height? 1 : image.width/image.height,
				scaleY: image.width < image.height? 1 : image.height/image.width,
				scaleMod: 1,
				scaleNoiseMod: 1,
				scaleMax: 1,
			}

			sampler.sample(position);
						
			this.points.push({
					...item,
					...position
				});
		}
	}

	setupPoints() {
		for (let i = 0; i < this.defaults.particles.total; i++) {
			this.points[i].x *= this.defaults.container.scale;
			this.points[i].y *= this.defaults.container.scale;
			this.points[i].z *= (this.defaults.container.scale * this.defaults.container.scaleZ);
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

	randomValues() {
		if(this.is404) return;

		gsap.to(this.defaults.x, {
			force: Maths.maxminRandom(150, 100),
			amplitude: Maths.maxminRandom(530, 400),
			//period: Maths.maxminRandom(10, 1)/100,
			//z_dif: Maths.maxminRandom(0.15, 0.05),
			ease: Power2.easeInOut,
			duration: 4
		});
		gsap.to(this.defaults.y, {
			force: Maths.maxminRandom(80, 30),
			amplitude: Maths.maxminRandom(530, 400),
			//period: Maths.maxminRandom(10, 1)/100,
			//z_dif: Maths.maxminRandom(0.15, 0.05),
			ease: Power2.easeInOut,
			duration: 4
		});
		gsap.to(this.defaults.z, {
			force: Maths.maxminRandom(300, 100),
			amplitude: Maths.maxminRandom(530, 400),
			//period: Maths.maxminRandom(10, 1)/100,
			//z_dif: Maths.maxminRandom(0.15, 0.05),
			ease: Power2.easeInOut,
			duration: 4
		});
		
		setTimeout(()=> {this.randomValues()}, Maths.maxminRandom(60, 30) * 100);
	}

	update(delta) {
		if(this.defaults.animation.hasAnimation) {
			this.tick += this.defaults.animation.speed;
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
					POSITION.x = Math.floor(POSITION.x/this.defaults.animation.gridSize) * this.defaults.animation.gridSize;
					POSITION.y = Math.floor(POSITION.y/this.defaults.animation.gridSize) * this.defaults.animation.gridSize;
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

		this.defaults.cursor.rectangle = {
			x0: this.defaults.cursor.position.x - this.defaults.cursor.radius,
			x1: this.defaults.cursor.position.x + this.defaults.cursor.radius,
			y0: this.defaults.cursor.position.y - this.defaults.cursor.radius,
			y1: this.defaults.cursor.position.y + this.defaults.cursor.radius,
		}
	}

	checkCursorDistance(__position, __particle, __scale, __rotation, dummy) {
		if(this.is404) return;

		const p = {
			x: __particle.x,
			y: __particle.y,
			z: __particle.z
		}

		if(Maths.isInsideRectagle(p, this.defaults.cursor.rectangle) && __particle.movable) {
			const distance = Maths.lineDistance(p, this.defaults.cursor.position);
			if(distance < 150 && distance > 100) {
				__position.z = 0;
				__particle.fixed = true;
				__particle.scaleMax = this.defaults.animation.scaleHover;
			}
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
