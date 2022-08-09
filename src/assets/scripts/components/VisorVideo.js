import { GetBy } from "../_app/cuchillo/core/Element";
import { Functions } from "../_app/cuchillo/utils/Functions";
import { gsap, Power2 } from 'gsap';

export default class VisorVideos {
  _videos = [];
  _video;
  _preloader;
  _call = () => { this.changeVideo() }
  actual = 0;
  isReady = false;
  isLoaded = false;
  isPreloaded = false;
  options = {
    show: {
      duration: .2,
      delay: 0,
      ease: Power2.easeOut
    },
    hide: {
      duration: .2,
      delay: 0,
      ease: Power2.easeIn
    }
  }
        
  constructor(__container) {
    this.container = __container;
    this.setupData();
    this.setupVideos();
  }

  setupData() {
    const videoList = this.container.getAttribute("data-videos").slice(0, -1); //BORRAR LA ULTIMA COMA;
    this.videos = Functions.arrayRandom(videoList.split(","));
  }

  setupVideos() {
    this._video = GetBy.selector("video", this.container)[0];
    this._preloader = GetBy.selector("video", this.container)[1];
  }
  
  play() {
    this._video.setAttribute("src", this.videos[this.actual]);
    this.actual++;
    const playPromise = this._video.play();

    if (playPromise !== undefined) {
      playPromise.then(_ => {
        this.isLoaded = true;
        this.show();
      })
      .catch(error => {
        // Auto-play was prevented
        // Show paused UI.
      });
    }
  }

  preload() {
    console.log("Preload", this.actual)

    this._preloader.pause();
    this.isPreloaded = false;
    this._preloader.setAttribute("src", this.videos[this.actual]);
    const playPromise = this._preloader.play();

    if (playPromise !== undefined) {
      playPromise.then(_ => {
        this.isPreloaded = true;
        //this._preloader.pause();
      })
      .catch(error => {
        // Auto-play was prevented
        // Show paused UI.
      });
    }
  }

  show() {    
    gsap.to(this._video, {
      alpha: 1,
      duration: this.options.show.duration,
      delay: this.options.show.delay,
      ease: this.options.show.ease
    });

    gsap.to(this._preloader, {
      alpha: 0,
      duration: this.options.hide.duration,
      delay: this.options.hide.delay,
      ease: this.options.hide.ease,
      onComplete:() => {
        this.preload();
      }
    });
  }

  changeVideo() {
    const temp = this._video;
    this._video = this._preloader;
    this._preloader = temp;

    this._video.currentTime = 1;
    this.actual = this.actual+1 === this.videos.length? 0 : this.actual + 1;

    this.show();
  }

  loop() {
    if(this.isLoaded) {
      if(this._video.currentTime+1 >= this._video.duration) {
        this.changeVideo();
      }
    }
  }

  dispose() {
    if(this.isLoaded) { this._video.pause(); }
    if(this.isPreloaded) { this._preloader.pause(); }

    this._video.removeEventListener('ended', this._call, false);

    this._videos = null;
    this._video = null;
    this._preloader = null; 
    this._call = null;
    this.actual = null;
    this.isReady = false;
    this.isLoaded = false;
    this.isPreloaded = false;
  }
}
