<?php
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
	$activatedPercent = Util::pct($activatedPercent, 1, 5, 75, 60, 50);
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
