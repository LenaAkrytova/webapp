var tabsHashNames = ["#quick-reports", "#my-folders", "#my-team-folders", "#public-folders"];

$(document).ready(function () {
    document.location.hash = '#quick-reports';
    UTILS.addEvent(window, "hashchange", gotoCurrentTab);
    $('#goto-quick-reports').click(setHash);
    $('#goto-my-folders').click(setHash);
    $('#goto-team-folders').click(setHash);
    $('#goto-public-folders').click(setHash);
    $('.tab-content').hide();
    $('#quick-reports-cont').show();
});

function setHash()
{
	var pageTop = $(window).scrollTop();
	document.location.hash = $(this).attr("href");
	$(window).scrollTop(pageTop);
}

function gotoCurrentTab()
{
    var tabName = document.location.hash.substring(1);
	var tabBtn = tabName + "-tabBtn";
	tabName += "-cont";

	$(".tabs li").removeClass('active-tab');
	$('#' + tabBtn).addClass('active-tab');

	$(".tab-content").hide();
	$('#' + tabName).show();
}
