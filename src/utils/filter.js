import * as jsdom from "jsdom";
/**
 *
 * @param {*比例尺} scale
 * @param {*坐标系统} crs
 * @param {*像素密度} dpi
 * @returns 地面分辨率
 */
const calcResolutionByScale = (scale, crs = 4326, dpi = 96) => {
  // 一个像素等于多少米距离（单位米）,OGC标准下单位像素距离
  const defaultPixelMeter = 0.0254000508;

  //天地图等三方服务商单位像素距离
  // const otherPixelMeter = 0.025399998;

  //地球半径
  const erathRadius = 6378137;

  // 当投影坐标系为（EPSG:4326,EPSG:4490时）地图单位（度/米），一度等于多少米距离单位（米），当地理坐标系为WGS84时，地图单位为度
  const degreeMeter = (Math.PI * 2 * erathRadius) / 360;

  // 当投影坐标系为（EPSG：3857，EPSG:90013时）地图单位（米）
  const meter = 1;

  // 地图单位
  let units;
  const degreeIndex = [4326, 4490, "wgs84"];
  const meterIndex = [3857, 90013];

  if (meterIndex.includes(crs)) {
    units = meter;
  } else if (degreeIndex.includes(crs)) units = degreeMeter;

  return (defaultPixelMeter * scale) / (dpi * units);
};

//获取layer节点信息
const filterLayerMeta = layerDomNode => {
  const selectorMap = new Map([
    ["layer", "ows:Title"],
    ["style", "Style"],
    ["format", "Format"],
    ["tileMatrixSet", "TileMatrixSet"]
  ]);
  let obj = {};
  selectorMap.forEach(
    (v, k) =>
      (obj[k] = layerDomNode?.getElementsByTagName(v)[0]?.textContent.trim())
  );
  return obj;
};

//获取tileGrid信息
const filterTileGridMeta = tileMatrixSetDomNode => {
  const scale = [];
  const matrixIds = [];
  let origin = [];
  let crs = tileMatrixSetDomNode
    .getElementsByTagName("ows:SupportedCRS")[0]
    .textContent.split("::")[1];
  const tileMatrixList = tileMatrixSetDomNode.getElementsByTagName(
    "TileMatrix"
  );
  origin = tileMatrixList[0]
    .getElementsByTagName("TopLeftCorner")
    .split(" ")
    .reverse();
  for (const tileMatrix of tileMatrixList) {
    scale.push(
      tileMatrix.getElementsByTagName("ScaleDenominator")[0].textContent
    );
    matrixIds.push(
      tileMatrix.getElementsByTagName("ows:Identifier")[0].textContent
    );
  }
  const resolutions = [...scale.map(s => calcResolutionByScale(s, crs))];
  return {
    origin,
    crs,
    matrixIds,
    resolutions
  };
};

const filter = {
  readXML: xmlStr => {
    const { JSDOM } = jsdom;
    const { window } = new JSDOM(xmlStr);
    const xmlDoc = window.document;
    console.log(xmlDoc);

    //获取DOM节点
    const htmlNode = (dom, tagSelector) =>
      dom.getElementsByTagName(tagSelector);

    try {
      // 获取layer
      const [layer] = htmlNode(xmlDoc, "Contents Layer");
      const layerMeta = filterLayerMeta(layer);
      const tileMatrixSetList = htmlNode(xmlDoc, "Contents TileMatrixSet");
      let tileGrid = {};
      debugger;
      for (const currentTileMatrixSet of tileMatrixSetList) {
        if (
          htmlNode(currentTileMatrixSet, "ows:Identifier")[0]?.textContent ===
          layerMeta.tileMatrixSet
        ) {
          tileGrid = filterTileGridMeta(currentTileMatrixSet);
        }
      }
      console.log(tileGrid);
      return tileGrid;
    } catch (error) {
      console.log(error);
    }
  }
};

export default filter;
