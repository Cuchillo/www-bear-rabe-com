import {Pane} from 'tweakpane';
import { isDebug } from '../_app/cuchillo/core/Basics';
import { Maths } from '../_app/cuchillo/utils/Maths';

export default class DebugPane {
    static item;
    static pane;
    static uniforms_image;

    static init(__item) {
        this.item = __item;
        this.pane = new Pane({title: 'BEAR Options', expanded: true});
                        
        this.setupAnimation(__item.defaults.animation, ()=> {__item.reset();});
        this.setupContainer(__item.defaults.container, ()=> {__item.reset();});
        this.setupParticles(__item.defaults.particles, ()=> {__item.reset();});
        this.setupPixeles(__item.defaults.pixels, ()=> {__item.reset();});
        this.setupAxis(__item.defaults.x, "X");
        this.setupAxis(__item.defaults.y, "Y");
        this.setupAxis(__item.defaults.z, "Z");
        this.setupAxis(__item.defaults.scale, "Scale");
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

    static setupRender(__renderer) {
        const PARAMS = {
            bg: '#ffffff',
        };
          
        this.pane.addInput(PARAMS, 'bg',{label: 'Background'}).on('change', (ev) => {
            if (ev.last ) {
                __renderer.setClearColor(PARAMS.bg, 1);
            }
        });
    }

    static setupAnimation(__data) {       
        this.pane.addInput(__data, 'hasAnimation',{label: 'Animation'}).on('change', (ev) => {
            __data.finePosition = 0;
            this.pane.refresh();
          });
          this.pane.addInput(__data, 'isPixelMove',{label: 'Pixel'});
          this.pane.addInput(__data, 'speed', {
            label: 'Speed',
            step: .001,
            min: -.1,
            max: .1,
        });
        this.pane.addInput(__data, 'finePosition', {
            label: 'Fine',
            step: .1,
            min: 0,
            max: 1000,
        });

        if(isDebug) {
            this.pane.addInput(__data, 'scaleHover', {
                label: 'scaleHover',
                step: .01,
                min: 1,
                max: 20,
            });
        }

        this.pane.addInput(__data, 'gridSize', {
            label: 'Grid Size',
            step: 1,
            min: 1,
            max: 100,
        });

        

        this.pane.addButton({
            title: 'Random',
          }).on('click', () => {
            __data.finePosition = 500;
            __data.tick = Maths.maxminRandom(10000, 1);
            this.pane.refresh();
          });

        this.pane.addButton({
            title: 'Download Image',
          }).on('click', () => {
            this.item.webgl.saveImage("bear-ooooops");
          });  
    }

    static setupParticles(__data, __call) {
        const subpane = this.pane.addFolder({   title: 'Particles' });
        const params = {
            total: __data.total
        }

        subpane.addInput(params, 'total', {
            label: 'Total',
            step: 100,
            min: 100,
            max: 50000,
        }).on('change', (ev) => {
            if (ev.last ) {
                __data.total = params.total;
                if(__call) __call();
            }
          });

          subpane.addInput(__data, 'size', {
            label: 'Size',
            step: .1,
            min: .1,
            max: 100,
        });
    }

    static setupPixeles(__data, __call) {
        const subpane = this.pane.addFolder({   title: 'Pixels' });
        subpane.addInput(__data, 'snap',{label: 'Snap'});
        subpane.addInput(__data, 'porcentaje', {
            label: 'Quantity',
            step: 1,
            min: 0,
            max: 100,
        }).on('change', (ev) => {
            if (ev.last ) {
                if(__call) __call();
            }
          });

          subpane.addInput(__data, 'size', {
            label: 'Size',
            step: .1,
            min: .1,
            max: 40,
        });
    }

    static setupContainer(__data, __call) {
        const subpane = this.pane.addFolder({   title: 'Container' });

        subpane.addInput(__data, 'scale', {
            label: 'Size',
            step: .01,
            min: 1,
            max: 10,
        }).on('change', (ev) => {
            if (ev.last ) {
                if(__call) __call();
            }
          });

        subpane.addInput(__data, 'scaleZ', {
            label: 'Depth',
            step: .1,
            min: 0,
            max: 100,
        }).on('change', (ev) => {
            if (ev.last ) {
                if(__call) __call();
            }
          });
    }

    static setupAxis(__data, __title) {
        const subpane = this.pane.addFolder({   title: __title });
       
        const step = __title === "Scale"? 0.01 : .1;
        const max = __title === "Scale"? 100 : 1000;

        subpane.addInput(__data, 'force', {
            label: 'Force',
            step: step,
            min: 0,
            max: max
        });

        subpane.addInput(__data, 'amplitude', {
            label: 'Amplitude',
            step: 1,
            min: 0,
            max: 1000
        });

        subpane.addInput(__data, 'period', {
            label: 'Period',
            step: 1,
            min: 0,
            max: 50000
        });

        subpane.addInput(__data, 'z_dif', {
            label: 'Z Force',
            step: .001,
            min: 0,
            max: 1
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