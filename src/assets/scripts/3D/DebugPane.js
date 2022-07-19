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

    static setupParticleOptions() {
        const subpane = this.pane.addFolder({   title: 'Particles' });
        
        const params = {
            particles:2000
        }

        subpane.addInput(params, 'particles', {
            label: 'Particles',
            step: 1,
            min: 100,
            max: 10000,
        });
    }
}