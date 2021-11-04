import { WMTSTileGrid, TileGrid, XYZ } from "@/core/ol";

type SourceType = "wmts" | "xyz" | "wms";
type Projection = "EPSG:4326" | "EPSG:3857";
type TileGrideXYZ = {};

type TileGrideWMTS = {};

type Source = {
  layer: string;
  url: string;
  serviceType: SourceType;
  projection: Projection;
  tileGride?: {};
};

export class LayerSource {
  private tileGride;
  constructor(opt: any) {
    this.tileGride = this.createTileGrid(opt.serviceType, opt.tileGride);
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
}
