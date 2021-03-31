const tileGridExt = {
  /**
   * 获取分辨率数组
   * @param {Number} level 层级数
   * @param {Number} size 起始0层级的分辨率数值0.7031250000000002或1.4078260157100582
   * @returns {} resolutions, matrixIds
   */
  getResolutionByCalc: (level = 20, size = 0.7031250000000002) => {
    const matrixIds = [...Array(level + 1).keys()];
    const resolutions = [...matrixIds.map(l => size / Math.pow(2, l))];
    return { resolutions, matrixIds };
  },

  /**
   *
   * @param {*} tileInfo json内对象，包含resolution，level
   * @returns {resolutions, matrixIds, origin}
   */
  getResolutionByJson: tileInfo => {
    const matrixIds = [];
    const resolutions = [];
    tileInfo.lods.map(e => {
      resolutions.push(e.resolution);
      matrixIds.push(e.level);
    });
    const origin = [tileInfo?.origin?.x, tileInfo?.origin?.y];
    return { resolutions, matrixIds, origin };
  },

  /**
   * 计算中心点
   * @param  {...any} bbox xmin, ymin, xmax, ymax;
   * @returns {} center[lng,lat]
   */
  getCenterByCalc: (...bbox) => {
    if (!(bbox instanceof Array)) return;
    const [xmin, ymin, xmax, ymax] = [...bbox.map(c => parseFloat(c))];
    return [(xmax + xmin) / 2, (ymax + ymin) / 2];
  }
};

export default tileGridExt;
