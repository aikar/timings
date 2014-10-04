<div class="ad_links"><?php ad_link(); ?></div>
<hr/>
<div id="content">
    Dev site is still under development.

<pre>
<?php
/**
 * @var TimingsMaster $timings
 */
global $timings;
$totalTime = 0;
$totalTimings = 0;
foreach ($timings->data as $data) {
    $totalTime += $data->totalTime;
    foreach ($data->handlers as $handler) {
        $totalTimings += $handler->count;
    }
}
$cost = $timings->system->timingcost;
echo "totalTime: $totalTime - Timings cost: $cost - " . ($cost * $totalTimings) . " - Pct: "
    . (($cost * $totalTimings) / ($timings->sampletime*1000000000))*100;

echo "<br />";
var_dump($timings->data);
?>
</pre>
</div>

<hr/>
<div class="ad_links"><?php ad_link(); ?></div>
