import Page from '../_app/cuchillo/pages/Page';
import { ControllerPage } from '../_app/cuchillo/pages/ControllerPage';
import Wrap from '../layout/Wrap';
import BillboardText from '../components/BillboardText';
import { GetBy } from '../_app/cuchillo/core/Element';


export default class Home extends Page {

  _billboard;

  constructor() {
    super();
    this._billboard = new BillboardText(GetBy.class("__billboard", this.container)[0]);
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
    }
  }
}

ControllerPage._addPage("home", Home)
