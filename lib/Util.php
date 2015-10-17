<?php
/*
 * Aikar's Minecraft Timings Parser
 *
 * Written by Aikar <aikar@aikar.co>
 * http://aikar.co
 * http://starlis.com
 *
 * @license MIT
 */
namespace Starlis\Timings;

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

	public static function xml($attr) {
		return htmlentities($attr);
	}

	public static function uuid($dashes = true) {
		$dash = $dashes ? "-" : "";

		return sprintf("%04x%04x$dash%04x$dash%04x$dash%04x$dash%04x%04x%04x",
			mt_rand(0, 0xffff), mt_rand(0, 0xffff),
			mt_rand(0, 0xffff),
			mt_rand(0, 0x0fff) | 0x4000,
			mt_rand(0, 0x3fff) | 0x8000,
			mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
		);
	}

	public static function showInfo($id, $title) {
		return "<b>$title</b><button class='learnmore' info='$id' onclick='showInfo(this)' title='$title'>Learn More</button></b>";
	}

	public static function flattenObject($data) {
		$data = (array)$data;
		foreach ($data as $k => $v) {
			if (is_object($v)) {
				$data[$k] = self::flattenObject($v);
			}
		}

		return $data;
	}

	public static function has_trait($class, $traits) {
		if (is_object($class)) {
			$class = get_class($class);
		} else {
			// Exclude normal PHP types that are obviously not class names, so we do not invoke the auto loader.
			$check = preg_replace("/[^a-z]/", "", strtolower($class));
			if (in_array($check, ["int", "integer", "float", "double", "resource", "object", "array",
				"mixed", "callback", "number", "null", "string", "boolean"])
			) {
				return false;
			}
			if (!class_exists($class)) {
				return false;
			}
		}

		$uses = class_uses($class);
		foreach ((array)$traits as $trait) {
			if (!in_array($trait, $uses)) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Due to __NAMESPACE__ inside of traits resolving the traits namespace and not the implementing classes,
	 * this method provides a way to look up the namespace of a FQCN.
	 *
	 * @param $class
	 *
	 * @return null|string
	 */
	public static function getNamespace($class) {
		if (!class_exists($class)) {
			return null;
		}
		$pos = strrpos($class, '\\');
		if ($pos === false) {
			return '';
		}

		return substr($class, 0, $pos);
	}

	public static function buildurl($query) {
		$get = array_merge($_GET, $query);
		$uri = $_SERVER['REQUEST_URI'];
		if (($pos = strpos($uri, '?')) !== false) {
			$uri = substr($uri, 0, $pos);
		}
		return $uri . "?" . http_build_query($get);
	}
}

