/*
 * Aikar's Minecraft Timings Parser
 *
 * Written by Aikar <aikar@aikar.co>
 * http://aikar.co
 * http://starlis.com
 *
 * @license MIT
 */
//$(document).foundation();
$(document).ready(function () {
	var data = window.timingsData || {
			ranges: [],
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
		slide: function (event, ui) {
			start = values[ui.values[0]];
			end = values[ui.values[1]];
			updateRanges();
			goRange();
		}
	});

	updateRanges();

	var labels = [];


	var scales = {
		"Entities": 10000,
		"Tile Entities": 25000,
		"Chunks": 3000,
		"Players": 100,
		"TPS": 20
	};

	data.stamps.forEach(function (k) {
		var d = new Date(k * 1000);
		labels.push(d.toLocaleString());
	});
	data.tpsData.forEach(function (tps, i) {
		data.tpsData[i] = (tps / scales.TPS) * data.maxTime
	});
	data.plaData.forEach(function (count, i) {
		data.plaData[i] = (count / scales.Players) * data.maxTime
	});
	data.tentData.forEach(function (count, i) {
		data.tentData[i] = (count / scales["Tile Entities"]) * data.maxTime
	});
	data.entData.forEach(function (count, i) {
		data.entData[i] = (count / scales.Entities) * data.maxTime
	});
	data.chunkData.forEach(function (count, i) {
		data.chunkData[i] = (count / scales.Chunks) * data.maxTime
	});


	chart('#tps-graph').Line({
		labels: labels,
		datasets: [
			{
				data: [data.maxTime],
				PointDotRadius: 0,
				pointStrokeWidth: 0
			},
			{
				label: "TPS",
				//fillColor: "rgba(145,255,156,.6)",
				//fillColor: htorgba("136b06", .8),
				fillColor: htorgba("#ABFFA8", .8),
				strokeColor: "rgba(16,109,47,.7)",
				pointColor: "rgba(16,109,47,.7)",
				pointStrokeColor: "#fff",
				pointHighlightFill: "#fff",
				pointHighlightStroke: "rgba(220,220,220,1)",
				data: data.tpsData
			}, {
				label: "LAG",
				//fillColor: htorgba("8d0707",0.8),
				fillColor: htorgba("ff8e01", 0.8),
				strokeColor: "rgba(255,60,60,1)",
				pointColor: "rgba(255,60,60,1)",
				pointStrokeColor: "#ff5533",
				pointHighlightFill: "#ff5533",
				pointHighlightStroke: "rgba(151,187,205,1)",
				data: data.lagData
			},
			{
				label: "Players",
				fillColor: "rgba(0,0,0,0)",
				pointColor: "#4F80FF",
				pointStrokeColor: "#DBF76A",
				data: data.plaData
			},
			{
				label: "Tile Entities",
				fillColor: "rgba(0,0,0,0)",
				pointColor: "#DBF76A",
				pointStrokeColor: "#DBF76A",
				data: data.tentData
			},
			{
				label: "Entities",
				fillColor: "rgba(0,0,0,0)",
				pointColor: "#84E2FF",
				pointStrokeColor: "#84E2FF",
				data: data.entData
			},
			{
				label: "Chunks",
				fillColor: "rgba(0,0,0,0)",
				pointColor: "#9324B5",
				pointStrokeColor: "#9324B5",
				data: data.chunkData
			}
		]
	}, {
		animation: false,
		legendTemplate: "",
		showScale: false,
		pointHitDetectionRadius: 2,
		responsive: true,
		maintainAspectRatio: false,
		multiTooltipTemplate: function (v) {
			if (v.datasetLabel == "LAG") {
				return Math.round((v.value / data.maxTime) * 100) + "% TPS Loss";
			} else {
				return (Math.round(v.value / data.maxTime * scales[v.datasetLabel] * 100) / 100) + " " + v.datasetLabel;
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
	$('#time-selector').click(function () {
		if (redirectTimer) {
			clearTimeout(redirectTimer);
			redirectTimer = 0;
		}
	});
	function goRange() {
		if (redirectTimer) {
			clearTimeout(redirectTimer);
		}
		redirectTimer = setTimeout(function () {
			var all = getQueryParam('all');
			if (all) {
				all = '&all=' + all;
			} else {
				all = '';
			}
			window.location = "?id=" + data.id + "&start=" + start + "&end=" + end + all;

		}, 1000);
	}

	function updateRanges() {
		var startDate = new Date(start * 1000);
		var endDate = new Date(end * 1000);

		$('#start-time').text(startDate.toLocaleString());
		$('#end-time').text(endDate.toLocaleString());
	}

	$('.button').button();

	setTimeout(function () {
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

	function getMin(array) {
		return Math.min.apply(Math, array);
	}

	function getMax(array) {
		return Math.max.apply(Math, array);
	}

	function htorgba(hex, alpha) {
		if (alpha == undefined) alpha = 1;
		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result ? "rgba(" +
		parseInt(result[1], 16) + "," +
		parseInt(result[2], 16) + "," +
		parseInt(result[3], 16) + "," + alpha + ")"
			: hex;
	}

	$(".indent").mouseenter(function() {
		var classes = this.className.split(/\s+/);
		var depthclass;
		for (var i in classes) {
			if (classes[i].startsWith("full-depth")) {
				depthclass = classes[i];
				break;
			}
		}
		var depth = parseInt(depthclass.replace("full-depth", ""));
		var view = $("#depth-view");
		view.html("Depth: " + depth);
		var styles = {
			height: view.css("height"),
			width: view.css("width"),
			display: "block"
		};
		$("#depth-view-bg").css(styles);
	}).mouseleave(function() {
		$("#depth-view").html("");
		$("#depth-view-bg").css("display", "none");
	});

	var $timingChildren = $('.full-timing-row .children');

	$timingChildren.each(function() {
		var $this = $(this);
		var $parent = $this.parent();
		$parent.find(' > .name').first().before("<div class='expand-control'>[+]</div> ");

		var $control = $parent.find(' > .expand-control').first();
		$control.bind("click", expandTimings.bind($this, $parent, $control));
	});
});

function expandTimings($p, $c) {
	this.show();
	$c.unbind('click');
	$c.html('[-]');
	$c.bind('click', collapseTimings.bind(this, $p, $c));
}
function collapseTimings($p, $c) {
	this.hide();
	$c.unbind('click');
	$c.html('[+]');
	$c.bind('click', expandTimings.bind(this, $p, $c));
}
function getQueryParam(name, def) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
		results = regex.exec(location.search);
	return results === null ?
		def
		:
		decodeURIComponent(results[1].replace(/\+/g, " "));
}

function showInfo(btn) {
	$("#info-" + $(btn).attr('info')).dialog({width: "80%", modal: true});
}
