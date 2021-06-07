function getBoundsAndMaxResForWMTS(
  scaleDenominator,
  topLeftCorner,
  tileWidth,
  matrixWidth,
  tileHeight,
  matrixHeight
) {
  var standardizedRenderingPixelSize = 0.00028;

  var widthPixel = tileWidth * matrixWidth;
  var heightPixel = tileHeight * matrixHeight;

  var right =
    scaleDenominator * widthPixel * standardizedRenderingPixelSize +
    topLeftCorner.x;
  var bottom =
    topLeftCorner.y -
    scaleDenominator * heightPixel * standardizedRenderingPixelSize;

  // var bounds = new OpenLayers.Bounds(
  //   topLeftCorner.x,
  //   bottom,
  //   right,
  //   topLeftCorner.y
  // );
  var maxResolutionW = Math.round((right - topLeftCorner.x) / widthPixel);
  var maxResolutionH = Math.round((topLeftCorner.y - bottom) / heightPixel);

  if (maxResolutionW !== maxResolutionH) {
    throw new Error("Could not calculate ");
  }

  return maxResolutionW;

  // return {
  //   bounds: bounds,
  //   maxResolution: maxResolutionW
  // };
}

let result = getBoundsAndMaxResForWMTS(
  750000.0,
  { x: 115.417317, y: 41.059238 },
  256,
  256,
  5,
  4
);

console.log(result);
