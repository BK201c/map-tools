/**
 * 以下所有参考数值均基于OGC标准下计算。
 * https://docs.opengeospatial.org/is/13-082r2/13-082r2.html#21
 */

import { WMTSCapabilities } from "@/core/ol";
import Proj from "./proj";

//获取tileGrid信息
const filterTileGridInfo = (TileMatrixSet: any) => {
  const matrixIds: number[] = [];
  const resolutions: number[] = [];
  let origin = [
    TileMatrixSet.TileMatrix[0].TopLeftCorner[1],
    TileMatrixSet.TileMatrix[0].TopLeftCorner[0],
  ];
  let tileSize = TileMatrixSet.TileMatrix[0].TileWidth || 256;
  let projection = "EPSG:" + TileMatrixSet.SupportedCRS.split("::")[1];
  TileMatrixSet.TileMatrix.forEach((matrix: any) => {
    const resolution = Proj.calcResolutionByScale(
      matrix.ScaleDenominator,
      Proj.isMercatorProjection(projection)
    );
    matrixIds.push(Number(matrix.Identifier));
    resolutions.push(resolution);
  });
  return {
    origin,
    projection: Proj.convertProjection(projection),
    matrixIds,
    resolutions,
    tileSize,
  };
};

//获取WMTS瓦片调用服务地址
const getTileUrl = (OperationsMetadata: any) =>
  OperationsMetadata.GetTile.DCP.HTTP.Get.filter(
    (l: any) => l.Constraint[0].AllowedValues.Value[0].toUpperCase() === "KVP"
  )[0].href;

// 获取图层组信息
const filterLayerSource = (xml: any) => {
  const parser = new WMTSCapabilities();
  const { Contents, OperationsMetadata } = parser.read(xml);
  const metaLayers = [
    ...Contents.Layer.map((layer: any) =>
      Object.assign(
        {},
        {
          layer: layer.Identifier,
          url: getTileUrl(OperationsMetadata),
          serviceType: "WMTS",
          style: layer.Style[0].Identifier,
          format: layer.Format[0],
          matrixSet: layer.TileMatrixSetLink[0].TileMatrixSet,
        }
      )
    ),
  ];

  const tileGrids = [
    ...metaLayers.map((meta: any) => {
      const [TileMatrixSet] = Contents.TileMatrixSet.filter(
        (e: any) => e.Identifier === meta.matrixSet
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
            tileSize: grid.tileSize,
          },
        }
      );
    }),
  ];

  return tileGrids;
};

export { filterLayerSource };
