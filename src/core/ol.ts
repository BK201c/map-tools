import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import WMTSTileGrid from "ol/tilegrid/WMTS";
import WMTS, { optionsFromCapabilities } from "ol/source/WMTS";
import WMTSCapabilities from "ol/format/WMTSCapabilities";
import XYZ from "ol/source/XYZ";
import TileGrid from "ol/tilegrid/TileGrid";

export {
  Map,
  View,
  TileLayer,
  WMTSTileGrid,
  WMTS,
  WMTSCapabilities,
  optionsFromCapabilities,
  XYZ,
  TileGrid,
};
