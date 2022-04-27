/**
 * 以下所有参考数值均基于OGC标准下计算。
 * https://docs.opengeospatial.org/is/13-082r2/13-082r2.html#21
 */

import { WMTSCapabilities } from "@/core/ol";
import { isMercatorProjection } from "./validation";
import { transform } from "ol/proj";
/**
 * Returns resolution(地图分辨率 )
 * @param {number} scale 比例尺
 * @param {string} crs 坐标系统
 * @param {number} dpi 像素密度
 * @returns {number} resolution(地图分辨率 )
 */
const calcResolutionByScale = (scale, crs = 4326) => {
  // OGC标准下单位像素距离,米与英寸的单位转换,一个像素等于多少米距离（像素/米）
  const defaultPixelMeter = 0.0254;

  //天地图等三方服务商单位像素距离
  // const defaultPixelMeter = 0.025399998;

  //地球半径（m）
  const erathRadius = 6378137;

  // 当投影坐标系为经纬度直投（EPSG:4326,EPSG:4490时）地图单位（度/米），一度等于多少米距离单位（米），当地理坐标系为WGS84时，地图单位为度
  const degreeMeter = (Math.PI * erathRadius) / 180;

  // 当投影坐标系为墨卡托投影（EPSG：3857，EPSG:90013时）地图单位（米）
  const meter = 1;

  // 地图单位
  const units = isMercatorProjection(crs) ? meter : degreeMeter;

  // OGC标准中没有规定屏幕分辨率（pixel/inch），而是用像元大小（0.28mm=0.00028m）来界定，WMTS 1.0.0接口，每英寸像元数为：1inch/(0.00028m/0.0254(m/inch))=0.0254/0.00028≈90.714
  const dpi = isMercatorProjection(crs) ? defaultPixelMeter / 0.00028 : 96;

  // 比例尺(scale)=0.0254/(Resolution*96)。
  const resolution = (defaultPixelMeter * scale) / (dpi * units);

  return resolution;
};

const getResolutionByCalc = (level = 20, size = 0.7031250000000002) => {
  const matrixIds = [...Array(level + 1).keys()];
  const resolutions = [...matrixIds.map(e => size / Math.pow(2, e))];
  return { resolutions, matrixIds };
};

//获取tileGrid信息
const filterTileGridInfo = TileMatrixSet => {
  let projection;
  let origin;
  let matrixIds = [];
  let resolutions = [];
  const sourceOrigin = [
    TileMatrixSet.TileMatrix[0].TopLeftCorner[1],
    TileMatrixSet.TileMatrix[0].TopLeftCorner[0]
  ];
  const tileSize = TileMatrixSet.TileMatrix[0].TileWidth || 256;
  const sourcePro = "EPSG:" + TileMatrixSet.SupportedCRS?.split("::")[1];

  if (isMercatorProjection(sourcePro)) {
    projection = "EPSG:3857";
    origin = [-20037508.3427892, 20037508.3427892];
    const list = getResolutionByCalc(20, 156543.034);
    matrixIds = list.matrixIds;
    resolutions = list.resolutions;
  } else {
    projection = "EPSG:4326";
    origin = sourceOrigin;
    TileMatrixSet.TileMatrix.forEach(matrix => {
      matrixIds.push(Number(matrix.Identifier));
      resolutions.push(
        calcResolutionByScale(matrix?.ScaleDenominator, projection)
      );
    });
  }
  return {
    origin,
    projection,
    matrixIds,
    resolutions,
    tileSize
  };
};

//获取WMTS瓦片调用服务地址
const getTileUrl = OperationsMetadata =>
  OperationsMetadata.GetTile.DCP.HTTP.Get.filter(
    l => l.Constraint[0].AllowedValues.Value[0].toUpperCase() === "KVP"
  )[0].href;

// 获取图层组信息
const filterLayerSource = xml => {
  const parser = new WMTSCapabilities();
  const { Contents, OperationsMetadata } = parser.read(xml);
  const metaLayers = [
    ...Contents.Layer.map(layer =>
      Object.assign(
        {},
        {
          layer: layer.Identifier,
          url: getTileUrl(OperationsMetadata),
          serviceType: "WMTS",
          style: layer.Style[0]?.Identifier,
          format: layer.Format[0],
          matrixSet: layer.TileMatrixSetLink[0]?.TileMatrixSet,
          crossOrigin: "anonymous"
        }
      )
    )
  ];

  const tileGrids = [
    ...metaLayers.map(meta => {
      const [TileMatrixSet] = Contents.TileMatrixSet.filter(
        e => e.Identifier === meta.matrixSet
      );
      const grid = filterTileGridInfo(TileMatrixSet);
      return Object.assign(
        {},
        {
          ...meta,
          projection: grid.projection,
          tileGrid: {
            resolutions: grid.resolutions,
            matrixIds: grid.matrixIds,
            origin: grid.origin,
            tileSize: grid.tileSize
          }
        }
      );
    })
  ];

  return tileGrids;
};

const lonLat2Mercator = point => {
  return transform(point, "EPSG:4326", "EPSG:3857");
};

export { filterLayerSource, lonLat2Mercator };
