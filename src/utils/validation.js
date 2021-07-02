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
