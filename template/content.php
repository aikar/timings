<div class="ad_links"><?php ad_link(); ?></div>
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
//var_dump($tpl);
$lag = array_filter($tpl->handlerData, function ($e) {
    return $e->lagTotal > 100;
});
usort($lag, function ($a, $b) {
    return $a->lagTotal > $b->lagTotal ? -1 : 1;
});

foreach ($lag as $l) {
    echo $l->id . "::".$l->lagCount."::".$l->lagTotal."\n";
}


?>
</pre>
</div>

<hr/>
<div class="ad_links"><?php ad_link(); ?></div>
