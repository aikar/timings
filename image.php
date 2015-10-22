<?php
if (empty($_GET['id'])) {
	die;
}
$id = basename(preg_replace('/[^0-9a-f]/', '', $_GET['id']));
$file = "/tmp/timingsimg_" . basename($_GET['id']);
if (!file_exists($file)) {
	die;
}
header("Content-Type: image/png");
readfile($file);
