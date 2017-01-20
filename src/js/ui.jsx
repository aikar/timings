import {initializeTimeSelector} from "./ui/timeSelector";
import {chart} from "./ui/chart";
import * as data from "./data";

export function initializeUI() {

	$('.button').button();
	
	initializeCollapseControls();
	initializeTimeSelector();
	chart.initialize(data);
}


function initializeCollapseControls() {
	const $timingChildren = $('.full-timing-row .children');

	$timingChildren.each(function () {
		const $this = $(this);
		const $parent = $this.parent();
		$parent.find('> .row-wrap > .name').first().before("<div class='expand-control'>[+]</div> ");
		$parent.find('a').click(function(e) {
			try {
				history.replaceState({}, '', e.target.href);
				e.preventDefault();
				toggleTimings.call($this, $parent, e);
			} catch(er) {
				// your browser sucks, deal with flicker
				window.keepScroll = document.body.scrollTop;
			}
		});

		const $control = $parent.find('> .row-wrap > .expand-control').first();
		$parent.find('> .row-wrap').click(toggleTimings.bind($this, $parent));
		$control.click(toggleTimings.bind($this, $parent));
	});
}


export function toggleTimings($parent, e) {

	const $c = $parent.find('> .row-wrap > .expand-control').first();
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
	return false;
}

