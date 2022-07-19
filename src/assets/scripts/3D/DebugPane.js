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

    static setupParticleOptions(__data) {
        const subpane = this.pane.addFolder({   title: 'Particles' });

        subpane.addInput(__data, 'total', {
            label: 'Total',
            step: 1,
            min: 100,
            max: 10000,
        });

        subpane.addInput(__data, 'particleSize', {
            label: 'Size',
            step: 1,
            min: 1,
            max: 200,
        });
    }
}