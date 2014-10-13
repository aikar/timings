/*
 * Aikar's Minecraft Timings Parser
 *
 * Written by Aikar <aikar@aikar.co>
 * http://aikar.co
 * http://starlis.com
 *
 * @license MIT
 */

$(document).ready(function() {
    $('#paste_toggle').click(function() {
        $('#paste').toggle();
    });
    $('.show_rest').click(function() {
        $(this).parent().find('.hidden').toggle();
    })
});
