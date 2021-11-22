import axios from "axios";
import WMTSMetaTools from "@/utils/WMTSXmlMeta";
import { LayerSource } from "@/views/preview/interface";

//通过mapserver获取XML文件
export const getLayerSourceByServer = async (url: string) => {
  const params = {
    SERVICE: "WMTS",
    REQUEST: "GetCapabilities",
    VERSION: "1.0.0",
  };
  try {
    const { data } = await axios.get(url.trim(), { params });
    const source = new WMTSMetaTools(data).layerInfoList;
    return source;
  } catch (error) {
    return error;
  }
};
