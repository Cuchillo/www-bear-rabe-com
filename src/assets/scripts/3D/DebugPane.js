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

    static setupParticleOptions(__data, __call) {
        const subpane = this.pane.addFolder({   title: 'Particles' });

        const params = {
            total: __data.total
        }

        subpane.addInput(params, 'total', {
            label: 'Total',
            step: 100,
            min: 100,
            max: 10000,
        }).on('change', (ev) => {
            if (ev.last ) {
                __data.total = params.total;
                if(__call) __call();
            }
          });

        subpane.addInput(__data, 'particleSize', {
            label: 'Size',
            step: 1,
            min: 1,
            max: 200,
        });
    }
}