<?php

/**
 * Contributed by willies952002 <admin@domnian.com>
 * 
 * @license MIT
 */

use Starlis\Timings\Json\TimingHandler;
use Starlis\Timings\Json\TimingsMaster;
use Starlis\Timings\Template;
use Starlis\Timings\util;

/**
 * @var TimingsMaster $timingsData
 */
$timingsData = TimingsMaster::getInstance();

echo '<pre>';
echo "Timings cost: $cost - " . ($cost * $totalTimings) . " - Pct: "
 . round(((($cost * $totalTimings) / ($timingsData->sampletime * 1000000000 / 100))), 2);
echo "%</pre>\n";

echo '<div class="plugin-view">';
echo '<h5>Installed Plugins:</h5>'."\n";

$plugins = $timingsData->plugins;

printRows($plugins);
echo '</div>';

/**
 * @param $depth
 * @param TimingHandler $l
 *
 * @return string
 */
function openRow($depth, $id) {
	static $i;
	$num = $depth % 5;
	$indents = "<div class='indent depth{$num} full-depth${depth}'></div>";
	echo "<div class='full-timing-row'>$indents<div id='$id' class='timing-row'><a href='#$id'># </a>";
}

function closeRow() {
	echo "</div></div>";
}

$processMap = [];

function printRows($plugins) {
	foreach ($plugins as $plugin) {
		openRow(0, $plugin->name);
		?>
		<span class='name'><?=htmlentities($plugin->name)?>  <sup class='plugin-version'>v<?=htmlentities($plugin->version)?> </sup></span><br>
		<div class="children">
			<?php
			if (!empty($plugin->authors)) {
				openRow(1, $plugin->name . "_authors");
			?>
			<span class='name'>Author(s)</span>: <?=htmlentities($plugin->authors)?><br>
			<?php
			closeRow();
		}
		if (!empty($plugin->description)) {
			openRow(1, $plugin->name . "_description");
			?>
				<span class='name'>Description</span>: <?=htmlentities($plugin->description)?><br>
			<?php
			closeRow();
		}
		//openRow(1, $plugin->name . "_cost");
		//closeRow();
		?>
		</div>
		<?php
		closeRow();
	}
}

function usage($tickAvg, $t1 = 25, $t2 = 15, $t3 = 5, $t4 = 1) {
	if ($tickAvg > $t1) {
		$tickAvg = "<span style='color:red'>$tickAvg<span>";
	} else if ($tickAvg > $t2) {
		$tickAvg = "<span style='color:orange'>$tickAvg</span>";
	} else if ($tickAvg > $t3) {
		$tickAvg = "<span style='color:yellow'>$tickAvg</span>";
	} else if ($tickAvg > $t4) {
		$tickAvg = "<span style='color:white'>$tickAvg</span>";
	}
	return $tickAvg;
}

function pluginCost($plugin = null) {
	return "<span style='color: grey;'>[PLUGIN COST]%</span>";
}
