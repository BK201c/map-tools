/**
 *
 * @param {*比例尺} scale
 * @param {*像素密度} dpi
 * @returns 地面分辨率
 */
export const calcResolutionByScale = (scale, dpi = 96) => {
  // 一个像素等于多少米距离（单位米）,OGC标准下单位像素距离
  const defaultPixelMeter = 0.0254000508;

  //天地图等三方服务商单位像素距离
  // const otherPixelMeter = 0.025399998;

  // 一度等于多少米距离单位（米）
  const erathRadius = 6371000;
  const degreeMeter = (Math.PI * 2 * erathRadius) / 360;
  console.log(degreeMeter);

  return (defaultPixelMeter * scale) / (dpi * degreeMeter);
};

const filter = {
  readXML: xmlStr => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlStr, "text/xml");

    //获取DOM节点
    const htmlNode = (dom, tagSelector) =>
      dom.getElementsByTagName(tagSelector);

    //获取layer节点信息
    const layerMeta = layer => {
      const selectorMap = new Map([
        ["layer", "ows:Title"],
        ["style", "Style"],
        ["format", "Format"],
        ["tileMatrixSet", "TileMatrixSet"]
      ]);
      let obj = {};
      selectorMap.forEach(
        (v, k) =>
          (obj[k] = layer?.getElementsByTagName(v)[0]?.textContent.trim())
      );
      return obj;
    };

    try {
      // 获取layer
      const [layer] = htmlNode(xmlDoc, "Contents Layer");
      return layerMeta(layer);
    } catch (error) {
      console.log(error);
    }
  }
};

export default filter;
