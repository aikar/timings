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
if (!$section) $section = 'lag';

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
				<a href="<?=util::buildurl(['section'=>'lag'])?>" class="tab ui-tabs-anchor">Lag View</a>
			</li>
			<li class="tab-title ui-state-default ui-corner-top <?=$section=="all"?' ui-tabs-active ui-state-active':''?>">
				<a href="<?=util::buildurl(['section'=>'all'])?>" class="tab ui-tabs-anchor">All View</a>
			</li>
			<li class="tab-title ui-state-default ui-corner-top <?=$section=="chunks"?' ui-tabs-active ui-state-active':''?>">
				<a href="<?=util::buildurl(['section'=>'chunks'])?>" class="tab ui-tabs-anchor">Chunks View</a>
			</li>
			<!--li class="tab-title ui-state-default ui-corner-top <?=$section=="plugins"?' ui-tabs-active ui-state-active':''?>">
				<a href="<?=util::buildurl(['section'=>'plugins'])?>" class="tab ui-tabs-anchor">Plugin View</a>
			</li-->
		</ul>


		<section aria-hidden="false" class="content active" id="tabs-lag">
	<?php
	switch ($section) {
		case "chunks":
			require_once __DIR__ . "/sections/chunks.php";
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
