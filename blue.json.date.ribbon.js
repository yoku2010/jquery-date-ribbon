/*
===========================================================================
* jQuery Date Ribbon
* Created by - Yogesh Kumar
* Version - 1.0
* Date - 21-June-2012
* browser - IE7+, FF3.6+,Chrome10+
* Website - http://www.bluejson.in
* This JQuery File use to create date ribbon
* Requires jquery-1.4.2.js or higher
* Copyright (c) 2012 Yogesh Kumar (http://www.bluejson.in or http://www.bluejson.com)
===========================================================================
*/
(function($) {
	$.fn.extend({
		dateRibbon: function (settings) {
			settings = jQuery.extend({
				title: null,						// use this if you want to change title of the date ribbon.
				titleFormat: "days",					// value - days,weeks,months,years.
				className: "ribbon",					// use this if you want to set class or theme of date ribbon.
				href:"#",						// date ribbon href location or JavaScript function name.
				target:null,						// href location target (_blank|_self|_parent|_top|frame-name)
				date:new Date(),					// date to show in date ribbon.
				functionBefore: function () { return true; },		// use this if you want to fire a function just before date ribbon load.
				functionAfter: function () {}				// use this if you want to fire a function just after date ribbon load.
			}, settings);

			return this.each(function () {
				new $.createDateRibbon(this, settings);			// create date ribbon.
			});
		}
	});
	$.browser = {};
	(function () {
		$.browser.msie = false;
		$.browser.version = 0;
		if (navigator.userAgent.match(/MSIE ([0-9]+)\./)) {
			$.browser.msie = true;
			$.browser.version = RegExp.$1;
		}
	})();
	$.createDateRibbon = function(thisObj,options){
		var drObj = {
			version:"1.0",					// this stores the version of date ribbon.
			author:"Yogesh Kumar",				// this stores the author name.
			website:"www.bluejson.com",			// this stores website name.
			obj: {
				$this: $(thisObj)			// create container object.
			},
			id: {},
			cl: {
				ribbonA: options.className,		// ribbon Anchor class
				ribbonPieceDiv:"ribbon-piece",		// ribbon division class
				ribbonTopDiv:"top",			// ribbon top division class
				ribbonBottomDiv:"bottom",		// ribbon bottom division class
				ribbonTailDiv:"tail",			// ribbon tail division class
				ribbonTailLeftDiv:"left",		// ribbon left division class
				ribbonTailRightDiv:"right"		// ribbon right division class
			},
			monthNames: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sept", "Oct", "Nov", "Dec" ],	// months name in English
			ribbonFunction:
			{
				// main function to creates date ribbon
				init:function(){
					// functionBefore() function call before date ribbon creation.
					// functionBefore() return true than it will create date ribbon.
					if(options.functionBefore() == true)
					{
						drObj.obj.$this.html("");					// make container empty.
						drObj.ribbonFunction.createRibbonA().appendTo(drObj.obj.$this);	// create date ribbon.
						options.functionAfter();					// call functionAfter() function after ribbon creation
					}
				},
				// to create ribbon anchor.
				createRibbonA:function(){
					var $ribbonA = $("<a/>").addClass(drObj.cl.ribbonA);			// create ribbon anchor object
					var date = drObj.ribbonFunction.getMonthAndDay();			// get Month and Day
					options.title = drObj.ribbonFunction.createTitle();			// create title for ribbon anchor
					$ribbonA.attr({"href":options.href,"title":options.title});		// add attributes (href,title) on ribbon anchor
					if(options.target!=null)
						$ribbonA.attr("target",options.target);				// add target attribute on ribbon anchor
					drObj.ribbonFunction.createTopRibbon(date.month).appendTo($ribbonA);	// create top ribbon and append it to ribbon anchor
					drObj.ribbonFunction.createBottomRibbon(date.day).appendTo($ribbonA);	// create bottom ribbon and append it to ribbon anchor
					drObj.ribbonFunction.createTailRibbon().appendTo($ribbonA);		// create tail ribbon and append it to ribbon anchor
					return $ribbonA;							// return ribbon anchor object
				},
				// to create top ribbon
				createTopRibbon:function(month){
					var $topDiv = $("<div/>").addClass(drObj.cl.ribbonTopDiv).addClass(drObj.cl.ribbonPieceDiv).html(month);	// create top ribbon object
					return $topDiv;								// return top ribbon object
				},
				// to create bottom ribbon
				createBottomRibbon:function(day){
					var $bottomDiv = $("<div/>").addClass(drObj.cl.ribbonBottomDiv).addClass(drObj.cl.ribbonPieceDiv).html(day);	// create bottom ribbon object
					return $bottomDiv;							// return bottom ribbon object
				},
				// to create ribbon tail
				createTailRibbon:function(){
					var $tailDiv = $("<div/>").addClass(drObj.cl.ribbonTailDiv);							// create tail ribbon object
					var $tailLeftDiv = $("<div/>").addClass(drObj.cl.ribbonTailLeftDiv).addClass(drObj.cl.ribbonPieceDiv);		// create left tail ribbon object
					$tailLeftDiv.appendTo($tailDiv);
					var $tailRightDiv = $("<div/>").addClass(drObj.cl.ribbonTailRightDiv).addClass(drObj.cl.ribbonPieceDiv);	// create tail right ribbon object
					$tailRightDiv.appendTo($tailDiv);
					//Hack for IE.
					if($.browser.msie == true)
					{
						$tailLeftDiv.css({"left":"-25px"});
						$tailRightDiv.css({"right":"-25px"});
						$tailDiv.css({
							"width":"33px",
							"border-right":"1px solid #666",
							"border-left":"1px solid #666",
							"border-top":"0px none",
							"border-bottom":"0px none"
						});
					}
					return $tailDiv;							// return tail ribbon object
				},
				// to get the month and day from date object
				getMonthAndDay:function(){
					var date = {month:drObj.monthNames[options.date.getMonth()],day:options.date.getDate()};
					return date;
				},
				// to create title for ribbon anchor
				createTitle:function(){
					if(options.title == undefined || options.title == null)
					{
						var today = new Date(),title="";
						var timestamp = 0;
						var formate = {
							minutes:1000*60,
							hours:1000*60*60,
							days:1000*60*60*24,
							weeks:1000*60*60*24*7,
							months:1000*60*60*24*30,
							years:1000*60*60*24*365
						};
						// check date object and today date equal or not
						if (today.getMonth() == options.date.getMonth() && today.getDate() == options.date.getDate() && today.getFullYear() == options.date.getFullYear())
						{
							title = "Today"
						}
						// check today date is less then user given date
						else if(options.date > today)
						{
							timestamp = drObj.ribbonFunction.getDateDifference(options.date,today);
							title = parseInt(timestamp/formate[options.titleFormat]) + " " + options.titleFormat + " ahead";
						}
						// check today date is greater then user given date
						else if (options.date < today)
						{
							timestamp = drObj.ribbonFunction.getDateDifference(today,options.date);
							title = parseInt(timestamp/formate[options.titleFormat]) + " " + options.titleFormat + " ago";
						}
						return title;							// return title
					}
					else
					{
						return options.title;						// return user defined title
					}
				},
				// to get the difference between two dates (in ms).
				getDateDifference:function(date1, date2){
					return date1.getTime() - date2.getTime();
				}
			}
		};
		// calling main function to create date ribbon
		drObj.ribbonFunction.init();
	};
})(jQuery);
