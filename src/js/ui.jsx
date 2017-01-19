import {initializeTimeSelector} from "./ui/timeSelector";
import {chart} from "./ui/chart";
import * as data from "./data";

export function initializeUI() {

	$('.button').button();
	$('#tab-bar').find('li').hover(function () {
		$(this).addClass('ui-state-hover');
	}, function () {
		$(this).removeClass('ui-state-hover');
	});

	initializeCollapseControls();
	initializeTimeSelector();
	chart.initialize(data);
}


function initializeCollapseControls() {
	var $timingChildren = $('.full-timing-row .children');

	$timingChildren.each(function () {
		var $this = $(this);
		var $parent = $this.parent();
		$parent.find('> .row-wrap > .name').first().before("<div class='expand-control'>[+]</div> ");

		var $control = $parent.find('> .row-wrap > .expand-control').first();
		$parent.find('> .row-wrap').bind("click", toggleTimings.bind($this, $parent));
		$control.bind("click", toggleTimings.bind($this, $parent));
	});
}


export function toggleTimings($parent) {
	var $c = $parent.find('> .row-wrap > .expand-control').first();
	if ($parent.data('shown')) {
		$parent.find('> .children').first().hide();
		$parent.data('shown', 0);
		$parent.addClass('show-children');
		$c.html('[+]');
	} else {
		$parent.find('> .children').first().show();
		$parent.data('shown', 1);
		$parent.removeClass('show-children');
		$c.html('[-]');
	}
}

