import WMTSTileGrid from "ol/tilegrid/WMTS";
type SourceType = "wmts" | "xyz" | "wms";
type Projection = "EPSG:4326" | "EPSG:3857";

interface BaseSource {
  layer: string;
  url: string;
  serviceType: SourceType;
  projection: Projection;
}

interface SourceWMTS extends BaseSource {
  tileGrid: {
    resolutions: number[];
    matrixIds: string[];
    origin: number[];
  };
}

interface SourceXYZ extends BaseSource {
  tileGrid: {
    origins: number[];
    resolutions: number[];
  };
}

export class BaseLayer {
  data: BaseSource;

  constructor(source: BaseSource) {
    this.data = source;
  }

  //获取坐标系
  getProjection() {
    return this.data.projection;
  }

  //判断投影方式（web墨卡托、经纬度直投）
}

export class WMTSLayer extends BaseLayer {
  data: SourceWMTS;
  private grid: any;
  constructor(data: SourceWMTS) {
    super(data);
    this.data = data;
  }

  //创建切片规则
  private setTileGride() {
    this.grid = new WMTSTileGrid(this.data.tileGrid);
  }
}
