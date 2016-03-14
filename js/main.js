var tabsHashNames = ["#quick-reports", "#my-folders", "#my-team-folders", "#public-folders"];
var quickReportsSavedLinks = [];
var myTeamSavedLinks = [];
var SAVED_LINKS_KEY = "webAppSavedLinks";

$(document).ready(function () {
    document.location.hash = '#quick-reports';
    UTILS.addEvent(window, "hashchange", gotoCurrentTab);
    $('#goto-quick-reports').click(setHash);
    $('#goto-my-folders').click(setHash);
    $('#goto-team-folders').click(setHash);
    $('#goto-public-folders').click(setHash);
    $('#searchGo').click(linkSearch);

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

    // sohranit` linki
    updateLinksInLocalStorage();		
}

function updateLinksInLocalStorage()
{
    // $ - eto prosto separator
	var linksToSave = JSON.stringify(quickReportsSavedLinks) + '$' + JSON.stringify(myTeamSavedLinks) + '$' + document.location.hash;
	localStorage.setItem(SAVED_LINKS_KEY, linksToSave);
}

//
// dirty code belowe handling element names
//
function populateSettingsForm(fromData, fieldNamePrefix)
{
    for (i = 0; i < fromData.length; i++)
    {
        var nameField = fieldNamePrefix + (i + 1) + "name";
        var urlField = fieldNamePrefix + (i + 1) + "url";

        $('#' + urlField).get(0).value = fromData[i].value;
        $('#' + nameField).get(0).value = fromData[i].text;
    }
}

function loadFromLocalStorage()
{
    var savedData = localStorage.getItem(SAVED_LINKS_KEY);

	if (savedData)
	{
	    quickReportsSavedLinks = JSON.parse(savedData.split('$')[0]);
	    myTeamSavedLinks = JSON.parse(savedData.split('$')[1]);

	    var savedHash = savedData.split('$')[2];
	    if (savedHash)
	    {
	        document.location.hash = savedHash;
	    }
	    else
	    {
	        document.location.hash = "#quick-reports";
	    }
	}	
	
	populateSettingsForm(quickReportsSavedLinks, "report0");
	populateSettingsForm(myTeamSavedLinks, "folder0");

	if (quickReportsSavedLinks.length != 0)
	{
		$('#quick-reports-cont .link-selector').get(0).selectedIndex = 0;
		$('#quick-reports-cont .link-selector').trigger('change');
		$('#quick-reports-cont .tab-settings-wrap').addClass('hidden');
	}
	else
	{
		$('#quick-report-iframe').hide();
		$('#quick-reports-cont .link-selector').hide();
	}

	if (myTeamSavedLinks.length != 0)
	{
		$('#my-team-folders-cont .link-selector').get(0).selectedIndex = 0;
		$('#my-team-folders-cont .link-selector').trigger('change');
		$('#my-team-folders-cont .tab-settings-wrap').addClass('hidden');
	}
	else
	{		
		$('#team-folders-iframe').hide();
		$('#my-team-folders-cont .link-selector').hide();
	}
}

function linkSearch(e)
{
	e.preventDefault(); // chto qto i zachem - poka neyasno
	var searchVal = $('#q').get(0).value.toLowerCase();

	for(i = 0; i < quickReportsSavedLinks.length; i++)
	{
		if (quickReportsSavedLinks[i].text.toLowerCase().indexOf(searchVal) != -1)
		{
		    $('#goto-quick-reports').trigger('click');
			$('#quick-reports-cont .link-selector').get(0).selectedIndex = i;
			$('#quick-reports-cont .link-selector').trigger('change');
			return;
		}
	}

	for(i = 0; i < myTeamSavedLinks.length; i++)
	{
		if (myTeamSavedLinks[i].text.toLowerCase().indexOf(searchVal) != -1)
		{
			$('#goto-team-folders').trigger('click');
			$('#my-team-folders-cont .link-selector').get(0).selectedIndex = i;
			$('#my-team-folders-cont .link-selector').trigger('change');
			return;
		}
	}

	$('.notifications').removeClass('hidden').text('The search for \"' + searchVal + '\" yielded no results.');
}
