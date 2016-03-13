var UTILS = (function () {

	return {
		addEvent: function(elem, type, handler) {
			if(window.addEventListener)
			{ 
	            elem.addEventListener(type, handler, false);
	        }
	        else if(window.attachEvent) 
	        { 
	            elem.attachEvent('on' + type, handler);
	        }
	        else
	        {
	            elem['on' + type] = handler;
	        }
		},
	};
}());
