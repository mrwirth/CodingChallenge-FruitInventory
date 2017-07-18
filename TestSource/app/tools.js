// https://github.com/uxitten/polyfill/blob/master/string.polyfill.js
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/repeat
exports.padEnd = function (str, targetLength, padString) {
  targetLength = targetLength>>0; //floor if number or convert non-number to 0;
  padString = String(padString || ' ');
  if (str.length > targetLength) {
    return String(str);
  }
  else {
    targetLength = targetLength-str.length;
    if (targetLength > padString.length) {
      padString += padString.repeat(targetLength/padString.length); //append to original to ensure we are longer than needed
    }
    return String(str) + padString.slice(0,targetLength);
  }
}

// From https://bost.ocks.org/mike/shuffle/
exports.shuffle = function(array) {
  let m = array.length, t, i;
  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);
    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}

// From https://stackoverflow.com/a/11383334
// Gamma values > 1 will bias leftward, < 1 rightward.
exports.gammaDistribution = function (gamma) {
    return Math.pow(Math.random(), gamma);    // mix full range and bias
}