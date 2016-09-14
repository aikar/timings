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
global $section;
$section = @$_GET['section'];
if (!$section) $section = 'lagsummary';

?>
<div class="ad_links">
	<?php ad_link(); ?>
</div>
<div id="content">
	<div class="dev-warning">This site is still under heavy development.</div>
	<?php ad_banner_top_right(); ?>
	<!-- http://refills.bourbon.io/#accordion-tabs -->
	<div id="tab-bar" class="ui-tabs ui-widget ui-widget-content ui-corner-all">
		<ul class="tabs ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all">
			<li class="tab-title ui-state-default ui-corner-top <?=$section=="lag"?' ui-tabs-active ui-state-active':''?>">
				<a href="<?=util::buildurl(['section'=>'lag'])?>" class="tab ui-tabs-anchor">Lag Tree View</a>
			</li>
			<li class="tab-title ui-state-default ui-corner-top <?=$section=="all"?' ui-tabs-active ui-state-active':''?>">
				<a href="<?=util::buildurl(['section'=>'all'])?>" class="tab ui-tabs-anchor">All Tree View</a>
			</li>
			<li class="tab-title ui-state-default ui-corner-top <?=$section=="lagsummary"?' ui-tabs-active ui-state-active':''?>">
				<a href="<?=util::buildurl(['section'=>'lagsummary'])?>" class="tab ui-tabs-anchor">Lag Summary View</a>
			</li>
			<li class="tab-title ui-state-default ui-corner-top <?=$section=="summary"?' ui-tabs-active ui-state-active':''?>">
				<a href="<?=util::buildurl(['section'=>'summary'])?>" class="tab ui-tabs-anchor">Summary View</a>
			</li>
			<li class="tab-title ui-state-default ui-corner-top <?=$section=="chunks"?' ui-tabs-active ui-state-active':''?>">
				<a href="<?=util::buildurl(['section'=>'chunks'])?>" class="tab ui-tabs-anchor">Chunks View</a>
			</li>
			<li class="tab-title ui-state-default ui-corner-top <?=$section=="config"?' ui-tabs-active ui-state-active':''?>">
				<a href="<?=util::buildurl(['section'=>'config'])?>" class="tab ui-tabs-anchor">Config</a>
			</li>
			<li class="tab-title ui-state-default ui-corner-top <?=$section=="plugins"?' ui-tabs-active ui-state-active':''?>">
				<a href="<?=util::buildurl(['section'=>'plugins'])?>" class="tab ui-tabs-anchor">Plugin List</a>
			</li>
		</ul>


		<section aria-hidden="false" class="content active" id="tabs-lag">
	<?php
	switch ($section) {
		case "chunks":
			require_once __DIR__ . "/sections/chunksView.php";
			break;
		case "config":
			require_once __DIR__ . "/sections/configView.php";
			break;
		case "summary": case "lagsummary":
			require_once __DIR__ . "/sections/summaryView.php";
			break;
		case "plugins":
			require_once __DIR__ . "/sections/pluginView.php";
			break;
		case "lag":
		case "all":
		default:
			require_once __DIR__ . "/sections/reportView.php";
	}
	?>
		</section>
	</div>
</div>

<hr/>
<div class="ad_links"><?php ad_link(); ?></div>
