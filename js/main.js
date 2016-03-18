var tabsHashNames = ["#quick-reports", "#my-folders", "#my-team-folders", "#public-folders"];
var quickReportsSavedLinks = [];
var myTeamSavedLinks = [];
var SAVED_LINKS_KEY = "webAppSavedLinks";
var ERROR_CSS_CLASS_NAME = "error-highlight";
var FIELD_NUMBER = 3;

$(document).ready(function () {
    document.location.hash = '#quick-reports';

    UTILS.addEvent(window, "hashchange", gotoCurrentTab);
    $('#goto-quick-reports').click(setHash);
    $('#goto-my-folders').click(setHash);
    $('#goto-team-folders').click(setHash);
    $('#goto-public-folders').click(setHash);
    $('#searchGo').click(linkSearch);
    document.onkeydown = keyboardNav;

    $('.tab-content').hide();
    $('#quick-reports-cont').show();

    $('#qr-wheel').click(function () {
        if (ShowHideElement($('#quick-reports-cont .tab-settings-wrap'))) {
            $('#report01name').focus();
        }
    });

    $('#mf-wheel').click(function () {
        if (ShowHideElement($('#my-team-folders-cont .tab-settings-wrap'))) {
            $('#folder01name').focus();
        }
    });

    $("#report-cancel").click(function () {
        ShowHideElement($('#quick-reports-cont .tab-settings-wrap'));
        return false;
    });

    $("#folders-cancel").click(function () {
        ShowHideElement($('#my-team-folders-cont .tab-settings-wrap'));
        return false;
    });

    $('.tab-content input').blur(function (event) {
        if (event.target.value != "") {
            addRequiredDependency(getCorrespondingField(event.target.id));
        }
        else {
            var field = getCorrespondingField(event.target.id);
            if (field.hasAttribute('required')) {
                field.removeAttribute('required');
            }
        }
    });

    $('#save-quick-settings').click(saveQuickLinks);
    $('#save-folder-settings').click(updateTeamFoldersLinks);

    $('#quick-reports-cont .link-selector').change(function () {
        var selectedURL = this.value;
        $('#quick-report-iframe').attr('src', selectedURL);
        var expandAnchor = $('#quick-reports-cont .GoToURL-icon').get(0).children[0];
        expandAnchor.setAttribute('href', selectedURL);
    });

    $('#my-team-folders-cont .link-selector').change(function () {
        var selectedURL = this.value;
        $('#team-folders-iframe').attr('src', selectedURL);
        var expandAnchor = $('#my-team-folders-cont .GoToURL-icon').get(0).children[0];
        expandAnchor.setAttribute('href', selectedURL);
    });

    $('.GoToURL-icon').click(function (e) {
        window.open(e.target.childNodes[0].href, '_blank');
    });

    readNotification();
    loadFromLocalStorage();
});

//
//
//
function keyboardNav(event)
{
    var currentIndex = tabsHashNames.indexOf(document.location.hash);

    if (event.keyCode === 27) // qto knopka Escape
    {
        if ($.contains($('#quick-reports-cont').get(0), event.target))
        {
            ShowHideElement($('#quick-reports-cont .tab-settings-wrap'));
            return;
        }

        if ($.contains($('#my-team-folders-cont').get(0), event.target))
        {
            ShowHideElement($('#my-team-folders-cont .tab-settings-wrap'));
            return;
        }
    }
    else // strelochki
    {
        if ((currentIndex != -1) && !($.contains($('#quick-reports-cont').get(0), event.target)) && !($.contains($('#my-team-folders-cont').get(0), event.target)))
        {

            if ((event.keyCode === 39) && (currentIndex < 3))
            {
                //
                // arrow ->
                //
                document.location.hash = tabsHashNames[currentIndex + 1];
            }
            else if ((event.keyCode === 37) && (currentIndex > 0))
            {
                //
                // arrow <-
                //
                document.location.hash = tabsHashNames[currentIndex - 1];
            }
        }
    }
}

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

function readNotification()
{
	$.get("data/config.json", "json", function(data){
		if (data["notification"])
		{
		    $('.notifications').text(data["notification"]).removeClass('hidden');
		}
	});
}

function ShowHideElement(element)
{
    if (element.hasClass('hidden'))
	{
        element.removeClass('hidden');
		return true;
	}
	else
	{
        element.addClass('hidden');
		return false;
	}
}

function getCorrespondingField(fieldId)
{
	var newSuffix = ((fieldId.endsWith("name")) ? "url" : "name");
	var newFieldId = fieldId.replace(newSuffix.endsWith("name") ? "url" : "name", newSuffix);
	return ($('#' + newFieldId)[0]);
}

function addRequiredDependency(field)
{
	if(!field.hasAttribute('required'))
	{
		field.setAttribute('required', 'true');
	}
}

function isFormValid(formName)
{
    if ($('#' + formName + ' form:valid').length != 0)
	{
		return true;
    }

	return false;
}

function saveQuickLinks()
{
    $('#quick-reports-cont input:valid').removeClass(ERROR_CSS_CLASS_NAME);
    $('#quick-reports-cont input:invalid').addClass(ERROR_CSS_CLASS_NAME);

    for (i = 1; i <= FIELD_NUMBER; i++)
	{
		var urlField = $('#report0' + i + 'url');
		if ((urlField.get(0).value != "") && (!UTILS.CheckURL(urlField.get(0).value)))
		{
		    urlField.get(0).setCustomValidity('URL is not in a supported format.');
		    urlField.addClass(ERROR_CSS_CLASS_NAME);
		}
		else
		{
			urlField.get(0).setCustomValidity('');
			if ((urlField.get(0).value != "") || !urlField.get(0).hasAttribute('required'))
			{
			    urlField.removeClass(ERROR_CSS_CLASS_NAME);
			}
		}
	}

	if (isFormValid("quick-reports-cont"))
	{
	    ShowHideElement($('#quick-reports-cont .tab-settings-wrap'));
	    quickReportsSavedLinks = [];

	    var linksSelect = $('#quick-reports-cont .link-selector');
        
		for (i = 1; i <= FIELD_NUMBER; i++)
		{
		    var urlField = $('#report0' + i + 'url').get(0);
		    if (urlField.value != "")
		    {
		        urlField.value = UTILS.EnsureHTTPPrefix(urlField.value);
		    }

			if ($('#' + "report0" + i + "name").get(0).value != "")
			{
				quickReportsSavedLinks.push({ value: $('#' + "report0" + i + "url").get(0).value, text: $('#' + "report0" + i + "name").get(0).value });
			}
		}

		fillSelect('#quick-reports-cont .link-selector', quickReportsSavedLinks.length);
		updateLinksInLocalStorage();

		if (quickReportsSavedLinks.length == 0)
		{
			$('#quick-report-iframe').hide();
			linksSelect.hide();
		}
		else
		{
			$('#quick-report-iframe').show();
			linksSelect.show();
			linksSelect.get(0).selectedIndex = (0);
			linksSelect.trigger('change');
		}
	}
}

function updateTeamFoldersLinks()
{
    $('#my-team-folders-cont input:valid').removeClass(ERROR_CSS_CLASS_NAME);
    $('#my-team-folders-cont input:invalid').addClass(ERROR_CSS_CLASS_NAME);

	for (i = 1; i <= FIELD_NUMBER; i++)
	{
		var urlField = $('#folder0' + i + 'url');
		if ((urlField.get(0).value != "") && (!UTILS.CheckURL(urlField.get(0).value)))
		{
		    urlField.addClass(ERROR_CSS_CLASS_NAME);
			urlField.get(0).setCustomValidity('Please enter a valid URL.');
		}
		else
		{
			urlField.get(0).setCustomValidity('');
			if ((urlField.get(0).value != "") || !urlField.get(0).hasAttribute('required'))
			{
			    urlField.removeClass(ERROR_CSS_CLASS_NAME);
			}
		}
	}

	if (isFormValid("my-team-folders-cont"))
	{
	    ShowHideElement($('#my-team-folders-cont .tab-settings-wrap'));
	    myTeamSavedLinks = [];
	    var linksSelect = $('#my-team-folders-cont .link-selector');

	    for (i = 1; i <= FIELD_NUMBER; i++)
		{
		    var urlField = $('#folder0' + i + 'url').get(0);

		    if (urlField.value != "")
		    {
		        urlField.value = UTILS.EnsureHTTPPrefix(urlField.value);
		    }

			var nameField = "folder0" + i + "name";
			if ($('#' + nameField).get(0).value != "")
			{
				myTeamSavedLinks.push({ value: $('#' + "folder0" + i + "url").get(0).value, text: $('#' + nameField).get(0).value });
			}
		}

	    fillSelect('#my-team-folders-cont .link-selector', myTeamSavedLinks.length);
		updateLinksInLocalStorage();

		if (myTeamSavedLinks.length == 0)
		{
			$('#team-folders-iframe').hide();
			linksSelect.hide();
		}
		else
		{
			$('#team-folders-iframe').show();
			linksSelect.show();
			linksSelect.get(0).selectedIndex = (0); 
			linksSelect.trigger('change');
		}
	}
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

        addRequiredDependency($('#' + nameField).get(0));
        addRequiredDependency($('#' + urlField).get(0));
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
	
	fillSelect('#quick-reports-cont .link-selector', quickReportsSavedLinks.length);
	fillSelect('#my-team-folders-cont .link-selector', myTeamSavedLinks.length);
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
		}
	}

	for(i = 0; i < myTeamSavedLinks.length; i++)
	{
		if (myTeamSavedLinks[i].text.toLowerCase().indexOf(searchVal) != -1)
		{
			$('#goto-team-folders').trigger('click');
			$('#my-team-folders-cont .link-selector').get(0).selectedIndex = i;
			$('#my-team-folders-cont .link-selector').trigger('change');
		}
	}

	$('.notifications').removeClass('hidden').text('The search for \"' + searchVal + '\" yielded no results.');
}

function fillSelect(select, len)
{
    for (i = 0; i < len; i++)
    {
        $(select).append($('<option>', myTeamSavedLinks[i]));
    }
}
