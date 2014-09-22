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
	private $totalTimings;
	private $activatedEntityTicks;
	private $totalViolations;
	private $playerTicks;
	private $entityTicks;
	private $numTicks;
	private $total;
	private $sample;
	private $version;
	/**
	 * @var SpigotTimings
	 */
	private $timings;

	function __construct(SpigotTimings $timings, $data)
	{
		$this->data = $data;
		$this->timings = $timings;
	}

	public function processData() {
		$file = str_replace(array("\r\n", "\r"), "\n", Util::sanitize($this->data));

		$spigotConfigPattern = "/&amp;amp;lt;spigotConfig&amp;amp;gt;(.*)&amp;amp;lt;\\/spigotConfig&amp;amp;gt;/ms";
		// We never used the config - just strip it
		$file = preg_replace($spigotConfigPattern, "", $file);

		if (preg_match('/Sample time (.+?) \(/', $file, $sampm)) {
			$this->sample = Util::xml($sampm[1]);
		}
		$subminecraft = 'Minecraft';
		$this->report = array($subminecraft => array());
		$report =& $this->report;
		$current = null;
		$this->version = '';
		if (preg_match('/# Version (git-Spigot-)?(.*)/i', $file, $m)) {
			$this->version = Util::xml($m[2]);
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
				if (preg_match("/(.+?) Time: (\\d+) Count: (\\d+)/", $line, $m)) {

					array_shift($m);

					$active =& $current;
					$m[0] = trim($m[0]);
					if ($m[0] == 'Player Tick') {
						$m[0] = 'Connection Handler';
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
					$data = array(@$m[1], $m[2]);
					if (!in_array($m[0], $exclude) && substr($m[0], 0, 2) != "**") {
						if (!isset($current[@$m[0]])) {
							$active[$m[0]] = $data;
						} else {
							$active[$m[0]][0] += $m[1];
							$active[$m[0]][1] += $m[2];
						}

						$active['Total'] += $m[1];
					} else {
						if (!isset($report[$subminecraft][$m[0]])) {
							$report[$subminecraft][$m[0]] = $data;
						} else {
							$report[$subminecraft][$m[0]][0] += $m[1];
							$report[$subminecraft][$m[0]][1] += $m[2];
						}
					}
				}
			}
		}
		$report[$subminecraft]['Total'] = intval($report['Minecraft']['Total']) - 1;


		$this->total = 0;
		$this->numTicks = 0;
		$this->entityTicks = 0;
		$this->playerTicks = 0;
		$this->totalTimings = 0;
		$this->totalViolations = 0;
		$this->activatedEntityTicks = 0;

		$report = Util::array_sort($report, 'Total', SORT_DESC);

		$converter = $this;
		foreach ($report as &$rep) {
			arsort($rep);
			array_walk($rep, function (&$ent, $k) use (&$converter) {
				if ($k == 'Total') $converter->total += $ent;
				$converter->totalTimings += $ent[1];
				if (isset($ent[2]) && $k != '** Full Server Tick') {
					$converter->totalViolations += $ent[2];
				}
				if (stristr($k, ' - entityBaseTick') || stristr($k, ' - entityTick') || $k == 'Full Server Tick') {
					$converter->numTicks = max($ent[1], $converter->numTicks);
				}
				if ($k == '** entityBaseTick' || $k == 'entityBaseTick' || $k == '** tickEntity') {
					$converter->entityTicks = Util::xml($ent[1]);
				}
				if ($k == "** activatedTickEntity") {
					$converter->activatedEntityTicks = Util::xml($ent[1]);
				}
				if ($k == "** tickEntity - EntityPlayer") {
					$converter->playerTicks = Util::xml($ent[1]);
				}
			});
		}

		$this->numTicks = max(1,$this->numTicks);
		$this->total -= $report[$subminecraft]['Total'];
	}

	public function convert() {
		$xml = '<?xml version="1.0" encoding="UTF-8"?>';
		$this->processData();
		$handlers = '';
		$i = 0;
		$_total = 0;
		$_count = 0;
		foreach ($this->report as $group => $timings) {
			$group = Util::xml($group);
			if (strstr($group, "*org.bukkit.craftbukkit")) {
				// Bugged data?
				continue;
			}
			foreach ($timings as $name => $v) {
				$i++;
				$name = Util::xml($name);
				$count = $v[1];
				$total = $v[0];
				$_total += $total;
				$_count += $count;
				$root = ($group == "Minecraft" && substr($name, 0, 2) != "**" ? 1 : 0);
				if (!$root && $group == "Minecraft") {
					$name = substr($name, 3);
				}
				$handlers .= <<<XML
		<handler id="$i" parent="0" group="$group" name="$name" count="$count" total="$total" lagCount="0" lagTotal="0" root="$root"/>

XML;
			}
		}
		$estimatedCost = 150 * $_count;
		$xml .= <<<XML

		<timings>
<!-- Automatically converted from {$this->timings->getId()} to Timings v2 format
-->
		<version>{$this->version}</version>
		<maxplayers>1000</maxplayers>
		<server>Spigot Server</server>
		<sampletime>{$this->sample}</sampletime>
		<system name="" version="" arch="" totalmem="0" usedmem="0" maxmem="0" runtime="{$this->sample}" />
		<ping min="0" max="0" avg="0" />
		<!-- Guessing at cost basis to 150 -->
		<handlers base="150" count="$_count" cost="$estimatedCost">
		$handlers
		</handlers>
		<worlds />
		<plugins />
		<spigotconfig />
		<bukkitconfig />
		</timings>
XML;

		return $xml;
	}
}


















