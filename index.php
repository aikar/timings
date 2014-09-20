<?php
/**
 * Spigot Timings Parser
 *
 * Written by Aikar <aikar@aikar.co>
 *
 * @license MIT
 *
 * //////////////////////////////
 * STILL CONVERTING THIS CODE
 * //////////////////////////////
 *
 */

require_once "init.php";

$file = str_replace(array("\r\n", "\r"), "\n", Util::sanitize($file));

$isDev = !empty($_GET['dev']);

$spigotConfigPattern = "/&amp;amp;lt;spigotConfig&amp;amp;gt;(.*)&amp;amp;lt;\\/spigotConfig&amp;amp;gt;/ms";
if (preg_match($spigotConfigPattern, $file, $configMatch)) {
	$spigotConfig = $configMatch[1];
	$yamlConfig = @yaml_parse($spigotConfig);
	$file = preg_replace($spigotConfigPattern, "", $file);
}
if (preg_match('/Sample time (.+?) \(/', $file, $sampm)) {
	$sample = $sampm[1];
}
$subkey = 'Minecraft - Breakdown (counted by other timings, not included in total)  ';
$report = array($subkey => array());
$current = null;
$version  = '';
if (preg_match('/# Version (git-Spigot-)?(.*)/i', $file, $m)) {
	$version = $m[2];
}
// legacy
$exclude = array('entityAIJump', 'entityAILoot', 'entityAIMove',
	'entityTickRest', 'entityAI', 'entityBaseTick');
foreach (explode("\n", $file) as $line) {
	if ($line[0] != " " && $line[0] != "#") {
		$plugin = $line;
		if ($plugin == 'Custom Timings' || $plugin == "Minecraft - ** indicates it&#39;s already counted by another timing") {
			$plugin = 'Minecraft';
		}
		$report[$plugin] = array();
		$current =& $report[$plugin];
	} else if ($line[0] == " ") {
		if (preg_match("/(.+?) Time: (\\d+) Count: (\\d+) Avg: (\\d+)/", $line, $m)) {
			array_shift($m);
			if (preg_match("/Violations: (\\d+)/", $line, $v)) {
				$m[] = $v[1];
			}
			$active =& $current;
			$m[0] = trim($m[0]);
			if ($m[0] == 'Player Tick' || $m[0] == 'Connection Handler') {
				$m[0] = '** Connection Handler';
			}
			if (isset($_GET['dev'])) {
				//print_r($m);
			}
			if (preg_match("/Plugin: (.*) Event:(.*)/", $m[0], $eventmatch)) {
				$xplugin = $eventmatch[1];
				$m[0] = trim($eventmatch[2]);
				$active =& $report[trim($xplugin)];
			}
			if (preg_match("/Task: (.*) Runnable: (.*)/", $m[0], $taskmatch)) {
				$xplugin = $taskmatch[1];
				$m[0] = 'Task: ' . str_replace(':', ' ', preg_replace('/.*? Id\:\((.*)\)/', '\1', $taskmatch[2]));

				if (preg_match('/.*\.(.*)$/', $m[0], $cleanmatch)) {
					$m[0] = "Task: " . $cleanmatch[1];
				}
				$active =& $report[trim($xplugin)];
			}
			$data = array(@$m[1], $m[2], $m[4]);
			if (!in_array($m[0], $exclude) && substr($m[0], 0, 2) != "**") {
				if (!isset($current[@$m[0]])) {
					$active[$m[0]] = $data;
				} else {
					$active[$m[0]][0] += $m[1];
					$active[$m[0]][1] += $m[2];
					$active[$m[0]][2] += $m[4];
				}
				$tasks = '** Tasks';
				if (substr($m[0], 0, 5) == "Task:") {
					if (!isset($report[$subkey][$tasks])) {
						$report[$subkey][$tasks] = $data;
					} else {
						$report[$subkey][$tasks][0] += $m[1];
						$report[$subkey][$tasks][1] += $m[2];
						$report[$subkey][$tasks][2] += $m[4];
					}
				}
				$active['Total'] += $m[1];
			} else {
				if (!isset($report[$subkey][$m[0]])) {
					$report[$subkey][$m[0]] = $data;
				} else {
					$report[$subkey][$m[0]][0] += $m[1];;
					$report[$subkey][$m[0]][1] += $m[2];;
					$report[$subkey][$m[0]][2] += $m[4];;
				}
			}
		}
	}
}
$report[$subkey]['Total'] = intval($report['Minecraft']['Total']) - 1;


$total = 0;
$numTicks = 0;
$entityTicks = 0;
$playerTicks = 0;
$totalTimings = 0;
$totalViolations = 0;
$activatedEntityTicks = 0;
$report = array_sort($report, 'Total', SORT_DESC);
foreach ($report as &$rep) {
	arsort($rep);
	array_walk($rep, function (&$ent, $k) use (&$totalViolations, &$totalTimings, &$total, &$entityTicks, &$numTicks, &$playerTicks, &$activatedEntityTicks) {
		if ($k == 'Total') $total += $ent;
		$totalTimings += $ent[1];
		if (isset($ent[2]) && $k != '** Full Server Tick') {
			$totalViolations += $ent[2];
		}
		if (stristr($k, ' - entityBaseTick') || stristr($k, ' - entityTick') || $k == 'Full Server Tick') {
			$numTicks = max($ent[1], $numTicks);
		}
		if ($k == '** entityBaseTick' || $k == 'entityBaseTick' || $k == '** tickEntity') {
			$entityTicks = $ent[1];
		}
		if ($k == "** activatedTickEntity") {
			$activatedEntityTicks = $ent[1];
		}
		if ($k == "** tickEntity - EntityPlayer") {
			$playerTicks = $ent[1];
		}
	});
}
$recommendations = array();

$numTicks = max(1,$numTicks);
$total -= $report[$subkey]['Total'];
ob_start();
 echo '<!-- ' . $totalTimings . ' -->';


$head = ob_get_contents();
ob_end_clean();
/****************************
 * // BEGIN BODY PROCESSING //
 ****************************/

ob_start();
if ($highEntityTick) {
	$recommendations[]="Consider reducing your entity-activation-range settings, as your activation rate is high (" . $activatedPercent ."). Recommended: monsters 24, animals 16, misc 12";
}


require_once "template/reports.php";
require_once "template/footer.php";


function showInfo($id, $title) {
	return "<b>$title</b><button class='learnmore' info='$id' onclick='showInfo(this)' title='$title'>Learn More</button></b>";
}
$buffer = ob_get_contents();
ob_end_clean();
echo $head;
echo "<span class='head'><pre>";

echo "Total: " . round($total / 1000 / 1000 / 1000, 3) . "s (Ticks: $numTicks)";
if ($sample) {
	echo " - Sample Time: " . round($sample / 1000 / 1000 / 1000, 3) . 's';
}
if ($version) {
	echo "  - Spigot Version: $version\n";
}
$highEntityTick = false;
$activatedPercent = 1;
if ($activatedEntityTicks && $numTicks) {
	echo "Average Entities: ";
	$activatedAvgEntities = $activatedEntityTicks / $numTicks;
	$totalAvgEntities = $entityTicks / $numTicks;
	$activatedPercent = $activatedAvgEntities / $totalAvgEntities;
	if ($totalAvgEntities > 800 && $activatedPercent > .70) {
		$highEntityTick = true;
	}
	$activatedPercent = pct($activatedPercent, 1, 5, 75, 60, 50);
	echo number_format($activatedAvgEntities, 2);
	echo ' / ';
	echo number_format($totalAvgEntities, 2);
	echo " ($activatedPercent)";
} else if ($entityTicks && $numTicks) {
	echo " - Average Entities: " . number_format($entityTicks / $numTicks, 2);
}
if ($playerTicks && $numTicks) {
	echo " - Average Players: " . number_format($playerTicks / $numTicks, 2);
}
if ($numTicks && $sample) {
	$desiredTicks = $sample / 1000 / 1000 / 1000 * 20;
	echo " - Average TPS: " . number_format($numTicks / $desiredTicks * 20, 2);
}
echo " - Server Load: $serverLoad";
echo '</pre></span><hr />';
if (!empty($recommendations)) {
echo "<span style='color: red;display:block;margin: 5px 0'>";
echo implode("\n", $recommendations);
echo "</span><hr />";
}

echo $buffer;

function pct($pct, $mod = 1, $pad = 8, $high = 0, $med = 0, $low = 0)
{
	$num = round($pct * 100, 2);
	$prefix = '';
	$suffix = '';
	if ($num * $mod > $high && $high != 0) {
		$prefix = '<span style="background:black;color:red">';
		$suffix = '</span>';
	} elseif ($num * $mod > $med && $med != 0) {
		$prefix = '<span style="background:black;color:orange">';
		$suffix = '</span>';
	} else if ($num * $mod > $low && $low != 0) {
		$prefix = '<span style="background:black;color:yellow">';
		$suffix = '</span>';
	}
	return $prefix . pad(number_format($num, 2) . '%', $pad) . $suffix;
}

function pad($string, $len, $right = false)
{
	return str_pad($string, $len, ' ', $right ? STR_PAD_RIGHT : STR_PAD_LEFT);
}

function array_sort($array, $on, $order = SORT_ASC)
{
	$new_array = array();
	$sortable_array = array();

	if (count($array) > 0) {
		foreach ($array as $k => $v) {
			if (is_array($v)) {
				foreach ($v as $k2 => $v2) {
					if ($k2 == $on) {
						$sortable_array[$k] = $v2;
					}
				}
			} else {
				$sortable_array[$k] = $v;
			}
		}

		switch ($order) {
			case SORT_ASC:
				asort($sortable_array);
				break;
			case SORT_DESC:
				arsort($sortable_array);
				break;
		}

		foreach ($sortable_array as $k => $v) {
			$new_array[$k] = $array[$k];
		}
	}

	return $new_array;
}

?>
