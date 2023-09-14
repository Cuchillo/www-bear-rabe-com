import { Vector3 } from "three";
import { Clock, OrthographicCamera, PerspectiveCamera, Scene, Vector2, WebGLRenderer } from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { GetBy } from "../core/Element";
import { Metrics } from "../core/Metrics";
import { Sizes } from "../core/Sizes";

export default class WebGLSketch {
	_started = false;
	_paused = false;
	container;
	renderer;
	scene;
	camera;
	tick = 0;
	// clock;
	size;
	controls;
	// raycaster;
  	// mouse = new THREE.Vector2();
	defaults = {
		container: 'scene',
		antialias: true,
		alpha: true,
		ortho: false,
		fov: 60,
		cameraPos: new Vector3(),
		near: .1,
		far: 10000,
		clearColor: '#000000',
		is2D: false,
		distance2D: 0,
		pixelRatio: Sizes.RATIO_CANVAS
	}

	constructor (opts = {}) {
		// this.mouse = new Vector2();
		this.size = new Vector2();
		this.scene = new Scene();

		this.defaults = {
			...this.defaults,
			...opts
		};

		this.container = GetBy.id(this.defaults.container)
		this.renderer = new WebGLRenderer({
			canvas: this.container,
			antialias: this.defaults.antialias,
			alpha: this.defaults.alpha,
			preserveDrawingBuffer: true
		});

		this.size.set(Metrics.WIDTH, Metrics.HEIGHT);
		this.renderer.setClearColor(this.defaults.clearColor, 1);
		this.renderer.setSize(this.size.x, this.size.y);
		this.renderer.setPixelRatio(this.defaults.pixelRatio);

		this.setupCamera();

		this.controls = new OrbitControls(this.camera, GetBy.class("wrap")[0]);
    	this.controls.enabled = true;
		this.controls.update();
		GetBy.class("wrap")[0].style.pointerEvents = "all"
		// this.raycaster = new THREE.Raycaster();

        if (opts.debug) {
			const axesHelper = new AxesHelper(2000);
			this.scene.add(axesHelper);
		}
	}

	get domElement () {
		return this.renderer.domElement;
	}

	setupCamera() {
		if (this.defaults.ortho) {
			this.camera = new OrthographicCamera(
				-Metrics.WIDTH / 2,
				Metrics.WIDTH / 2,
				Metrics.HEIGHT / 2,
				-Metrics.HEIGHT / 2,
				this.defaults.near,
				this.defaults.far,
			);
		}
		else {
			if(this.defaults.is2D) {
				this.defaults.fov = this._getFov2D(this.size.x/this.size.y);
			}

			this.camera = new PerspectiveCamera(
				this.defaults.fov,
				Metrics.WIDTH / Metrics.HEIGHT,
				this.defaults.near,
				this.defaults.far
			);
		}

		this.camera.position.copy(this.defaults.cameraPos);
		this.scene.add(this.camera);
	}

	start() {
		if(this._started) return;
		this._started = true;
	}

	pause() {
		if(!this._started) return;
		if(this._paused) return;
		this._paused = true;
	}

	resume() {
		if(!this._started) return;
		if(!this._paused) return;
		this._paused = false;
	}

	addEventListeners() {}

	update() {}

	render() {
		this.renderer.render(this.scene, this.camera);
	}

	loop () {
        if (!this._started || this._paused) return;
		
		this.tick++;
		
		this.controls.update();
        this.update();
        this.render();
    }

	resize() {
		if (Metrics.WIDTH === this.size.x && Metrics.HEIGHT === this.size.y) return;

		this.size.set(Metrics.WIDTH, Metrics.HEIGHT);
		this.renderer.setSize(this.size.x, this.size.y);
		
		if (this.camera.type == "PerspectiveCamera") {
			if(this.defaults.is2D) {
				this.defaults.fov = this._getFov2D();
			}

			this.camera.aspect = this.size.x / this.size.y;
			this.camera.fov = this.defaults.fov;
		} else {
			this.camera.left = -Metrics.WIDTH / 2;
			this.camera.right = Metrics.WIDTH / 2;
			this.camera.top = Metrics.HEIGHT / 2;
			this.camera.bottom = -Metrics.HEIGHT / 2;
		}

		this.camera.updateProjectionMatrix();
	}

	saveImage(__name = "cuchillo") {
        try {
            const strMime = "image/jpeg";
			const strMimeDown = "image/octet-stream";
            const imgData = this.renderer.domElement.toDataURL(strMime);
            this._saveFile(imgData.replace(strMime, strMimeDown), __name + ".jpg");
        } catch (e) {
            console.log(e);
            return;
        }

    }

    _saveFile (strData, filename) {
        var link = document.createElement('a');
        if (typeof link.download === 'string') {
            document.body.appendChild(link); //Firefox requires the link to be in the body
            link.download = filename;
            link.href = strData;
            link.click();
            document.body.removeChild(link); //remove the link when done
        } else {
            location.replace(uri);
        }
    }

	dispose () {}

	//PRIVATE

	_getFov2D(__aspect) {
		if(!__aspect) {
			__aspect = this.camera.aspect;
		}
		return 2 * Math.atan(this.size.x / __aspect / (2 * this.defaults.distance2D)) * (180 / Math.PI);
	}
}
