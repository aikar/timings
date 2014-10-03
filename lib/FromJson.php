<?php

/**
 * Provides method to translate JSON Data into an object using PHP Doc comments.
 *
 * @see https://gist.github.com/aikar/52d2ef0870483696f059 for usage
 */
trait FromJson {
	/**
	 * @param $data
	 * @return $this
	 */
	public static function createObject($data, $parentKey = null) {
		$class = __CLASS__;
		$ref = new ReflectionClass($class);
		$props = $ref->getProperties(ReflectionProperty::IS_PUBLIC);
		$obj = new self();

		foreach ($props as $prop) {
			$name = $prop->getName();

			$comment = $prop->getDocComment();
			if (preg_match('/@index ([\w]+)/', $comment, $matches)) {
				$name = $matches[1];
				if ($name == '@key') {
					$prop->setValue($obj, self::getPropertyFromJson($parentKey, $comment, null));
					continue;
				}
			}
			$vars = is_array($data) ? $data : get_object_vars($data);

			if (isset($vars[$name])) {
				$dataEntry = $vars[$name];

				if (is_array($dataEntry)) {
					$result = [];
					foreach ($dataEntry as $key => $entry) {
						$result[$key] = self::getPropertyFromJson($entry, $comment, $key);
					}

					$prop->setValue($obj, $result);
				} else {
					$prop->setValue($obj, self::getPropertyFromJson($dataEntry, $comment, null));
				}
			}
		}
		return $obj;
	}

	/**
	 * @param $data mixed
	 * @param $comment string
	 * @return mixed
	 */
	private static function getPropertyFromJson($data, $comment, $key) {
		$className = null;
		if (preg_match('/@var ([\w_]+)(\[\])?/', $comment, $matches)) {
			$className = $matches[1];
		}
		if (class_exists($className) && in_array(__TRAIT__, class_uses($className))) {
			$data = call_user_func("$className::createObject", $data, $key);
		}
		if (preg_match('/@mapper (.+?)\s/', $comment, $matches)) {
			$data = call_user_func($matches[1], $data);
		}
		return $data;
	}
}
