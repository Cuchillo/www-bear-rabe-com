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
import { Basics, isMobile, isSmartphone } from '../_app/cuchillo/core/Basics';
import BarProject from '../components/BarProject';
import Movable from '../components/Movable';
import InterfaceCanvas from '../_app/cuchillo/layout/InterfaceCanvas';


export default class Project extends Page {

  data;
  indexCover;
  domDescription;

  constructor() {
    super();
    this.setup();
  }

  setup() {
    this.data = DataHolder.getProject(Number(this.container.getAttribute("data-project")));
    this.indexCover = Basics.tempValue? Basics.tempValue.split(",")[1] : 0;
    this.domDescription = GetBy.class("__description", this.container)[0];
    this.setupCover();
    BarProject.next = Number(this.container.getAttribute("data-next"));
    BarProject.prev = Number(this.container.getAttribute("data-prev"));
    Header.title.subtext = String(this.data.id).padStart(2, "0"); 
    Header.title.text = this.data.title;
    TextMaskedEffect.setup();
    if(!isSmartphone) Movable.start();
    InterfaceCanvas.frameSkip = 1;
  }

  setupCover() {
    Basics.tempValue = null;
    Header.addCover(GetBy.class("__imgcover", this.container)[0], this.indexCover);
  }

  //SHOW
  beforeShow() {
    Scroll.init(Scroll.AXIS_Y, {domResize:this.container, smooth:!isSmartphone, multiplicator:1, hasZeroLimit:true});
    Scroll.setScrollbar(new Scrollbar());
    Scroll.start();
  }

  show__effect(__call) {
    Wrap.directShow();
    BarProject.show();
    BackgroundLogo.hide();
    BackgroundPanels.show((__color)=> {
      if(this.domDescription) {
        this.domDescription.classList.remove("--blue")
        this.domDescription.classList.remove("--green")
        this.domDescription.classList.remove("--grey")
        this.domDescription.classList.add(__color);
      }
    });   
    TextMaskedEffect.show();
    Header.showCover();
    
    this.afterShow();
  }

  afterShow() {
    super.afterShow();
  }

  //HIDE
  beforeHide() {}
  hide__effect() {
    Scroll.hide();
    Header.hideCover();
    TextMaskedEffect.hide();
    if(!Basics.tempValue) {
      BackgroundPanels.hide();
      BarProject.hide();
      setTimeout(()=> {
        Wrap.directHide();
        this.afterHide();
      },1000)
    } else {
      BackgroundPanels.show();
      setTimeout(()=> {
        Wrap.hide(()=> {
          this.afterHide();
        });
      },400)
    }
  }

  afterHide() {
    Basics.tempValue = null;
    InterfaceCanvas.frameSkip = 1;
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
