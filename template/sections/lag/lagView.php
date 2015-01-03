<?php
use Starlis\Timings\Json\TimingHandler;
use Starlis\Timings\Json\TimingsMaster;
use Starlis\Timings\Template;

/**
 * @var TimingsMaster $timingsData
 */
$timingsData = TimingsMaster::getInstance();

$totalTime = 0;
$totalTimings = 0;
foreach ($timingsData->data as $data) {
    $totalTime += $data->totalTime;
    //var_dump($data->minuteReports);
    foreach ($data->handlers as $handler) {
        $totalTimings += $handler->count;
    }
}



$lagFilter = function ($e) {
    $e->avg = 0;
    if ($e->lagCount > 0) {
        $e->avg = ($e->lagTotal / $e->lagCount) * $e->mergedCount;
    }

    return $e->lagTotal > 10 && $e->avg > 20000;
};

$lagSort = function ($a, $b) {
    //return $a->avg > $b->avg ? -1 : 1;
    return $a->lagTotal > $b->lagTotal ? -1 : 1;
};

$printRecord = function ($l) {
    static $i;
    $id = $l->id->id . "_" . $i++;
    echo "<a id='$id' href='#$id'>#</a>" . $l->id . " - count(" . $l->lagCount . ") - total(" .
        round($l->lagTotal / 1000000000, 3) . "s) - avg(" . round(($l->lagTotal / $l->lagCount) / 1000000, 4) . "ms)\n";
};

$cost = $timingsData->system->timingcost;
echo '<pre>';
echo "totalTime: $totalTime - Timings cost: $cost - " . ($cost * $totalTimings) . " - Pct: "
    . ((($cost * $totalTimings) / ($timingsData->sampletime * 1000000000)) * 100)."\n\n";
$tpl = Template::getInstance();

/**
 * @var TimingHandler[] $lag
 */
$lag = array_filter($tpl->handlerData, $lagFilter);
//print_r($tpl->handlerData);
usort($lag, $lagSort);
foreach ($lag as $l) {
    $printRecord($l);
    $children = array_filter($l->children, $lagFilter);
    usort($children, $lagSort);
    foreach ($children as $child) {
        if ($child->lagTotal > 50) {
            echo "\t";
            $printRecord($child);
        }
    }
}

echo '</pre>';
