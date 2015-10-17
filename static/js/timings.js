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
	// TODO: when this damn system actually is 'done enough' one day... clean up this nightmare file more.
	// I'm sorry for this nasty mess... :( Just trying to get it done as hacky and fast as possible as I
	// Don't have the time to work on it! :(
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
			updateRanges(start, end);
			goRange();
		}
	});

	updateRanges(start, end);

	var labels = [];


	var scales = {
		"Entities": 10000,
		"Tile Entities": 25000,
		"Chunks": 3000,
		"Players": 100,
		"TPS": 20
	};

	function initializeData() {
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
	}
	initializeData();
	function initializeChart() {
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
	}

	initializeChart();
	function initializeTimeSelector() {
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


	}
	initializeTimeSelector();


	$('.button').button();

	setTimeout(initializeAds, 1000);
	initializeIndentStyles();
	initializeCollapseControls();
	$(window).on('hashchange', checkHashLoc);
	checkHashLoc();
});

function initializeCollapseControls() {
	var $timingChildren = $('.full-timing-row .children');

	$timingChildren.each(function () {
		var $this = $(this);
		var $parent = $this.parent();
		$parent.find(' > .name').first().before("<div class='expand-control'>[+]</div> ");

		var $control = $parent.find(' > .expand-control').first();
		$control.bind("click", expandTimings.bind($this, $parent));
	});
}
function expandTimings($parent) {
	$parent.find('> .children').first().show();
	var $c = $parent.find(' > .expand-control').first()
	$c.unbind('click');
	$c.html('[-]');
	$c.bind('click', collapseTimings.bind(this, $parent));
}
function collapseTimings($parent) {
	$parent.find('> .children').first().hide();
	var $c = $parent.find(' > .expand-control').first();
	$c.unbind('click');
	$c.html('[+]');
	$c.bind('click', expandTimings.bind(this, $parent));
}


function checkHashLoc() {
	var hash = location.hash;
	if (!hash || hash.length < 2) {
		return;
	}

	var el = $(hash);
	if (!el || !el.length) {
		return;
	}
	expandTimings(el);

	do {
		for (var i = 0; i < 3; i++) {
			if (el) {
				el = el.parent();
			}
		}
		if (el && el.find('> .expand-control').length) {
			expandTimings(el);
		} else {
			break;
		}
	} while (el);
	$('html, body').animate({
		scrollTop: $(hash).offset().top
	}, 500);
}
function initializeIndentStyles() {
	$(".indent").mouseenter(function () {
		var classes = this.className.split(/\s+/);
		var depthclass;
		for (var i of classes) {
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
	}).mouseleave(function () {
		$("#depth-view").html("");
		$("#depth-view-bg").css("display", "none");
	});
}
