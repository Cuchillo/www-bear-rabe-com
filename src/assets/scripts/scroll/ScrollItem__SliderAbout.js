import gsap from 'gsap';
import { SliderScroll } from '../_app/cuchillo/components/SliderScroll';
import { GetBy } from '../_app/cuchillo/core/Element';

import { Scroll } from '../_app/cuchillo/scroll/Scroll';
import VScroll_Item from '../_app/cuchillo/scroll/VScroll_Item';
import { Maths } from '../_app/cuchillo/utils/Maths';

class ScrollItem__SliderAbout extends VScroll_Item {

  _slider;

  //==================================================================================================================
  //          CONSTRUCTOR
  //==================================================================================================================
  constructor(__link, __index, __scroller) {
    super(__link, __index, __scroller);

    this._slider = new SliderScroll(this.item, {
        onDragStart: () => { },
        onDragEnd: () => { },
        interaction: true,
        hasScrollbar: false
    });
    
    this._call = () => {
      this.loop();
    }

    this.onShow = () => {
    
      gsap.ticker.add(this._call);
    };
    this.onHide = () => {
    
      gsap.ticker.remove(this._call);
    };
    this.onMove = () => {
      if(Math.abs(Scroll.speed) > 1)  {
        this._slider.step(Scroll.speed * 5);
      }
    }
  }

  loop () {
    this._slider.loop();
  }

  dispose () {
    this._slider.dispose();
    super.dispose();
  }

  resize (__w,__h) {
    super.resize(__w,__h);
    this._slider.resize();
  }
}

Scroll._registerClass('slider-about', ScrollItem__SliderAbout);