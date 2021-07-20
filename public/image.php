<?php
$unknownImage = "static/img/unknown_server.png";
if (empty($_GET['id'])) {
	$file = $unknownImage;
} else {
	$id = basename(preg_replace('/[^0-9a-f]/', '', $_GET['id']));
	$file = "/tmp/timingsimg_" . basename($_GET['id']);
	if (!file_exists($file)) {
		$file = $unknownImage;
	}
}
header("Content-Type: image/png");
readfile($file);
