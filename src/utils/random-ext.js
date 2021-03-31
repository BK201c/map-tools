const randomExt = {
  //生成图层随机状态
  createRandomProps() {
    let _customProps = {};
    const random = parseInt(Math.random() * 100);
    if (random % 2 === 0) {
      _customProps.status = 1;
    } else if (random % 3 === 0) {
      _customProps.status = 2;
    } else if (random % 5 === 0) {
      _customProps.status = 3;
    } else if (random % 7 === 0) {
      _customProps.status = 4;
    } else {
      _customProps.status = 5;
    }

    const random1 = parseInt(Math.random() * 100);
    if (random1 % 2 === 0) {
      _customProps.type = 3;
    } else if (random1 % 3 === 0) {
      _customProps.type = 2;
    } else {
      _customProps.type = 1;
    }

    const random2 = parseInt(Math.random() * 10);
    _customProps.device_type = random2;
    return _customProps;
  },

  /**
   * 根据Bbox范围生成随机点位
   * @params {minLng, maxLng, minLat, maxLat}
   */
  randomCoordByBbox(bbox) {
    let [minLng, minLat, maxLng, maxLat] = [
      ...bbox.split(",").map(e => parseFloat(e))
    ];
    const lng = minLng + (maxLng - minLng) * Math.random();
    const lat = minLat + (maxLat - minLat) * Math.random();
    return [lng, lat];
  },

  //根据中心点位计数返回随机点位
  randomCoordByCenter(centerStr, count = 100) {
    const center = centerStr.split(",");
    const [lng, lat] = [parseFloat(center[0]), parseFloat(center[1])];
    console.log(lng, lat);
    return [
      ...Array(count)
        .fill([])
        .map(() => [lng - Math.random(), lat - Math.random()])
    ];
  }
};

export default randomExt;
