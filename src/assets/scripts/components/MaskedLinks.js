import { GetBy } from "../_app/cuchillo/core/Element";
import { Metrics } from "../_app/cuchillo/core/Metrics";

export const MaskedLinks = {
  _items: [],
  init() {
    this._items = [];
    [...GetBy.selector("[data-masked-link]", this.container)].map(e => { this._items.push(new MaskedLink(e)); })
  },

  resize() {
    for(let i=0; i<this._items.length; i++) {
      this._items[i].resize();
    }
  }
};



class MaskedLink {
  container;
  text;

  constructor(__container, __id) {
    this.container = __container;
    this.text = GetBy.class("text", this.container)[0];
    this.resize();
  }

  resize() {
    this.container.style.setProperty("--size-text", this.text.offsetWidth + "px");
    this.container.style.setProperty("--steps", Math.round(this.text.offsetWidth/(Metrics.GRID*2)));
  }
}
