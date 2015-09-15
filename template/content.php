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
?>
<div class="ad_links">
	<?php ad_link(); ?>
</div>
<div id="content">
	<div class="dev-warning">This site is still under heavy development.</div>
	<ul id="tab-bar" data-tab class="tabs" role="tablist" data-options="deep_linking:true">
		<li class="tab-title" role="presentational">
			<a href="#" class="tab" role="tab" aria-controls="tabs-lag">Lag View</a>
		</li>
		<li class="tab-title" role="presentational">
			<a href="#" class="tab" role="tab" aria-controls="tabs-all">All View</a>
		</li>
	</ul>
	<div class="tabs-content">
		<section role="tabpanel" aria-hidden="false" class="content active" id="tabs-lag">
	<?php
	switch ($section) {
		case "lag":
		default:
			require_once "sections/reportView.php";
	}
	?>
	<h6 id="depth-view"></h6>
	<div id="depth-view-bg"></div>
	</div>
</div>

<hr/>
<div class="ad_links"><?php ad_link(); ?></div>
