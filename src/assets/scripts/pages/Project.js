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
import { Scroll } from '../_app/cuchillo/scroll/Scroll';
import Scrollbar from '../_app/cuchillo/scroll/Scrollbar';
import { isMobile } from '../_app/cuchillo/core/Basics';


export default class Project extends Page {

  data;
  domDescription;

  constructor() {
    super();
    this.setup();
  }

  setup() {
    this.data = DataHolder.getProject(Number(this.container.getAttribute("data-project")));
    this.domDescription = GetBy.class("__description", this.container)[0];
    Header.title.subtext = String(this.data.id).padStart(2, "0"); 
    Header.title.text = this.data.title;
    TextMaskedEffect.setup();
  }

  //SHOW
  beforeShow() {
    Scroll.init(Scroll.AXIS_Y, {domResize:this.container, smooth:!isMobile, multiplicator:1});
    Scroll.setScrollbar(new Scrollbar());
    Scroll.start();
  }

  show__effect(__call) {
    Wrap.directShow();
    BackgroundLogo.hide();
    BackgroundPanels.show((__color)=> {
      this.domDescription.classList.remove("--blue")
      this.domDescription.classList.remove("--green")
      this.domDescription.classList.remove("--grey")
      this.domDescription.classList.add(__color)
    });   
    TextMaskedEffect.show();
    
    this.afterShow();
  }

  afterShow() {
    super.afterShow();
  }

  //HIDE
  beforeHide() {}
  hide__effect() {
    Scroll.hide();
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
