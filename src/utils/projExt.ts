class ProjExt {
  constructor() {}

  /**
   * 判断是否是web墨卡托平面坐标
   * @param {*坐标系 projection}
   * @returns boolen
   */
  static isMercatorProjection = (projection: string): boolean => {
    const degreeMapper = ["EPSG:4326", "EPSG:4490", "wgs84"];
    const mercatorMapper = ["EPSG:3857", "EPSG:900913"];
    return (
      mercatorMapper.includes(projection) && !degreeMapper.includes(projection)
    );
  };

  /**
   *
   * @param {*比例尺} scale
   * @param {*坐标系统} crs
   * @param {*像素密度} dpi
   * @returns 地面分辨率
   */
  static calcResolutionByScale = (
    scale: number,
    isMercatorProjection = false,
    dpi = 96
  ): number => {
    // 一个像素等于多少米距离（像素/米）,OGC标准下单位像素距离
    const defaultPixelMeter = 0.0254;

    //地球半径（m）
    const erathRadius = 6378137;

    // 当投影坐标系为（EPSG:4326,EPSG:4490时）地图单位（度/米），一度等于多少米距离单位（米），当地理坐标系为WGS84时，地图单位为度
    const degreeMeter = (Math.PI * 2 * erathRadius) / 360;

    // 当投影坐标系为（EPSG：3857，EPSG:90013时）地图单位（米）
    const meter = 1;

    // 地图单位
    const units = isMercatorProjection ? meter : degreeMeter;

    // OGC标准中没有规定屏幕分辨率（pixel/inch），而是用像元大小（0.28mm=0.00028m）来界定，WMTS 1.0.0接口，每英寸像元数为：1inch/(0.00028m/0.0254(m/inch))=0.0254/0.00028≈90.714
    const customDpi = isMercatorProjection ? defaultPixelMeter / 0.00028 : dpi;

    return (defaultPixelMeter * scale) / (customDpi * units);
  };

  // 转换投影坐标系
  static convertProjection = (projection = "EPSG:4326"): string =>
    ProjExt.isMercatorProjection(projection) ? "EPSG:3857" : "EPSG:4326";

  //经纬度转墨卡托
  static lonLat2Mercator = (coordinates: number[]): number[] => {
    const [lon, lat] = coordinates;
    const x = (lon * 20037508.34) / 180;
    const y =
      ((Math.log(Math.tan(((90 + lat) * Math.PI) / 360)) / (Math.PI / 180)) *
        20037508.34) /
      180;
    return [x, y];
  };
}

export default ProjExt;
