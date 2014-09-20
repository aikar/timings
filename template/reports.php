<div id="reports">
	<?php
	foreach ($report as $plugin => $timings) {
		$ptotal = $timings['Total'];
		// TODO: Fix this
		if ($sample) {
			if ($plugin == 'Minecraft') {
				$pct = Util::pct($ptotal / ($sample ? $sample : $total), 1, 5, 70, 40, 20);
			} else {
				$pct = Util::pct($ptotal / ($sample ? $sample : $total), 1, 5, 6, 3, 1);
			}
			$totals = round($ptotal / 1000 / 1000 / 1000, 3) . ' s';
		}
		unset($timings['Total']);
		ob_start();
		echo '<div class="sectionHeader">';
		echo "<hr /><div class='title'>";
		echo Util::pad($plugin, 21, true);
		if ($plugin != $subkey) {
			echo "Total: $totals\tPct: $pct";
		}
		echo "</div><hr />";
		echo "<span class='head'><pre>  " . Util::pad("Pct Total", 10) . "\t" . Util::pad("Pct Tick", 8) . "\t"
			. Util::pad("Total", 8) . "\t" . Util::pad("Avg", 9) . "\t" . Util::pad("PerTick", 8)."\t".Util::pad("Count", 10);
		
		echo "\t\tEvent\n</pre></span>";
		echo "<hr />";
		echo '</div>';
		echo '<div class="sectionReport">';
		$i = 0;
		$hiddenelem = false;
		$shown = 0;
		foreach ($timings as $event => $time) {
			if ($time[1]) {
				$avg = round($time[0] / $time[1], 3);
			} else {
				$avg = 0;
			}
			$timesPerTick = round($time[1] / $numTicks, 1);
			if ($timesPerTick >= 1) {
				$avg = $avg * $timesPerTick;
			}


			$avg = Util::pad($avg, 9);
			$count = round($time[1] / 1000, 2);
			$count = Util::pad(number_format($count, 1) . 'k', 11);

			$pct_tick = Util::pct($avg / 1000 / 1000 / 50, 1/*$count * 1000 / $numTicks*/, 8, 40, 15, 3);
			$avg = Util::pad(number_format(round($avg / 1000 / 1000, 2), 2) . ' ms', 12);

			$stime = number_format(round($time[0] / 1000 / 1000 / 1000, 2), 2) . ' s';
			$stime = Util::pad($stime, 8);
			$pct_tot_raw = ($time[0] / ($sample ? $sample : $total));
			$pct_tot = Util::pct($pct_tot_raw, 1, 10, 50, 20, 10);
			$origevent = $event;
			if (preg_match('/\.([a-zA-Z0-9\$_]+::.+)/s', $event, $em)) {
				$event = $em[1];
			}
			$event = trim($event);

			$sevent = "<b title='$origevent'>$event</b>";

			if (in_array($event, $exclude) || substr($event, 0, 2) == "**") {
				$sevent = "<b>" . trim(substr($event, 2))."</b>";
			}

			if ($event == "** Full Server Tick") {
				$sevent = Util::showInfo('fst', 'Full Server Tick');
				$serverLoad = $pct_tick;
			}

			if ($event == "** Connection Handler") {
				$sevent = Util::showInfo('connhandler', 'Connection Handler');
			}

			if ($event == "** activatedTickEntity") {
				$sevent = Util::showInfo('ate', 'Activated Entities');
			}
			if ($event == "Scheduler") {
				$sevent = Util::showInfo('sched', 'Plugin Scheduler');
			}
			$i++;
			if (($plugin == $subkey && $i >= 11) || $pct_tot_raw < 0.0003 || ($plugin != "Minecraft" && $i >= 6 && $plugin != $subkey)) {
				$disabled = " hidden";
				$hiddenelem = true;
			} else {
				$disabled = "";
				$shown++;
			}

			$timesPerTick = Util::pad(number_format($timesPerTick, $timesPerTick > 10 ? 0 : 1), 4);
			echo "<span class='event $disabled'><pre>  $pct_tot\t$pct_tick\t$stime\t$avg\t$timesPerTick\t$count";

			echo "\t    $sevent\n</pre></span>";
		}
		if ($hiddenelem) {
			echo "<button class='show_rest'>Show rest...</button><br />";
		}

		echo '</div>';
		$buffer = ob_get_contents();
		ob_end_clean();
		if ($shown == 0) {
			echo "<div class='hidden'>$buffer</div>";
		} else {
			echo $buffer;
		}

	}

	?>
	<button onclick='$(".hidden").toggle()'>Toggle all hidden</button>
	<br/><br /><br />
	<?php ad_banner_bottom(); ?>
	<br /><br/><br />

</div>
