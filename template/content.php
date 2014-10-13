<?php
/*
 * Aikar's Minecraft Timings Parser
 *
 * Written by Aikar <aikar@aikar.co>
 * http://aikar.co
 * http://starlis.com
 *
 * @license MIT
 */
namespace Starlis\Timings;

?><div class="ad_links"><?php ad_link(); ?></div>
<div id="content">
    Dev site is still under development.

<pre>
<?php
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
$cost = $timingsData->system->timingcost;
echo "totalTime: $totalTime - Timings cost: $cost - " . ($cost * $totalTimings) . " - Pct: "
    . (($cost * $totalTimings) / ($timingsData->sampletime * 1000000000)) * 100;

echo "<br />\n\n";
$tpl = Template::getInstance();

/**
 * @var TimingHandler[] $lag
 */
$lag = array_filter($tpl->handlerData, __NAMESPACE__.'\lagFilter');

usort($lag, __NAMESPACE__.'\lagSort');
foreach ($lag as $l) {
    printRecord($l);
    $children = array_filter($l->children, __NAMESPACE__.'\lagFilter');
    usort($children, __NAMESPACE__.'\lagSort');
    foreach ($children as $child) {
        if ($child->lagTotal > 50) {
            echo "\t"; printRecord($child);
        }
    }
}

function lagFilter($e) {
    $e->avg = 0;
    if ($e->lagCount > 0) {
        $e->avg = ($e->lagTotal / $e->lagCount) * $e->mergedCount;
    }
    return $e->lagTotal > 1000 && $e->avg > 2000000;
}
function lagSort($a, $b) {
    //return $a->avg > $b->avg ? -1 : 1;
    return $a->lagTotal > $b->lagTotal ? -1 : 1;
}

$i=0;
function printRecord($l) {
    global $i;
    $id=$l->id->id."_".$i++;
    echo "<a id='$id' href='#$id'>#</a>".$l->id . " - count(".$l->lagCount.") - total(".round($l->lagTotal/1000000000,3)."s) - avg(" . round(($l->lagTotal / $l->lagCount)/1000000, 4) . "ms)\n";
}


?>
</pre>
</div>

<hr/>
<div class="ad_links"><?php ad_link(); ?></div>
