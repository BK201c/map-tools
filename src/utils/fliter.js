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
