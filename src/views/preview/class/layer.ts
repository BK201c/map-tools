import { TileLayer } from "@/core/ol";

export class BaseLayer {
  private layer = {};
  constructor(source: any) {
    this.layer = new TileLayer(source);
  }
}
