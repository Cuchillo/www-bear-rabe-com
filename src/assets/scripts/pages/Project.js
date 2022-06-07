import Page from '../_app/cuchillo/pages/Page';
import { ControllerPage } from '../_app/cuchillo/pages/ControllerPage';
import Wrap from '../layout/Wrap';
import BillboardText from '../components/BillboardText';
import { GetBy } from '../_app/cuchillo/core/Element';
import VisorImage from '../components/VisorImage';
import Header from '../layout/Header';
import BackgroundPanels from '../components/BackgroundPanels';


export default class Project extends Page {

  constructor() {
    super();
  }

  //SHOW
  beforeShow() {}

  show__effect(__call) {
    Wrap.directShow();
    BackgroundPanels.show();
    this.afterShow();
  }

  afterShow() {
    super.afterShow();
  }

  //HIDE
  beforeHide() {}
  hide__effect() {
    BackgroundPanels.hide();
    setTimeout(()=> {
      Wrap.directHide();
      this.afterHide();
    },1000)
    
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

ControllerPage._addPage("project", Project)
