var UTILS = (function () {

	return {
		addEvent: function(elem, type, handler) {
			if(window.addEventListener)
			{
			    // new browser
	            elem.addEventListener(type, handler, false);
	        }
	        else if(window.attachEvent)
	        {
	            // old style
	            elem.attachEvent('on' + type, handler);
	        }
	        else
	        {
	            elem['on' + type] = handler;
	        }
		},
		EnsureHTTPPrefix: function (url)
        {
	        if ((!url.startsWith("http://")) && (!url.startsWith("http://")))
            {
                url = "http://" + url;
            }

            return url;
		},

	    //
	    // This function is copied from stackoverflow.
        //
		CheckURL: function (url)
		{
		    var regStr = "^(?!mailto:)(?:(?:http|https|ftp)://)?(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
				           "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|" +
				           "(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*" +
				           "[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)" +
				           "(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$";
		    var regExp = new RegExp(regStr, 'i');

		    return (regExp.test(url));
		}
	};
}());
