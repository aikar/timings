<?php
use Starlis\Timings\Json\TimingHandler;
use Starlis\Timings\Json\TimingsMaster;
use Starlis\Timings\Template;
use Starlis\Timings\util;

/**
 * @var TimingsMaster $timingsData
 */
$timingsData = TimingsMaster::getInstance();
$tpl = Template::getInstance();

global $totalTime;
$totalTime = 0;
$totalTimings = 0;
foreach ($timingsData->data as $data) {
	$totalTime += $data->totalTime;
	//var_dump($data->minuteReports);
	foreach ($data->handlers as $handler) {
		$totalTimings += $handler->count;
	}
}

global $section, $propTotal, $propCount;
define('LAG_ONLY', $section === 'lagsummary');
$propTotal = LAG_ONLY ? 'lagTotal' : 'total';
$propCount = LAG_ONLY ? 'lagCount' : 'count';
define('NOFILTER', !empty(util::array_get($_GET['nofilter'])));
$lag = $tpl->handlerData;

?>
<div class="full-timing-row">
	<div class="indent depth1 full-depth1"></div>
	<div class="timing-row">
	</div>
</div>
<?php
usort($lag, 'lagSort');
printRows($lag, 1);

$cost = $timingsData->system->timingcost * 1.1;
echo '<pre>';
echo "Timings cost: $cost - " . ($cost * $totalTimings) . " - Pct: "
	. round(((($cost * $totalTimings) / ($timingsData->sampletime * 1000000000 / 100))), 2) . "%\n\n";
echo '</pre>';

function printRecord($l) {
	global $propCount, $propTotal;
	$tpl = Template::getInstance();
	$totalTicks = $tpl->masterHandler->{$propCount};
	if (!$totalTicks) {
		util::var_dump($tpl->masterHandler);
		return;
	}
	$totalTime = $tpl->masterHandler->{$propTotal};


	$total = (int) $l->{$propTotal};
	$count = (int) $l->{$propCount};
	if ($count === 0) {
		return;
	}

	$avg = round(($total / $count) / 1000000, 4);
	$tickAvg = round($avg * ($count / $totalTicks), 4);


	$totalPct = round(($total / $totalTime) * 100, 2);
	if ($l->id->name === "Full Server Tick") { // always 100%
		$totalPct = pctView($totalPct, 200, 200, 200, 200);
		$pctOfTick = pctView($tickAvg / 50 * 100, 90, 80, 75, 70);
	} else {
		$tickAvgMod = $tickAvg / 50 * 100;
		if ($tickAvgMod) {
			$tickAvgMod = $totalPct / $tickAvgMod;
		} else {
			$tickAvgMod = 0;
		}
		$totalPct = pctViewMod($totalPct, $tickAvgMod, 50, 30, 20, 10);

		$pctOfTick = pctView($tickAvg / 50 * 100, 50, 30, 20, 10);
	}
	$avgCountTick = number_format($count / $totalTicks, 2);

	$tickAvg = pctView($tickAvg);
	$avg = pctView($avg);
	$name = cleanName($l->id);
	$total = round($total / 1000000000, 3);


	echo "
<div class='row-wrap'>
	<div class='name' style>$name</div>

	<div class='row-info'>

		<div class='row-info-total'>count(<span class='count'>$count</span>)
		total(<span class='totalPct'>$totalPct%</span> <span class='totalTime'>{$total}s</span>, <span class='pctOfTick'>{$pctOfTick}% of tick</span>)
		</div>

		<div class='row-info-avg'>
		avg(<span class='avgMs'>{$avg}ms</span> per - <span class='tickAvgMs'>{$tickAvg}ms/$avgCountTick per tick</span>)
		</div>

	</div>
</div>
		\n";
}

/**
 * @param $depth
 * @param TimingHandler $l
 *
 * @return string
 */
function openRow($depth, $l) {
	static $i;
	$id = $l->id->id . "_" . $i++;
	$num = $depth % 5;
	$indents = "<div class='indent depth{$num} full-depth${depth}'></div>";

	echo "<div class='full-timing-row'>$indents<div id='$id' class='timing-row'><a href='#$id'>#</a>";
}
function closeRow() {
	echo "</div></div>";
}


function cleanName($name) {
	static $replacements = [
		['/net\.minecraft\.server\.v[^\.]+\./', 'nms.'],
		['/org\.bukkit\.craftbukkit\.v[^\.]+\./', 'obc.'],
	];
	$orig = $name;
	foreach ($replacements as $pattern) {
		$name = preg_replace($pattern[0], $pattern[1], $name);
	}
	$name = preg_replace_callback('/Event: ([a-zA-Z0-9\.]+) /', 'condensePackage', $name);
	return "<span title='$orig'>$name</span>";
}
function condensePackage($v) {

	$name = explode('.', $v[1]);
	$last = array_pop($name);
	$name = array_map(function($v) { return $v[0]; }, $name);
	$name[] = $last;
	return 'Event: ' .implode('.', $name).' ';
}

$processMap = [];
function printRows($lag, $level) {
	global $processMap;
	$tpl = Template::getInstance();
	foreach ($lag as $l) {

		if (($l->total < 500000 || (LAG_ONLY && $l->lagTotal < 500000)) && !NOFILTER) {
			continue;
		}

		$lagTicks = (int) $tpl->masterHandler->lagCount;
		$count = (int) (LAG_ONLY ? $l->lagCount : $l->count);
		if ($count === 0 || (LAG_ONLY && $lagTicks === 0)) {
			continue;
		}
		if (isset($_GET['filtername'])) {
			$filter = $_GET['filtername'];
			$name = cleanName($l->id);
			if (stripos($name, $filter) === false) continue;
		}

		openRow($level, $l);
		printRecord($l);
		$id = $l->id->id;
		$h = $tpl->handlerData[$id];

		if (false && !empty($h->children) && ++$processMap[$id] == 1) {
			if (!NOFILTER) {
				$children = array_filter($h->children, 'lagFilter');
			} else {
				$children = $h->children;
			}
			if (!empty($children)) {
				$children = array_map(function($v) {
					$tpl = Template::getInstance();
					$h = $tpl->handlerData[$v->id->id];
					$v->children = $h->children;
					return $v;
				}, $children);
				usort($children, 'lagSort');
				echo '<div class="children">';
				printRows($children, $level + 1);
				echo '</div>';
			}
			--$processMap[$id];
		}
		closeRow();
	}
}

function lagFilter($e) {
	$e->avg = 0;
	$count = LAG_ONLY ? $e->lagCount : $e->count;
	$total = LAG_ONLY ? $e->lagTotal : $e->total;
	if ($count > 0) {
		$e->avg = ($total / $count) * $e->mergedCount;
	}

	return $total > 5;
}

function lagSort($a, $b) {
	//return $a->avg > $b->avg ? -1 : 1;
	$total = LAG_ONLY ? 'lagTotal' : 'total';
	return $a->$total > $b->$total ? -1 : 1;
}
function pctView($val, $t1 = 25, $t2 = 15, $t3 = 5, $t4 = 1) {
	return pctViewMod($val, 1, $t1, $t2, $t3, $t4);
}
function pctViewMod($val, $mod = 1, $t1 = 25, $t2 = 15, $t3 = 5, $t4 = 1) {
	$valnum = number_format($val, 2);
	$val *= $mod;
	if ($val > $t1) {
		$valnum = "<span class='warn-high'>$valnum</span>";
	} else if ($val > $t2) {
		$valnum = "<span class='warn-med'>$valnum</span>";
	} else if ($val > $t3) {
		$valnum = "<span class='warn-low'>$valnum</span>";
	} else if ($val > $t4) {
		$valnum = "<span class='warn-none'>$valnum</span>";
	}

	return $valnum;
}
