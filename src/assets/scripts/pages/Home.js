import Page from '../_app/cuchillo/pages/Page';
import { ControllerPage } from '../_app/cuchillo/pages/ControllerPage';
import Wrap from '../layout/Wrap';
import BillboardText from '../components/BillboardText';
import { GetBy } from '../_app/cuchillo/core/Element';
import VisorImage from '../components/VisorImage';


export default class Home extends Page {

  _billboard;
  _visor;

  constructor() {
    super();
    this._billboard = new BillboardText(GetBy.class("__billboard", this.container)[0]);
    this._visor = new VisorImage();
  }

  //SHOW
  beforeShow() {}

  show__effect(__call) {
    Wrap.directShow();
    this._billboard.show();
    this.afterShow();
  }

  afterShow() {
    super.afterShow();
  }

  //HIDE
  beforeHide() {}
  hide__effect() {
    Wrap.hide(() => {this.afterHide();});
  }

  afterHide() {
    super.afterHide();
  }

  //RESIZE
  resize() {
    super.resize();
  }

  //LOOP
  loop() {
    if(this._isActive) {
      super.loop();
      this._visor.loop();
    }
  }
}

ControllerPage._addPage("home", Home)
