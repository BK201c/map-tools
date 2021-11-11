var collect = require("@turf/turf");

function mercator2lonlat(mercator) {
  var lonlat = { x: 0, y: 0 };
  var x = (mercator.x / 20037508.34) * 180;
  var y = (mercator.y / 20037508.34) * 180;
  y =
    (180 / Math.PI) *
    (2 * Math.atan(Math.exp((y * Math.PI) / 180)) - Math.PI / 2);
  lonlat.x = x;
  lonlat.y = y;
  return lonlat;
}

function lonlat2mercator(lonlat) {
  var mercator = { x: 0, y: 0 };
  var x = (lonlat.x * 20037508.34) / 180;
  var y =
    Math.log(Math.tan(((90 + lonlat.y) * Math.PI) / 360)) / (Math.PI / 180);
  y = (y * 20037508.34) / 180;
  mercator.x = x;
  mercator.y = y;
  return mercator;
}

function lonLat2Mercator1(coordinates) {
  const [lon, lat] = coordinates;
  const x = (lon * 20037508.34) / 180;
  const y =
    ((Math.log(Math.tan(((90 + lat) * Math.PI) / 360)) / (Math.PI / 180)) *
      20037508.34) /
    180;
  return [x, y];
}

// function lonLat2Mercator(point) {
//   var pt = turf.point(point);
//   var converted = turf.toMercator(pt);
//   return turf.getCoord(converted);
// }

const point = { x: 120.56327819824219, y: 31.304368451830978 };
console.log(
  lonlat2mercator(point),
  lonLat2Mercator1([120.56327819824219, 31.304368451830978])
);
