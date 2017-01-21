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
<div class="ad_links advert">
	<?php /*ad_link();*/ ?>
</div>
<div id="content">
	<?php ad_banner_top_right(); ?>
	<!-- http://refills.bourbon.io/#accordion-tabs -->
	<div id="tab-bar" class="ui-tabs ui-widget ui-widget-content ui-corner-all">
		<div class="tabs ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all">
			<div class="tab-title <?=$section==="lag"?' active':''?>">
				<a href="<?=util::buildurl(['section'=>'lag'])?>" class="tab ui-tabs-anchor">Lag Tree View</a>
			</div>
			<div class="tab-title <?=$section==="all"?' active':''?>">
				<a href="<?=util::buildurl(['section'=>'all'])?>" class="tab ui-tabs-anchor">All Tree View</a>
			</div>
			<div class="tab-title <?=$section==="lagsummary"?' active':''?>">
				<a href="<?=util::buildurl(['section'=>'lagsummary'])?>" class="tab ui-tabs-anchor">Lag Summary View</a>
			</div>
			<div class="tab-title <?=$section==="summary"?' active':''?>">
				<a href="<?=util::buildurl(['section'=>'summary'])?>" class="tab ui-tabs-anchor">Summary View</a>
			</div>
			<div class="tab-title <?=$section==="chunks"?' active':''?>">
				<a href="<?=util::buildurl(['section'=>'chunks'])?>" class="tab ui-tabs-anchor">Chunks View</a>
			</div>
			<div class="tab-title <?=$section==="config"?' active':''?>">
				<a href="<?=util::buildurl(['section'=>'config'])?>" class="tab ui-tabs-anchor">Config</a>
			</div>
			<div class="tab-title ui-state-default ui-corner-top <?=$section==="plugins"?' ui-tabs-active ui-state-active':''?>">
				<a href="<?=util::buildurl(['section'=>'plugins'])?>" class="tab ui-tabs-anchor">Plugin List</a>
			</div>
		</div>


		<section aria-hidden="false" class="content active" id="tabs-lag">
	<?php
	global $timingsDataLoaded;
	if (!$timingsDataLoaded) {
		?>
			<div>Oops! It looks like the Timings you were trying to load does not exists anymore! Timings are only stored for 30 days after access.</div>
			<?php
	} else {
		switch ($section) {
			case "chunks":
				require_once __DIR__ . "/sections/chunksView.php";
				break;
			case "config":
				require_once __DIR__ . "/sections/configView.php";
				break;
			case "summary":
			case "lagsummary":
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
	}
	?>
		</section>
	</div>
</div>

<!--<hr/>-->
<div class="ad_links"><?php ad_link(); ?></div>
