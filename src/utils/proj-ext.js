import Projection from "ol/proj/Projection";
import { register } from "ol/proj/proj4";
import proj4 from "proj4";

const EPSG4490 = () => {
  proj4.defs("EPSG:4490", "+proj=longlat +ellps=GRS80 +no_defs");
  register(proj4);
  return new Projection({
    code: "EPSG:4490",
    units: "degrees",
    axisOrientation: "neu"
  });
};

const projExt = wkid => {
  const proj = {
    3857: "EPSG:3857",
    4326: "EPSG:4326",
    4490: EPSG4490
  };
  return proj(wkid);
};

export default projExt;
