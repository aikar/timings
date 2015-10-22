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
$section = @$_GET['section'];
if (!$section) $section = 'lag';
$tabId="base";
if (!empty($_GET['all'])) {
	$tabId = 'all';
}
?>
<div class="ad_links">
	<?php ad_link(); ?>
</div>
<div id="content">
	<div class="dev-warning">This site is still under heavy development.</div>
	<?php ad_banner_top_right(); ?>
	<div id="tab-bar" class="ui-tabs ui-widget ui-widget-content ui-corner-all">
		<ul class="tabs ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all" role="tablist">
			<li class="tab-title ui-state-default ui-corner-top <?=$tabId=="base"?' ui-tabs-active ui-state-active':''?>">
				<a href="<?=Util::buildurl(['all'=>0])?>" class="tab ui-tabs-anchor" role="tab" aria-controls="tabs-lag">Lag View</a>
			</li>
			<li class="tab-title ui-state-default ui-corner-top <?=$tabId=="all"?' ui-tabs-active ui-state-active':''?>">
				<a href="<?=Util::buildurl(['all'=>1])?>" class="tab ui-tabs-anchor" role="tab" aria-controls="tabs-all">All View</a>
			</li>
		</ul>


		<section role="tabpanel" aria-hidden="false" class="content active" id="tabs-lag">
	<?php
	switch ($section) {
		case "lag":
		default:
			require_once "sections/reportView.php";
	}
	?>

	</div>
</div>

<hr/>
<div class="ad_links"><?php ad_link(); ?></div>
