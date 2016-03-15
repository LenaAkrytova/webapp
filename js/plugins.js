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
	};
}());
