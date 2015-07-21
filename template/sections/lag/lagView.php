<?php
use Starlis\Timings\Json\TimingHandler;
use Starlis\Timings\Json\TimingsMaster;
use Starlis\Timings\Template;

/**
 * @var TimingsMaster $timingsData
 */
$timingsData = TimingsMaster::getInstance();
$tpl = Template::getInstance();

$totalTime = 0;
$totalTimings = 0;
foreach ($timingsData->data as $data) {
	$totalTime += $data->totalTime;
	//var_dump($data->minuteReports);
	foreach ($data->handlers as $handler) {
		$totalTimings += $handler->count;
	}
}

$cost = $timingsData->system->timingcost;
echo '<pre>';
echo "totalTime: $totalTime - Timings cost: $cost - " . ($cost * $totalTimings) . " - Pct: "
	. round(((($cost * $totalTimings) / ($timingsData->sampletime * 1000000000 / 100))), 2) . "%\n\n";


//http://timings.aikar.co/dev/?id=2a72cf2099e0439780c91e64abadcf7d&start=1436841958&end=1436843422
$lag = $tpl->masterHandler->children;

printRecord($tpl->masterHandler);
usort($lag, 'lagSort');
printRows($lag, 1);

echo '</pre>';

function printRecord($l) {
	static $i;
	$tpl = Template::getInstance();
	$lagTicks = $tpl->masterHandler->lagCount;
	$ticks = $tpl->masterHandler->count;

	$id = $l->id->id . "_" . $i++;
	$avg = round(($l->lagTotal / $l->lagCount) / 1000000, 4);
	$tickAvg = round($avg * ($l->lagCount / $lagTicks), 4);
	$tickAvg = lagView($tickAvg);
	$avg = lagView($avg);
	echo "<a id='$id' href='#$id'>#</a>" . $l->id . " - count(" . $l->lagCount . ") - total(" .
		round($l->lagTotal / 1000000000, 3) . "s) - avg({$avg}ms - {$tickAvg}ms)\n";
}

function printRows($lag, $level) {
	$tpl = Template::getInstance();
	foreach ($lag as $l) {
		if ($l->lagTotal < 500000) {
			continue;
		}
		echo str_repeat("\t", $level);

		printRecord($l);
		$h = $tpl->handlerData[$l->id->id];

		if (!empty($h->children) && empty($h->processed)) {
			$h->processed = true;
			$children = array_filter($h->children, 'lagFilter');
			if (!empty($children)) {
				$children = array_map('mapToHandler', $children);
				usort($children, 'lagSort');
				printRows($children, $level + 1);
			}
		}
	}
}

function mapToHandler($v) {
	$tpl = Template::getInstance();

	return $tpl->handlerData[$v->id->id];
}

function lagFilter($e) {
	$e->avg = 0;
	if ($e->lagCount > 0) {
		$e->avg = ($e->lagTotal / $e->lagCount) * $e->mergedCount;
	}

	return $e->lagTotal > 10 && $e->avg > 20000;
}

function lagSort($a, $b) {
	//return $a->avg > $b->avg ? -1 : 1;
	return $a->lagTotal > $b->lagTotal ? -1 : 1;
}

function lagView($tickAvg, $t1 = 25, $t2 = 15, $t3 = 5, $t4 = 1) {
	if ($tickAvg > $t1) {
		$tickAvg = "<span style='color:red'>$tickAvg</span>";
	} else if ($tickAvg > $t2) {
		$tickAvg = "<span style='color:orange'>$tickAvg</span>";
	} else if ($tickAvg > $t3) {
		$tickAvg = "<span style='color:yellow'>$tickAvg</span>";
	} else if ($tickAvg > $t4) {
		$tickAvg = "<span style='color:white'>$tickAvg</span>";
	}

	return $tickAvg;
}
