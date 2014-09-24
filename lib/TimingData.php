<?php


class TimingData {
	public $totalTimings;
	public $activatedEntityTicks;
	public $totalViolations;
	public $playerTicks;
	public $entityTicks;
	public $numTicks;
	public $total;
	/**
	 * @var SpigotTimings
	 */
	private $timings;

	public function __construct(SpigotTimings $timings) {
		// TODO: use XML parsed format. This is copied over from legacy needs to act on XML
		$data = $this;
		$data->total = 0;
		$data->numTicks = 0;
		$data->entityTicks = 0;
		$data->playerTicks = 0;
		$data->totalTimings = 0;

		$data->activatedEntityTicks = 0;

		//$report = Util::array_sort($this->timings, 'Total', SORT_DESC);
		foreach ($data->timings->getReport() &$rep) {
			arsort($rep);
			array_walk($rep, function (&$ent, $k) use (&$data) {
				if ($k == 'Total') $data->total += $ent;
				$data->totalTimings += $ent[1];

				if (stristr($k, ' - entityBaseTick') || stristr($k, ' - entityTick') || $k == 'Full Server Tick') {
					$data->numTicks = max($ent[1], $data->numTicks);
				}
				if ($k == '** entityBaseTick' || $k == 'entityBaseTick' || $k == '** tickEntity') {
					$data->entityTicks = $ent[1];
				}
				if ($k == "** activatedTickEntity") {
					$data->activatedEntityTicks = $ent[1];
				}
				if ($k == "** tickEntity - EntityPlayer") {
					$data->playerTicks = Util::xml($ent[1]);
				}
			});
		}

		$this->numTicks = max(1,$this->numTicks);
		$this->total -= $report[$subminecraft]['Total'];
		$this->timings = $timings;
	}
} 
