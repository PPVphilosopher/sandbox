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






// <script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-67843785-1', 'auto');
  ga('send', 'pageview');

// </script>