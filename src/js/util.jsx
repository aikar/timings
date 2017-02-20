export function getMin(array) {
  return Math.min.apply(Math, array);
}

export function getMax(array) {
  return Math.max.apply(Math, array);
}

export function htorgba(hex, alpha) {
  if (alpha == undefined) alpha = 1;
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? "rgba(" +
    parseInt(result[1], 16) + "," +
    parseInt(result[2], 16) + "," +
    parseInt(result[3], 16) + "," + alpha + ")"
    : hex;
}

export function getQueryParam(name, def) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
  return results === null ?
    def
    :
    decodeURIComponent(results[1].replace(/\+/g, " "));
}

export function showInfo(btn) {
  $("#info-" + $(btn).attr('info')).dialog({width: "80%", modal: true});
}
