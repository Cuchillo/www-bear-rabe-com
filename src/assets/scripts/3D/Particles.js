import * as THREE from 'three';


import { PARTICLE_FRAGMENT, SPRITESHEET_FRAGMENT } from '../shaders/fragment';
import { IMAGE_VERTEXT, PARTICLE_VERTEXT } from '../shaders/vertex';
import { gsap, Power2 } from "gsap";
import { BoxGeometry, MeshBasicMaterial, PlaneBufferGeometry, PlaneGeometry, Vector3 } from 'three';
import WebGLObject from '../_app/cuchillo/3D/WebGLObject';
import { MeshSurfaceSampler } from './MeshSurfaceSampler';
import { Metrics } from '../_app/cuchillo/core/Metrics';
import { Maths } from '../_app/cuchillo/utils/Maths';
import { GetBy } from '../_app/cuchillo/core/Element';
import SpriteSheetGenerator from '../utils/SpriteSheetGenerator';

export default class Particles {

	mesh;
	amount = 10;
	count = 5000; //Math.pow( this.amount, 3 );
	points = [];
	dummy = new THREE.Object3D();
	geometry = new PlaneBufferGeometry(50,50);
	material = new THREE.MeshBasicMaterial({color:0xFF0000, map:SpriteSheetGenerator.texture});
	
	constructor(webgl) {
		this.webgl = webgl;
		this.container = new THREE.Object3D();
	}

	init(src) {
		const loader = new THREE.TextureLoader();

		loader.load(src, (texture) => {
			this.texture = texture;
			this.texture.minFilter = THREE.LinearFilter;
			this.texture.magFilter = THREE.LinearFilter;
			this.texture.format = THREE.RGBFormat;

			this.width = texture.image.width;
			this.height = texture.image.height;

			this.initPoints();
			this.init2();
			this.initHitArea();
			this.initTouch();
			this.resize();
			this.show();
		});
	}

	initPoints() {
        const box = new THREE.Mesh(new THREE.BoxGeometry( Metrics.WIDTH * .8, Metrics.HEIGHT * .6, 400 ));
        const sampler = new MeshSurfaceSampler(box).build();
	
		for (let i = 0; i < this.count; i++) {   
			let tempPosition = new THREE.Vector3();
			sampler.sample(tempPosition);
			console.log(tempPosition.z)
			
			this.points.push(tempPosition)
		}
	}

	init2() {
		/* PARTICLES */
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

        const material = new THREE.ShaderMaterial({
            uniforms,
            fragmentShader: SPRITESHEET_FRAGMENT,
            vertexShader: IMAGE_VERTEXT,
            depthTest: false,
			transparent: false,
          });

		const sprites = [];
		this.mesh = new THREE.InstancedMesh( this.geometry, material, this.count );		
		this.mesh.instanceMatrix.setUsage( THREE.DynamicDrawUsage );

		for ( let i = 0; i < this.count; i ++ ) {
			sprites.push(Maths.maxminRandom(IMAGES_PROJECTS.length, 1));
			this.dummy.position.set(this.points[i].x,this.points[i].y,this.points[i].z);
			this.dummy.updateMatrix();
			this.mesh.setMatrixAt(i, this.dummy.matrix );
		}
		
		this.mesh.geometry.setAttribute('nSprite', new THREE.InstancedBufferAttribute(new Float32Array(sprites), 1, false));
		this.mesh.instanceMatrix.needsUpdate = true;



		this.container.add( this.mesh );			
	}

	initPoints2(discard) {
		this.numPoints = this.width * this.height;

		let numVisible = this.numPoints;
		let threshold = 0;
		let originalColors;

		if (discard) {
			// discard pixels darker than threshold #22
			numVisible = 0;
			threshold = 250;

			const img = this.texture.image;
			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d');

			canvas.width = this.width;
			canvas.height = this.height;
			ctx.scale(1, -1);
			ctx.drawImage(img, 0, 0, this.width, this.height * -1);

			const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
			originalColors = Float32Array.from(imgData.data);

			for (let i = 0; i < this.numPoints; i++) {
				if (originalColors[i * 4 + 0] > threshold) numVisible++;
			}

            
		}

        numVisible = 5000;
        

        const torusgeo = new THREE.BoxGeometry( Metrics.WIDTH, 600, 1 );
        const torusKnot = new THREE.Mesh(torusgeo);
        const sampler = new MeshSurfaceSampler(torusKnot).build();

        
        // Create a dummy Vector to store the sampled coordinates
        const tempPosition = new THREE.Vector3();
		const colors = [];
        const alpha = [];
		const sizes = [];
        const color = new THREE.Color();
        const radius = 2000;

		const uniforms = {
			uTime: { value: 0 },
			uRandom: { value: 1.0 },
			uDepth: { value: 2.0 },
			uSize: { value: 0.0 },
			uTextureSize: { value: new THREE.Vector2(2000.0,2000.0) },
			uTexture: { value:  SpriteSheetGenerator.texture },
			uTouch: { value: null },
		};

		const material = new THREE.RawShaderMaterial({
			uniforms,
			vertexShader: GetBy.id("vertex-shader2").textContent,
			fragmentShader: GetBy.id("fragment-shader2").textContent,
			depthTest: false,
			transparent: true,
			// blending: THREE.AdditiveBlending
		});

		const geometry = new THREE.InstancedBufferGeometry();
		
		// positions
		const vertices = new Float32Array([
		// front
		-1, -1, 1, 1, -1, 1, -1, 1,  1,
		-1,  1, 1, 1, -1, 1,  1, 1,  1,
		]);
		geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

		// uvs
		const uvs = new THREE.BufferAttribute(new Float32Array(4 * 2), 2);
		uvs.setXYZ(0,  0.0,  0.0);
		uvs.setXYZ(1,  1.0,  0.0);
		uvs.setXYZ(2,  0.0,  1.0);
		uvs.setXYZ(3,  1.0,  1.0);
		geometry.setAttribute('uv', uvs);

		// index
		geometry.setIndex(new THREE.BufferAttribute(new Uint16Array([ 0, 2, 1, 2, 3, 1 ]), 1));

		const indices = new Uint16Array(numVisible);
		const offsets = new Float32Array(numVisible * 3);
		const angles = new Float32Array(numVisible);

		for (let i = 0, j = 0; i < this.numPoints; i++) {
			if (discard && originalColors[i * 4 + 0] <= threshold) continue;

			offsets[j * 3 + 0] = i % this.width;
			offsets[j * 3 + 1] = Math.floor(i / this.width);

			indices[j] = i;

			angles[j] = Math.random() * Math.PI;

			j++;
		}

		geometry.setAttribute('pindex', new THREE.InstancedBufferAttribute(indices, 1, false));
		geometry.setAttribute('offset', new THREE.InstancedBufferAttribute(offsets, 3, false));
		geometry.setAttribute('angle', new THREE.InstancedBufferAttribute(angles, 1, false));

		this.object3D = new THREE.Mesh(geometry, material);
		this.container.add(this.object3D);
		
/*

        // Loop to sample a coordinate for each points
        for (let i = 0; i < numVisible; i++) {
        // Sample a random position in the torus
            //sampler.sample(tempPosition);
        // Push the coordinates of the sampled coordinates into the array
           
            sampler.sample(tempPosition);
            vertices.push(tempPosition.x, tempPosition.y, 0);

            positions.push( ( Math.random() * 2 - 1 ) * radius );
            positions.push( ( Math.random() * 2 - 1 ) * radius );
            positions.push(0 );

            color.setHSL( i / numVisible, 1.0, 0.5 );
			colors.push( color.r, color.g, color.b );
            alpha.push(Maths.maxminRandom(1,0));
			sizes.push( 200 );
        }
    
        const shaderMaterial = new THREE.ShaderMaterial( {
            uniforms: {
                t1: { value: SpriteSheetGenerator.texture},
                resolution: { type: "v4", value: new THREE.Vector4() },
            },
            vertexShader: GetBy.id("vertex-shader").textContent,
            fragmentShader: GetBy.id("fragment-shader").textContent,
            depthTest: false,
            transparent: false,
            vertexColors: true

        } );

        shaderMaterial.uniforms.resolution.value.x = 2000;
        shaderMaterial.uniforms.resolution.value.y = 2000;
        shaderMaterial.uniforms.resolution.value.z = 1;
        shaderMaterial.uniforms.resolution.value.w = 1;


        let buffgeometry = new THREE.BufferGeometry();
        buffgeometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
        buffgeometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
        buffgeometry.setAttribute( 'size', new THREE.Float32BufferAttribute( sizes, 1 ).setUsage( THREE.DynamicDrawUsage ) );
        let particleSystem = new THREE.Points( buffgeometry, shaderMaterial );
       // let particleSystem = new THREE.Mesh( buffgeometry, shaderMaterial );
       

        this.container.add( particleSystem );


        
        // Create a geometry for the points
        const pointsGeometry = new THREE.BufferGeometry();
        pointsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        // Define the matrial of the points
        const pointsMaterial = new THREE.PointsMaterial({
          size: 100,
          map: new THREE.TextureLoader().load( "/assets/images/logo-sample.jpg" )
        });
        const points = new THREE.Points(pointsGeometry, pointsMaterial);
        // Add them into the main group
        //this.container.add(points);


		const uniforms = {
			uTime: { value: 0 },
			uRandom: { value: 1.0 },
			uDepth: { value: 2.0 },
			uSize: { value: 0.0 },
			uTextureSize: { value: new THREE.Vector2(this.width, this.height) },
			uTexture: { value: this.texture },
			uTouch: { value: null },
		};

		/*const material = new THREE.RawShaderMaterial({
			uniforms,
			vertexShader: PARTICLE_VERTEXT,
			fragmentShader: PARTICLE_FRAGMENT,
			depthTest: false,
			transparent: true,
			// blending: THREE.AdditiveBlending
		});*/

       
        //this.scene.add(cube);

		// positions
		/*const positions = new THREE.BufferAttribute(new Float32Array(4 * 3), 3);
		positions.setXYZ(0, -0.5,  0.5,  0.0);
		positions.setXYZ(1,  0.5,  0.5,  0.0);
		positions.setXYZ(2, -0.5, -0.5,  0.0);
		positions.setXYZ(3,  0.5, -0.5,  0.0);
		geometry.addAttribute('position', positions);

		// uvs
		const uvs = new THREE.BufferAttribute(new Float32Array(4 * 2), 2);
		uvs.setXYZ(0,  0.0,  0.0);
		uvs.setXYZ(1,  1.0,  0.0);
		uvs.setXYZ(2,  0.0,  1.0);
		uvs.setXYZ(3,  1.0,  1.0);
		geometry.addAttribute('uv', uvs);

		// index
		geometry.setIndex(new THREE.BufferAttribute(new Uint16Array([ 0, 2, 1, 2, 3, 1 ]), 1));

		const indices = new Uint16Array(numVisible);
		const offsets = new Float32Array(numVisible * 3);
		const angles = new Float32Array(numVisible);*/

		/*for (let i = 0, j = 0; i < this.numPoints; i++) {
			if (discard && originalColors[i * 4 + 0] <= threshold) continue;

			offsets[j * 3 + 0] = i % this.width;
			offsets[j * 3 + 1] = Math.floor(i / this.width);

			indices[j] = i;

			angles[j] = Math.random() * Math.PI;

			j++;
		}*/

		/*geometry.addAttribute('pindex', new THREE.InstancedBufferAttribute(indices, 1, false));
		geometry.addAttribute('offset', new THREE.InstancedBufferAttribute(offsets, 3, false));
		geometry.addAttribute('angle', new THREE.InstancedBufferAttribute(angles, 1, false));*/

		//this.object3D = new THREE.Mesh(geometry, material);*/
		
	}

	initTouch() {
		// create only once
		/*if (!this.touch) this.touch = new TouchTexture(this);
		this.object3D.material.uniforms.uTouch.value = this.touch.texture;*/
	}

	initHitArea() {
		const geometry = new THREE.PlaneGeometry(this.width, this.height, 1, 1);
		const material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, wireframe: true, depthTest: false });
		material.visible = false;
		this.hitArea = new THREE.Mesh(geometry, material);
		this.container.add(this.hitArea);
	}

	addListeners() {
		/*this.handlerInteractiveMove = this.onInteractiveMove.bind(this);

		this.webgl.interactive.addListener('interactive-move', this.handlerInteractiveMove);
		this.webgl.interactive.objects.push(this.hitArea);
		this.webgl.interactive.enable();*/
	}

	removeListeners() {
		this.webgl.interactive.removeListener('interactive-move', this.handlerInteractiveMove);
		
		const index = this.webgl.interactive.objects.findIndex(obj => obj === this.hitArea);
		this.webgl.interactive.objects.splice(index, 1);
		this.webgl.interactive.disable();
	}

	// ---------------------------------------------------------------------------------------------
	// PUBLIC
	// ---------------------------------------------------------------------------------------------

	update(delta) {
		//if (!this.object3D) return;
		//if (this.touch) this.touch.update();
		//this.object3D.material.uniforms.uTime.value += delta;

		if ( this.mesh ) {

			
			this.mesh.instanceMatrix.needsUpdate = true;

		}
	}

	show(time = 1.0) {
		// reset
		/*gsap.fromTo(this.object3D.material.uniforms.uSize, time, { value: 0.5 }, { value: 1.5 });
		TweenLite.to(this.object3D.material.uniforms.uRandom, time, { value: 2.0 });
		TweenLite.fromTo(this.object3D.material.uniforms.uDepth, time * 1.5, { value: 40.0 }, { value: 4.0 });*/

		this.addListeners();
	}

	hide(_destroy, time = 0.8) {
		return new Promise((resolve, reject) => {
			/*gsap.to(this.object3D.material.uniforms.uRandom, time, { value: 5.0, onComplete: () => {
				if (_destroy) this.destroy();
				resolve();
			} });
			TweenLite.to(this.object3D.material.uniforms.uDepth, time, { value: -20.0, ease: Quad.easeIn });
			TweenLite.to(this.object3D.material.uniforms.uSize, time * 0.8, { value: 0.0 });*/

			this.removeListeners();
		});
	}

	destroy() {
		if (!this.object3D) return;

		this.object3D.parent.remove(this.object3D);
		this.object3D.geometry.dispose();
		this.object3D.material.dispose();
		this.object3D = null;

		if (!this.hitArea) return;

		this.hitArea.parent.remove(this.hitArea);
		this.hitArea.geometry.dispose();
		this.hitArea.material.dispose();
		this.hitArea = null;
	}

	// ---------------------------------------------------------------------------------------------
	// EVENT HANDLERS
	// ---------------------------------------------------------------------------------------------

	resize() {
		if (!this.object3D) return;

		const scale = this.webgl.fovHeight / this.height;
		this.object3D.scale.set(scale, scale, 1);
		this.hitArea.scale.set(scale, scale, 1);
	}

	onInteractiveMove(e) {
		const uv = e.intersectionData.uv;
		//if (this.touch) this.touch.addTouch(uv);
	}
}
