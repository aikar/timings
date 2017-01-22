import {initializeTimeSelector} from "./ui/timeSelector";

export function initializeUI() {
	$('.button').button();
	initializeCollapseControls();
	initializeTimeSelector();
}


function initializeCollapseControls() {
	const $timingChildren = $('.full-timing-row .children');

	$timingChildren.each(function () {
		const $this = $(this);
		const $parent = $this.parent();
		$parent.find('> .row-wrap > .name').first().before("<div class='expand-control'>[+]</div> ");


		const $control = $parent.find('> .row-wrap > .expand-control').first();
		$parent.find('> .row-wrap').click(toggleTimings.bind($this, $parent));
		$control.click(toggleTimings.bind($this, $parent));
		$parent.find('> a').first().click(clickhandler.bind(null, toggleTimings.bind($this, $parent)));
	});
	$('.full-timing-row > .timing-row > a').click(clickhandler.bind(null, null));
	function clickhandler($cb, e) {
		try {
			history.replaceState({}, '', e.target.href);
			e.preventDefault();
			$cb && $cb();
		} catch(er) {
			// your browser sucks, deal with flicker
			window.keepScroll = document.body.scrollTop;
			console.error(er);
		}
	}
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

