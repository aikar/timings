<?php
use Starlis\Timings\Json\TimingsMaster;
use Starlis\Timings\Template;
use Starlis\Timings\util;

$timingsData = TimingsMaster::getInstance();
$tpl = Template::getInstance();
$system = $timingsData->system;
$motd = $timingsData->motd;
if (is_array($motd)) {
	$motd = implode("\n", $motd);
}
$version = $timingsData->version;
// Support a bug in Sponge that serialized an optional
if (!empty($version['value'])) {
	$version = $version['value'];
}
if ($version === '$version') {
	$version = "Sponge IDE Dev";
}
?>
<div id="server-info" class="section">
		
	<div class="server-title">
		<img class="server-icon" src="image.php?id=<?=util::esc($timingsData->icon)?>" width="48" height="48" />
		<span class="server-name"><?=util::esc($timingsData->server)?></span>
	</div>
	<table>
		<tr>
			<td class="fieldName">Uptime</td>
			<td class="fieldValue"><?=util::esc(round($system->runtime / 60 / 60 / 1000, 2))?>hr</td>
			
			<td class="fieldName">Max Players</td>
			<td class="fieldValue"><?=util::esc($timingsData->maxplayers)?></td>
		</tr>
		<tr>
			<td class="fieldName">Max Memory</td>
			<td class="fieldValue"><?=util::esc($system->maxmem / 1024 / 1024)?>MB</td>
			
			<td class="fieldName">Online Mode</td>
			<td class="fieldValue"><?=($timingsData->onlinemode === true ? "Enabled" : "Disabled")?></td>
		</tr>
		
		<tr>
			<td class="fieldName">MOTD</td>
			<td class="fieldValue" colspan="3"><?=nl2br(util::mccolor(util::esc($motd)))?></td>
		</tr>
		<tr>
			<td class="fieldName">Version</td>
			<td class="fieldValue" colspan="3"><?=util::esc($version)?></td>
		</tr>
	</table>
</div>
