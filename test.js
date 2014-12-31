define(function(require, exports, module) {
	var Calender=require("./calender");
	var cal=new Calender({"id":"calender","weekName":"","scroll":false,"more":true,"style":"airticket","tomorrowShow":false,"afterdayShow":false,"header":true,"monthCount":"2","appType":"air","vScroll":true,"hScroll":false,"format":"yyyy-MM-dd hh:mm:ss q S 星期w","currentDay":function(data,obj){
		var date=document.getElementById("date");
		if(date)
		{
			date.value=data;
			cal.hide();
		}
		//alert(obj.innerHTML);
	},"nextDay":function(data,obj){
		var date=document.getElementById("next");
		if(date)
		{
			date.value=data;
		}
		//alert(obj.innerHTML);
	},"prevDay":function(data,obj){
		var date=document.getElementById("prev");
		if(date)
		{
			date.value=data;
		}
		//alert(obj.innerHTML);
	}});

	var date=document.getElementById("date");
	if(date){
		date.onclick=function () {
			cal.init();
			cal.show();
		}

	}
	window.cal=cal;
});