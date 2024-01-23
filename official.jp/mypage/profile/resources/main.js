var windowWidth = $(window).width();
var windowSm = 900;
if (windowWidth <= windowSm) {
const element = document.getElementById('pc-lang'); 
element.remove();
} else {
const element = document.getElementById('sp-lang'); 
element.remove();
}

window.addEventListener('DOMContentLoaded', (event) => {
  if (document.querySelector(".pagination .prev .page-link")) {
    document.querySelector(".pagination .prev .page-link").innerText = "<<";
  }
  if (document.querySelector(".pagination .next .page-link")) {
    document.querySelector(".pagination .next .page-link").innerText = ">>";
  }
});


$(function() {

	$('.lune_btn').on('click', function(){
		$('#lune .menuarea').fadeToggle(600);
		$('.lune_btn .hamburger').toggleClass('active');
		$('.lune_btn .menu').toggleClass('active');
		$('.official_btn').fadeToggle(600);
		return false;
	});

	$('.official_btn').on('click', function(){
		$('#official .menuarea').fadeToggle(600);
		$('.ofs_btn2').toggleClass('active');
		$('.ofs_btn').fadeToggle(0);
		$('.lune_btn').fadeToggle(600);
		return false;
	});

});

for (var i = 1; i < 20; i++) {
  ['for_admission', 'create', 'edit'].forEach(function(prefix) {
    var e = $('label[for="' + prefix + '_profiles_' + i + '_hidden"]');
    if (e.length > 0) {
      e.parent().hide();
    }
  });
}