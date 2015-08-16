var troll_on = false;
var backup = null;

function troll () {
	backup = $('body').clone();
	$('body').html('<img src="pic/TrollFace.png" style="width:100%; height:100%;">');
}

if (troll_on) troll();

function troll_off () {
	$('body').replaceWith(backup);
	init();
}