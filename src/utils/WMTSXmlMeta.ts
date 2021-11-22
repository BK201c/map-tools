import { WMTSCapabilities, optionsFromCapabilities } from "@/core/ol";

interface Config {
  layer: string;
  style?: string;
  matrixSet?: string;
  requestEncoding?: string;
  projection?: string;
  crossOrigin?: string | null | undefined;
}

class WMTSXmlMeta {
  static parser = new WMTSCapabilities();
  private XML: string | Element | Document;

  constructor(xml: string) {
    this.XML = xml;
  }

  get xml() {
    return this.XML;
  }

  get meta() {
    return WMTSXmlMeta.parser.read(this.xml);
  }

  get layerNameList(): string[] {
    const { Contents } = this.meta;
    return [...Contents.Layer.map((layer: any) => layer.Identifier)];
  }

  get layerInfoList() {
    return this.layerNameList.map((layer) => this.getLayerInfo({ layer }));
  }

  /**
   * 使用config过滤对应layer元数据
   * @param config layer--名称，矩形设定，样式，坐标系
   * @returns WMTS options
   */
  getLayerInfo(config: Config) {
    return optionsFromCapabilities(this.meta, config);
  }
}

export default WMTSXmlMeta;
