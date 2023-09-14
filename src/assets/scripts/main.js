import "core-js/stable";
import "regenerator-runtime/runtime";

import { Scroll } from './_app/cuchillo/scroll/Scroll';
import { VSticky } from './_app/cuchillo/scroll/insiders/VSticky';
import { VScaleZero } from './_app/cuchillo/scroll/insiders/VScaleZero';
import { VScale } from './_app/cuchillo/scroll/insiders/VScale';
import { VInsider } from './_app/cuchillo/scroll/insiders/VInsider';
import { VDisplace } from './_app/cuchillo/scroll/insiders/VDisplace';
import { VInsiderMask } from './_app/cuchillo/scroll/insiders/VInsiderMask';

import { Keyboard } from './_app/cuchillo/core/Keyboard';
import { Basics, isDebug, isMobile, isTouch } from './_app/cuchillo/core/Basics';
import { Accessibility } from './_app/cuchillo/core/Accessibility';
import { Statics } from './_app/cuchillo/utils/Statics';

import LoaderController from './_app/cuchillo/loaders/LoaderController';
import PagesLoader from './_app/cuchillo/loaders/PagesLoader';
import MediaLoader from './_app/cuchillo/loaders/MediaLoader';
import { ControllerPage } from './_app/cuchillo/pages/ControllerPage';
import { Metrics } from './_app/cuchillo/core/Metrics';
import Default from './pages/Default';
import Home from './pages/Home';
import Project from './pages/Project';
import Error404 from './pages/Error404';
import About from './pages/About';
import Legal from './pages/Legal';
import EventDispatcher from './_app/cuchillo/core/EventDispatcher';
import Page from './_app/cuchillo/pages/Page';
import { Interaction, MrInteraction } from './_app/cuchillo/core/Interaction';
import { gsap, Power2 } from "gsap";
import { ControllerWindow } from './_app/cuchillo/windows/ControllerWindow';
import Win from './_app/cuchillo/windows/Window';
import Cursor from './_app/cuchillo/cursor/Cursor';

import Wrap from './layout/Wrap';
import InterfaceCanvas from './_app/cuchillo/layout/InterfaceCanvas';
import Loading from './layout/Loading';
import BG from './_app/cuchillo/layout/Background';
import Cookies from './windows/Cookies';
import Header from './layout/Header';

import { ScrollItem__SliderScrollHorizontal } from './scroll/ScrollItem__SliderScrollHorizontal';
import { ScrollItem__WebGLSketch } from './scroll/ScrollItem__WebGLSketch';
import { ScrollItem__SliderAbout } from './scroll/ScrollItem__SliderAbout';


import { MaskedLinks } from "./components/MaskedLinks";
import Guides from "./_app/cuchillo/utils/Guides";
import TopCanvas from "./components/TopCanvas";
import BackgroundLogo from "./components/BackgroundLogo";
import { formatWithCursor } from "prettier";
import VisorImage from "./components/VisorImage";
import { GetBy } from "./_app/cuchillo/core/Element";
import SpriteSheetGenerator from "./utils/SpriteSheetGenerator";
import Scene from "./3D/Scene";

export default class Main {

  static scrollbar;
  static stats;
  static scene = new Scene();

  static init () {
    
    IMAGES_PROJECTS = [];
    for(let i = 1; i<38; i++) {
      const img = `/assets/images/test2/images-${i}.jpg`
      IMAGES_PROJECTS.push({
        cover: img,
        height: 1024,
        image: img,
        project: 0,
        thumb: img,
        width: 1024
      })
    }

    PROJECTS = PROJECTS.slice(0, IMAGES_PROJECTS.length);


    Basics.id = "w11p_v007"; // ID para cookies

    Metrics.init(() => Main.resize()); // Tamaños y resize
    Keyboard.enable(); // ESC para cerrar ventana
    Accessibility.init(); // Utils accesibilidad
    Statics.init(); // Si estamos en debug pinta un FPS counter
    Interaction.init({ ajax: true }) // Posiciones del cursor (Movimiento, click...), Acciones links, drag...
    ControllerWindow.init(); // Control ventanas
    MaskedLinks.init();
    SpriteSheetGenerator.init();
    TopCanvas.init();
    BG.init(CMS_COLORS); // Control de paletas y color de fondo de pantallas. Automatico si añadimos un data-palette='loquesea' en el div con data-page
    InterfaceCanvas.init(); // Canvas de interface, se usa con Cursor
    Cookies.init(); // Checkea y saca el aviso de cookies
    Cursor.init(document.body, {
      color: "#000000",
      fontStyle: {
          size: 16,
          fontFamily: "SweetSansProMedium"
      }
    }, { size: 0,  alpha: 0 }, { alpha: 0, size: 0 });

    LoaderController.add(new PagesLoader()); // Carga/Precarga de paginas HTML
    LoaderController.add(new MediaLoader()); // Carga/Precarga de imgs
    LoaderController.onComplete = () => Main.setup();
    // LoaderController.update = progress => {  };
    LoaderController.init();

    this.doCuchilloInfo();

    if(!isDebug)  this.setWorker();

    // LOOP
    if (isDebug) {
      gsap.ticker.add(() => { Main.loopDebug(); });
    } else {
      gsap.ticker.add(() => { Main.loop(); });
    }
  }

  static setup () {
    //SpriteSheetGenerator.start(IMAGES_PROJECTS, ()=> {
      const is404 = GetBy.selector('[data-page]')[0].getAttribute("data-page") == "error404";
      this.setupEvents();
      this.scene.init(is404);

      if(!isDebug) {
        setTimeout(()=>{this.intro()}, 1000); 
      } else {
        this.start();
      }
    //});
  }

  static intro() {
    InterfaceCanvas.frameSkip = 10;
    TopCanvas.startAnimation(()=> {
      InterfaceCanvas.frameSkip = 1;
      TopCanvas.cols = 0;
      BG.changeBG("#000000", null, 0);
      BackgroundLogo.setWhite();
      this.start();
    })
  }

  static start() {
    BG.changeBG("#000000", null, 0);
    BackgroundLogo.setWhite();
    SpriteSheetGenerator.start(IMAGES_PROJECTS, ()=> {
    
    setTimeout(()=>{
        ControllerPage.init(Wrap.mainholder);
      }, 200);
    });
  }

  static setupEvents () {
    EventDispatcher.addEventListener(Page.ON_SHOW, () => {
      Cursor.start();
      Loading.stop();
    });
    EventDispatcher.addEventListener(Page.ON_HIDE, () => {
      Cursor.hide();
    });
    EventDispatcher.addEventListener(Page.ON_HIDE_END, () => {
      Loading.start();
    });

    EventDispatcher.addEventListener(Win.ON_HIDE, () => { Scroll.setEnabled(true); });
    EventDispatcher.addEventListener(Win.ON_SHOW, () => { Scroll.setEnabled(false); });
  }

  static resize () {
    this.scene.resize();
    TopCanvas.resize();
    Guides.resize();
    MaskedLinks.resize();
    InterfaceCanvas.resize();
    ControllerPage.resize();
  }

  static loop () {
    InterfaceCanvas.loop();
    ControllerPage.loop();
    TopCanvas.loop();
    if(this.scene) this.scene.loop();

    if(!isTouch) Cursor.loop();
        
    if (Scroll.isScrolling) Scroll.loop();
  }

  static loopDebug () {
    Statics.begin();
    this.loop();
    Statics.end();
  }

  static doCuchilloInfo () {
    console.log('%cby Cuchillo', 'background: #000; color: #bada55; padding:25px 100px;');
    console.log('⟶ http://cuchillo.studio');
    console.log('⟶ https://www.instagram.com/_cuchillo');
    console.log('⟶ https://twitter.com/somoscuchillo');
    console.log('⟶ https://twitter.com/mr__corrales');
    console.log('');
    console.log('ThreeJS by Mr.doob');
    console.log('⟶ https://threejs.org/');
    console.log('');
    console.log('Gsap by Greenshock');
    console.log('⟶ https://greensock.com');
    console.log('');
    console.log('Font: Neue Haas Grotesk');
    console.log('⟶ https://www.fonts.com/font/linotype/neue-haas-grotesk-display/55-roman');
    console.log('');
    console.log('Font: Compagnon Roman by Juliette Duhé + Léa Pradine');
    console.log('⟶ https://velvetyne.fr/fonts/compagnon/');
    console.log('');
    console.log('Tool: SVGOMG');
    console.log('⟶ https://jakearchibald.github.io/svgomg/');
    console.log('');
    console.log('Tool: Favicon Generator');
    console.log('⟶ https://realfavicongenerator.net');
  }

  static setWorker () {
    if ('serviceWorker' in navigator && !isDebug) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then(function () { });
    }
  }
}

if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
  Main.init();
} else {
  document.addEventListener('DOMContentLoaded', Main.init);
}
