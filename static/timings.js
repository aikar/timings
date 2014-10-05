/**
 * Spigot Timings Parser
 *
 * Written by Aikar <aikar@aikar.co>
 *
 * @license MIT
 */
window.adCount = 0;
$(document).ready(function () {
  $('#paste_toggle').click(function () {
    $('#paste').toggle();
  });
  $('.show_rest').click(function () {
    $(this).parent().find('.hidden').toggle();
  });

  $('#time-selector').slider({
    values:window.timingsData.history,
    range: true
  });

  $('.learnmore').button();

  setTimeout(function() {
    var adCount = $('.adsbygoogle').length;
    if (adCount) {
      $('<script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js">').appendTo("body");

      for (var i = 0; i < adCount; i++) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    }
  }, 1000)
});
function showInfo(btn) {
  $("#info-" + $(btn).attr('info')).dialog({width: "80%", modal: true});
}
