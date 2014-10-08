/**
 * Spigot Timings Parser
 *
 * Written by Aikar <aikar@aikar.co>
 *
 * @license MIT
 */

$(document).ready(function () {
  $('#paste_toggle').click(function () {
    $('#paste').toggle();
  });
  $('.show_rest').click(function () {
    $(this).parent().find('.hidden').toggle();
  });
  var data = window.timingsData || {
    ranges:[],
    start: 1,
    end: 1,
    maxTime: 1
  };
  var values = data.ranges;
  var start = data.start;
  var end = data.end;

  $('#time-selector').slider({
    min: 0,
    max: values.length - 1,
    values: [values.indexOf(start), values.indexOf(end)],
    range: true,
    slide: function(event, ui) {
      start = values[ui.values[0]];
      end = values[ui.values[1]];
      updateRanges();
      goRange();
    }
  });

  updateRanges();

  var labels = [];



  data.timestamps.forEach(function(k) {
    var d = new Date(k*1000);
    labels.push(d.toLocaleString());
  });
  data.tpsData.forEach(function(tps, i) {
    data.tpsData[i] = (tps/20)*data.maxTime
  });


  chart('#tps-graph').Line({
    labels: labels,
    datasets: [
      {
        data:[data.maxTime],
        PointDotRadius: 0,
        pointStrokeWidth: 0
      },
      {
        label: "TPS",
        fillColor: "rgba(147,69,209,.3)",
        strokeColor: "rgba(147,69,249,.7)",
        pointColor: "purple",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(220,220,220,1)",
        data: data.tpsData
      },{
        label: "LAG",
        fillColor: "rgba(230,20,20,0.2)",
        strokeColor: "rgba(255,60,60,1)",
        pointColor: "rgba(255,150,150,1)",
        pointStrokeColor: "#ff5533",
        pointHighlightFill: "#ff5533",
        pointHighlightStroke: "rgba(151,187,205,1)",
        data: data.lagData
      }
    ]
  }, {
    legendTemplate: "",
    showScale: false,
    responsive: true,
    maintainAspectRatio: false,
    multiTooltipTemplate: function(v) {
      if (v.datasetLabel == "TPS") {
        return (Math.round(v.value / data.maxTime * 20 * 100)/100) + " TPS";
      } else if (v.datasetLabel == "LAG") {
        return Math.round((v.value/data.maxTime)*100) + "% TPS Loss";
      } else {
        return ""
      }
    }
  });

  /*chart('#xlag-graph').Line({
    labels:labels,
    datasets: [
      {
        label:"Lag",

      }
    ]
  });*/


  var redirectTimer = 0;
  $('#time-selector').click(function(){
    if (redirectTimer) {
      clearTimeout(redirectTimer);
      redirectTimer = 0;
    }
  });
  function goRange() {
    if (redirectTimer) {
      clearTimeout(redirectTimer);
    }
    redirectTimer = setTimeout(function() {
      window.location = "?id=" + data.id + "&start=" + start + "&end=" + end;
    }, 1000);
  }
  function updateRanges() {
    var startDate = new Date(start*1000);
    var endDate = new Date(end*1000);

    $('#start-time').text(startDate.toLocaleString());
    $('#end-time').text(endDate.toLocaleString());
  }

  $('.button').button();

  setTimeout(function() {
    var adCount = $('.adsbygoogle').length;
    if (adCount) {
      $('<script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js">').appendTo("body");

      for (var i = 0; i < adCount; i++) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    }
  }, 1000);

  function chart(id) {
    return new Chart($(id).get(0).getContext("2d"));
  }
  function getMin(array){
    return Math.min.apply(Math,array);
  }

  function getMax(array){
    return Math.max.apply(Math,array);
  }
});


function showInfo(btn) {
  $("#info-" + $(btn).attr('info')).dialog({width: "80%", modal: true});
}
