<div class="topright" style="float:right;">
	&copy; Aikar of <a href='http://ref.emc.gs/?gas=timingsphp' rel="nofollow">Empire Minecraft</a>
	<a href="?src" title="Source Code">[source]</a>
	<br /><br />
	<?php ad_banner_top_right(); ?>

</div>

<button id="paste_toggle">Paste Contents</button>
<form id="url" method="POST"  style="padding-top: 5px">
	Paste ID:

	<input type="text" name="url" value="<?php
	echo htmlentities($_REQUEST['url']);?>" style="width: 240px"/>
	<input type="submit" value="View"/>
</form>
<br />
(Press Paste Contents and paste your timings to get a shareable link)


<!--form id="paste" method='post' style="display:none">
	<br/>
	<textarea id="uploadbox" name='timings' cols="100" rows="8"><?php echo htmlentities($file); ?></textarea>
	<input type='submit' value='Paste'/>
</form-->

<div syle="text-align:center;margin:auto">

	<p>For the advanced timings data, you need to use Spigot:
		<a href="http://spigotmc.org" title="Spigot">spigotmc.org</a>.<br />
		CraftBukkit timings are not as useful as Spigot Timings.<br/>
	</p>
	<?php ad_link_top(); ?>
</div>
<hr/>
