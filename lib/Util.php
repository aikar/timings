<?php
/**
 * Spigot Timings Parser
 *
 * Written by Aikar <aikar@aikar.co>
 *
 * @license MIT
 */

class Util {
	public static function sanitize($inp) {
		return htmlentities(strip_tags($inp));
	}

	public static function sanitizeHex($id) {
		return preg_replace('/[^a-zA-Z0-9]/ms', '', $id);
	}

	public static function pct($pct, $mod = 1, $pad = 8, $high = 0, $med = 0, $low = 0) {
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

	public static function pad($string, $len, $right = false) {
		return str_pad($string, $len, ' ', $right ? STR_PAD_RIGHT : STR_PAD_LEFT);
	}

	public static function array_sort($array, $on, $order = SORT_ASC) {
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

	public static function showInfo($id, $title) {
		return "<b>$title</b><button class='learnmore' info='$id' onclick='showInfo(this)' title='$title'>Learn More</button></b>";
	}
}


