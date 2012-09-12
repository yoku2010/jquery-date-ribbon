$(function(){
	$("#ribbon1").dateRibbon({
		title: "GitHub",
		className: "ribbon",
		href:"https://github.com/yoku2010/jQueryDateRibbon",
		target:"_blank",
		date:new Date()
	});
	$("#ribbon2").dateRibbon({
		titleFormat:"days",
		className: "ribbon",
		href:"https://github.com/yoku2010/jQueryDateRibbon",
		target:"_blank",
		date:new Date(2012,8,12)
	});
});
