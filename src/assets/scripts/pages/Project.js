import Page from '../_app/cuchillo/pages/Page';
import { ControllerPage } from '../_app/cuchillo/pages/ControllerPage';
import Wrap from '../layout/Wrap';
import BillboardText from '../components/BillboardText';
import { GetBy } from '../_app/cuchillo/core/Element';
import VisorImage from '../components/VisorImage';
import Header from '../layout/Header';
import BackgroundPanels from '../components/BackgroundPanels';
import BackgroundLogo from '../components/BackgroundLogo';
import { DataHolder } from '../DataHolder';
import TextMaskedEffect from '../components/TextMaskedEffect';


export default class Project extends Page {

  data;

  constructor() {
    super();
    this.setup();
  }

  setup() {
    this.data = DataHolder.getProject(Number(this.container.getAttribute("data-project")));
    Header.title.subtext = String(this.data.id).padStart(2, "0"); 
    Header.title.text = this.data.title;
    TextMaskedEffect.setup();
  }

  //SHOW
  beforeShow() {}

  show__effect(__call) {
    Wrap.directShow();
    BackgroundLogo.hide();
    BackgroundPanels.show();   
    TextMaskedEffect.show();
    
    this.afterShow();
  }

  afterShow() {
    super.afterShow();
  }

  //HIDE
  beforeHide() {}
  hide__effect() {
    TextMaskedEffect.hide();
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

  dispose() {
    TextMaskedEffect.dispose();
    super.dispose();
  }

  //LOOP
  loop() {
    if(this._isActive) {
      super.loop();
    }
  }
}

ControllerPage._addPage("project", Project)
