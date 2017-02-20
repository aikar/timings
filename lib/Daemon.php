<?php
/**
 * Copyright (c) (2016) - Aikar's Minecraft Timings Parser
 *
 *  Written by Aikar <aikar@aikar.co>
 *    + Contributors (See AUTHORS)
 *
 *  http://aikar.co
 *  http://starlis.com
 *
 * @license MIT
 *
 */


namespace Starlis\Timings;

class Daemon {
	private static $lockFile = TMP_PATH . "/daemon.pid";

	public static function startDaemon() {
		if (!self::obtainLock()) {
			echo "Could not obtain lock\n";
			return false;
		}

		do {
			self::run();
			time_nanosleep(0, 50000000);
		} while (self::touchLock());
	}

	public static function run() {

	}

	protected function obtainLock() {
		$lockFile = self::$lockFile;

		if (is_readable($lockFile)) {
			$pid = (int)trim(file_get_contents($lockFile));
			if (posix_kill($pid, 0)) {
				if (time() - filemtime($lockFile) >= 300) {
					echo "dead pid: $pid\n";
					posix_kill($pid, SIGKILL);
				} else {
					return false;
				}
			}
		}

		// write our PID and obtain lock.
		return file_put_contents($lockFile, getmypid());
	}

	private static function touchLock() {
		$lockFile = self::$lockFile;
		if (is_writable($lockFile) && (int)trim(file_get_contents($lockFile)) === getmypid()) {
			touch($lockFile);
			return true;
		}
		echo "Lost lock\n";
		return false;
	}

}
