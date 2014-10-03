<?php
/**
 * Spigot Timings Parser
 *
 * Written by Aikar <aikar@aikar.co>
 *
 * @license MIT
 */


class TimingHistory {
	use FromJson;
	public $id;
	public $start;
	public $end;
	/**
	 * @var TimingHandler[]
	 */
	public $entries;

	/**
	 * @index mp
	 * @var MinuteReport[]
	 */
	public $minuteReports;
} 
