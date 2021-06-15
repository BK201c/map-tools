/**
 * 以下所有参考数值均基于OGC标准下计算。
 * https://docs.opengeospatial.org/is/13-082r2/13-082r2.html#21
 */

import * as turf from "@turf/turf";

/**
 * 判断是否是web墨卡托平面坐标
 * @param {*} projection
 * @returns boolen
 */
export const isMercatorProjection = projection => {
  const degreeIndex = ["EPSG:4326", "EPSG:4490", "wgs84"];
  const mercatorIndex = ["EPSG:3857", "EPSG:900913"];
  return (
    mercatorIndex.includes(projection) && !degreeIndex.includes(projection)
  );
};

/**
 *
 * @param {*比例尺} scale
 * @param {*坐标系统} crs
 * @param {*像素密度} dpi
 * @returns 地面分辨率
 */
const calcResolutionByScale = (scale, crs = 4326) => {
  // 一个像素等于多少米距离（单位米）,OGC标准下单位像素距离
  const defaultPixelMeter = 0.0254;

  //天地图等三方服务商单位像素距离
  // const otherPixelMeter = 0.025399998;

  //地球半径
  const erathRadius = 6378137;

  // 当投影坐标系为（EPSG:4326,EPSG:4490时）地图单位（度/米），一度等于多少米距离单位（米），当地理坐标系为WGS84时，地图单位为度
  const degreeMeter = (Math.PI * 2 * erathRadius) / 360;

  // 当投影坐标系为（EPSG：3857，EPSG:90013时）地图单位（米）
  const meter = 1;

  // 地图单位
  const units = isMercatorProjection(crs) ? meter : degreeMeter;

  // OGC标准中没有规定屏幕分辨率（pixel/inch），而是用像元大小（0.28mm=0.00028m）来界定，WMTS 1.0.0接口，每英寸像元数为：1inch/(0.00028m/0.0254(m/inch))=0.0254/0.00028≈90.714
  const dpi = isMercatorProjection(crs) ? 90.71428571428572 : 96;

  return (defaultPixelMeter * scale) / (dpi * units);
};

//获取layer节点信息
export const filterLayerInfo = layer => {
  return new Promise((resolve, reject) => {
    let obj = {
      layer: layer.Identifier,
      style: layer.Style[0]?.Identifier,
      format: layer.Format[0],
      matrixSet: layer.TileMatrixSetLink[0]?.TileMatrixSet
    };
    if (!layer) {
      reject(layer, "提供了错误的参数");
    }
    resolve(obj);
  });
};

//获取tileGrid信息
export const filterTileGridInfo = TileMatrixSet => {
  const matrixIds = [];
  const resolutions = [];
  const projection = "EPSG:" + TileMatrixSet.SupportedCRS?.split("::")[1];
  let origin = TileMatrixSet.TileMatrix[0]?.TopLeftCorner.reverse();
  if (projection === "EPSG:3857") origin = origin.reverse();
  TileMatrixSet.TileMatrix.forEach(matrix => {
    matrixIds.push(Number(matrix.Identifier));
    resolutions.push(
      calcResolutionByScale(matrix?.ScaleDenominator, projection)
    );
  });
  return {
    origin,
    projection,
    matrixIds,
    resolutions
  };
};

export const lonLat2Mercator = point => {
  var pt = turf.point(point);
  var converted = turf.toMercator(pt);
  return turf.getCoord(converted);
};
