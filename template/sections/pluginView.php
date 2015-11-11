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

//global $handlers;
$handlers = [];

foreach ($timingsData->data as $data) {
	$totalTime += $data->totalTime;
	//var_dump($data->minuteReports);
	foreach ($data->handlers as $handler) {
		$totalTimings += $handler->count;
                array_push($handlers, $handler);
//                echo 'Added ' . $handler->id->group . '::' . $handler->id->id . ' to Array<br>';
	}
}



global $section;
$cost = $timingsData->system->timingcost * 1.1;
echo '<pre>';
echo "Timings cost: $cost - " . ($cost * $totalTimings) . " - Pct: "
	. round(((($cost * $totalTimings) / ($timingsData->sampletime * 1000000000 / 100))), 2) . "%\n\n";
echo '</pre>';

$plugins = $timingsData->plugins;

//var_dump($plugins);
//echo '<hr>foo<br><span style="color:blue;">';
//dumpHandlerData($tpl->handlerData);
//dumpHandlers($handlers);
//echo '</span><hr>';

//echo '<br><br>';
echo '<h5>Installed Plugins:</h5>';

foreach( $plugins as $p ) {
    openRow(0, $p);
    printRecord($p);
    closeRow();
}

function printRecord($r) {
	$tpl = Template::getInstance();
	$ticks = $tpl->masterHandler->count;
	$totalTime = $tpl->masterHandler->total;
        $authors = ($r->authors === null) ? ($r->name === "WorldEdit" ? "sk89q" : "null") : $r->authors;
	echo "<span class='name'>$r->name</span> by $authors<br>";
        echo "&nbsp;&nbsp;&nbsp;Version: $r->version<br>
              &nbsp;&nbsp;&nbsp;Description: $r->description<br>
              &nbsp;&nbsp;&nbsp;[Debug Only] Timings Handler:<br>
              &nbsp;&nbsp;&nbsp;Plugin Cost:<br>";
}

/**
 * @param $depth
 * @param TimingHandler $l
 *
 * @return string
 */
function openRow($depth, $l) {
	static $i;
	$id = $l->name;
	$num = $depth % 5;
	$indents = "<div class='indent depth{$num} full-depth${depth}'></div>";

	echo "<div class='full-timing-row'>$indents<div id='$id' class='timing-row'><a href='#$id'>#</a>";
}
function closeRow() {
	echo "</div></div>";
}

$processMap = [];
function printRows($lag, $level) {
	global $processMap;
	$tpl = Template::getInstance();
        
	foreach ($lag as $l) {

		openRow($level, $l);
		printRecord($l);
		$id = $l->id->id;
		$h = $tpl->handlerData[$id];

		if (!empty($h->children) && ++$processMap[$id] == 1) {
			$children = $h->children;
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

// Debug
function dumpHandlerData($data) {
    foreach ( array_keys($data) as $key ) {
        foreach ( $data[$key] as $value ) {
            echo " - $key : $value<br>";
        }
    }
}

function dumpHandlers($handlers) {
    $foo = [];
    $g = "";
    $bar = [];
    $baz = [];
    foreach ( $handlers as $handler) {
        $id = $handler->id->id;
        $group = $handler->id->group;
        $name = $handler->id->name;
        $handlerID = $hangler->id;
        $var_dump = var_dump($handler->id);
        echo '<hr>';
        $foo[$id] = $group;
    }
    echo '<hr>';
    foreach ( $foo as $id => $group) {
        if ( $g === $group ) {
            $bar[] = $id;
        } else {
            $g = $group;
            if ( !isset($baz[$group]) ) {
                $baz[$group] = $bar;
                $bar = [];
            } else {
                $bar = $baz[$group];
            }
        }
    }
    foreach ( $baz as $group => $ids ) {
        echo "$group:<ul>";
        foreach ( $ids as $id ) {
            echo "<li>- $id</li>";
        }
        echo '</ul>';
    }
}