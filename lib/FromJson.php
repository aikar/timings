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
	public static function createObject($data) {
		$class = __CLASS__;
		$ref = new ReflectionClass($class);
		$props = $ref->getProperties(ReflectionProperty::IS_PUBLIC);
		$obj = new self();

		foreach ($props as $prop) {
			$name = $prop->getName();

			$comment = $prop->getDocComment();
			if (preg_match('/@index (.+)/', $comment, $matches)) {
				$name = $matches[1];
			}
			$vars = is_array($data) ? $data : get_object_vars($data);

			if (isset($vars[$name])) {
				$dataEntry = $vars[$name];

				if (is_array($dataEntry)) {
					$result = [];
					foreach ($dataEntry as $entry) {
						$result[] = self::getPropertyFromJson($entry, $comment);
					}

					$prop->setValue($obj, $result);
				} else {
					$prop->setValue($obj, self::getPropertyFromJson($dataEntry, $comment));
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
	private static function getPropertyFromJson($data, $comment) {
		$className = null;
		if (preg_match('/@var ([\w_]+)(\[\])?/', $comment, $matches)) {
			$className = $matches[1];
		}
		if (class_exists($className) && in_array(__TRAIT__, class_uses($className))) {
			$data = call_user_func("$className::createObject", $data);
		}
		return $data;
	}
}
