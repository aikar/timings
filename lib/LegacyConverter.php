<?php
/**
 * Spigot Timings Parser
 *
 * Written by Aikar <aikar@aikar.co>
 *
 * @license MIT
 */

/**
 * Class LegacyConverter
 *
 * This converts Timings v1 "Bukkit Format" files into Timings v2 XML format
 * so that the display of the data only works on XML
 */
class LegacyConverter {

	private $data;
	private $report;
	function __construct($data)
	{
		$this->data = $data;
	}

	public function buildReport() {
		$file = str_replace(array("\r\n", "\r"), "\n", Util::sanitize($this->data));

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
		$report =& $this->report = array($subkey => array());
		$current = null;
		$version = '';
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
		$report = Util::array_sort($report, 'Total', SORT_DESC);
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
	}

	public function convertToXml() {
		$this->buildReport();




	}
}
