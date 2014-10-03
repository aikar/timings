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
	/**
	 * @index s
	 */
	public $start;
	/**
	 * @index e
	 */
	public $end;
	/**
	 * @index h
	 * @var TimingHandler[]
	 */
	public $handlers;

	/**
	 * @index mp
	 * @var MinuteReport[]
	 */
	public $minuteReports;
} 
