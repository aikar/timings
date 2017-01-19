<?php
if (empty($_GET['id'])) {
	$file = "static/img/unknown_server.png";
} else {
	$id = basename(preg_replace('/[^0-9a-f]/', '', $_GET['id']));
	$file = "/tmp/timingsimg_" . basename($_GET['id']);
	if (!file_exists($file)) {
		$file = "static/img/unknown_server.png";
	}
}
header("Content-Type: image/png");
readfile($file);
