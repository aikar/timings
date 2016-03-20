<?php
/**
 * Copyright (c) (2016) - Aikar's Minecraft Timings Parser
 *
 *  Written by Aikar <aikar@aikar.co>
 *    + Contributors (See AUTHORS)
 *
 *  http://aikar.co
 *  http://starlis.com
 *
 *  @license MIT
 *
 */


use Starlis\Timings\Json\TimingHandler;
use Starlis\Timings\Json\TimingsMaster;
use Starlis\Timings\Template;
use Starlis\Timings\util;

/**
 * @var TimingsMaster $timingsData
 */
$timingsData = TimingsMaster::getInstance();
$template = Template::getInstance();

$sortChunk = function($c1, $c2) use($template, $timingsData) {
    $c1c = $c1['tec'] + $c1['ec'];
    $c2c = $c2['tec'] + $c2['ec'];
    if ($c1c === $c2c) {
        return 0;
    } else {
        return $c1c < $c2c ? 1 : -1;
    }
};
echo "<br /><h2>NOTICE: Counts are NOT EXACT!!!</h2>They are a representation of number of times seen 
within this selected history window. They will be much higher than seen in game. It is intended 
to help you identify where the most TE/E's are.<br /><br />";

foreach ($template->areaMap as $worldName => $chunks) {
    usort($chunks, $sortChunk);
    echo "<h3>$worldName</h3>";
    foreach ($chunks as $area) {
        echo $area['world'] . ':' . ($area['x']) . ',' . ($area['z']). "<br />\n";
        echo "Totals: {$area['ec']} Entities - {$area['tec']} Tile Entities<br />";
        echo "Area Seen: {$area['count']} times<br/><br/>";
        echo '<div class="chunk-row full-timing-row">';
        $stuff = $area['te'] + $area['e'];
        arsort($stuff);
        foreach ($stuff as $k => $v)  {
            echo "<span class='indent full-child'>$k: $v</span>";
        }
        echo '</div><br />';
    }
}

