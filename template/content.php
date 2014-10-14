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
?>
<div class="ad_links"><?php
ad_link(); ?></div>
<div id="content">
This site is still under heavy development.

    <?php
    switch ($_GET['section']) {
        case "lag":
        default:
            require_once "sections/lag/lagView.php";
    }
    ?>
</div>

<hr/>
<div class="ad_links"><?php ad_link(); ?></div>
