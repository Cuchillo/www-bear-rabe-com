import {Pane} from 'tweakpane';

export default class DebugPane {
    static pane = new Pane();
    static uniforms_image;

    static init() {               
        this.setupImageOptions();
        this.setupParticleOptions();
    }

    static setupImageOptions() {
        const subpane = this.pane.addFolder({
            title: 'Image',
        });
        
        subpane.addInput(this.uniforms_image.progress, 'value', {
            label: 'Progress',
            step: .1,
            min: 0,
            max: 1,
        });

        
        subpane.addInput(this.uniforms_image.scaleCenter, 'value', {
            label: 'Center',
            x: {step: .11111111111, min: 0, max: 1},
            y: {step: .11111111111, min: 0, max: 1},
        });
    }

    static resetTimeline() {
        this.pane.refresh();
    }

    static setupParticleOptions(__data, __call) {
        const subpane = this.pane.addFolder({   title: 'Particles' });

        const params = {
            total: __data.total
        }

        subpane.addInput(__data, 'hasAnimation',{label: 'Animation'});
        subpane.addInput(__data, 'isPixelMove',{label: 'Pixel'});

        subpane.addInput(__data, 'timelinePosition', {
            label: 'Fine Progress',
            step: .01,
            min: 0,
            max: 100,
        });

        subpane.addInput(__data, 'pixelRandom', {
            label: 'Pixel Radom',
            step: 1,
            min: 0,
            max: 100,
        }).on('change', (ev) => {
            if (ev.last ) {
                if(__call) __call();
            }
          });
        
        subpane.addInput(__data, 'scale', {
            label: 'Scale',
            step: .01,
            min: 1,
            max: 10,
        }).on('change', (ev) => {
            if (ev.last ) {
                if(__call) __call();
            }
          });

       
        subpane.addInput(params, 'total', {
            label: 'Total',
            step: 100,
            min: 100,
            max: 20000,
        }).on('change', (ev) => {
            if (ev.last ) {
                __data.total = params.total;
                if(__call) __call();
            }
          });

        subpane.addInput(__data, 'particleSize', {
            label: 'Size',
            step: .1,
            min: .1,
            max: 40,
        });

        subpane.addInput(__data, 'speed', {
            label: 'Speed',
            step: .1,
            min: 0.1,
            max: 100,
        });

        subpane.addInput(__data.forces, 'x', {
            label: 'Force x',
            step: .1,
            min: 0,
            max: 1000,
        });

        subpane.addInput(__data.forces, 'y', {
            label: 'Force y',
            step: .1,
            min: 0,
            max: 1000,
        });

        subpane.addInput(__data.forces, 'z', {
            label: 'Force z',
            step: .1,
            min: 0,
            max: 1000,
        });
    }

    static setupObject(obj, __call) {
        const subpane = this.pane.addFolder({   title: 'Object 3D' });

        
        const params = {
            scale: obj.scale.x
        }

        subpane.addInput(obj.material, 'visible');

        subpane.addInput(params, 'scale', {
            label: 'Scale',
            step: .01,
            min: 1,
            max: 100,
        }).on('change', (ev) => {
            obj.scale.x = params.scale;
            obj.scale.y = params.scale;
            obj.scale.z = params.scale;

            if (ev.last ) {
                if(__call) __call();
            }
          });

        subpane.addInput(obj.position, 'x', {
            label: 'Pos x',
            step: .1,
            min: -1000,
            max: 1000,
        });

        subpane.addInput(obj.position, 'y', {
            label: 'Pos y',
            step: .1,
            min: -1000,
            max: 1000,
        });

        subpane.addInput(obj.position, 'z', {
            label: 'Pos z',
            step: .1,
            min: -1000,
            max: 1000,
        });
    }
}