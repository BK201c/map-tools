import { WMTSTileGrid, TileGrid, XYZ } from "@/core/ol";

type SourceType = "wmts" | "xyz" | "wms";
type Projection = "EPSG:4326" | "EPSG:3857";

type Source = {
  layer: string;
  url: string;
  serviceType: SourceType;
  projection: Projection;
  tileGride?: {};
};
export class BaseLayer {
  layer: string;
  url: string;
  serviceType: SourceType;
  projection: Projection;

  constructor(opt: any) {
    this.layer = opt.layer;
    this.url = opt.url;
    this.serviceType = opt.serviceType;
    this.projection = opt.serviceType;
  }

  /**
   *
   * @param sourceType XYZ
   * @returns XYZ TileGride
   */
  private createTileGrid(sourceType: SourceType, tileGride: any) {
    if (sourceType === "wmts") {
      return new WMTSTileGrid(tileGride);
    } else if (sourceType === "xyz") {
      return new TileGrid(tileGride);
    }
  }

  createLayer() {}
}
