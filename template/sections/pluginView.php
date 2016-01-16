<?php

/**
 * Contributed by willies952002 <admin@domnian.com>
 * 
 * @license MIT
 */

use Starlis\Timings\Json\TimingsMaster;

/**
 * @var TimingsMaster $timingsData
 */
$timingsData = TimingsMaster::getInstance();

echo '<h5>Installed Plugins:</h5>'."\n";

$plugins = $timingsData->plugins;

printRows($plugins);

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
        openRow($level, $plugin->name);
        echo "<span class='name'>$plugin->name</span><br>\n";
        echo '<div class="children">';
        if ( !($plugin->authors === null) ) {
            openRow(1, $plugin->name + "_authors");
            echo "<span class='name'>Author(s)</span>: $plugin->authors<br>";
            closeRow();
        }
        openRow(1, $plugin->name + "_version");
        echo "<span class='name'>Version</span>: $plugin->version<br>";
        closeRow();
        if ( !(($plugin->description == 'null') || ($plugin->description === null)) ) {
            openRow(1, $plugin->name + "_description");
            echo "<span class='name'>Description</span>: $plugin->description<br>";
            closeRow();
        }
        openRow(1, $plugin->name + "_cost");
        echo "<span class='name'>Plugin Cost</span>: " . pluginCost($plugin) . "<br>";
        closeRow();
        echo '</div>';
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
