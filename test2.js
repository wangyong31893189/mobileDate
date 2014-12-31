define(function(require, exports, module) {
	var Calender=require("./calender");
	var cal=new Calender({"id":"calender","weekName":"","scroll":false,"more":true,"style":"airticket","tomorrowShow":false,"afterdayShow":false,
		"header":true,"monthCount":"2","appType":"air","vScroll":true,"hScroll":false,"format":"yyyy-MM-dd","startShow":true,"endShow":true,"startDay":function(data,obj){
		var date=document.getElementById("startDate");
		if(date)
		{
			date.innerHTML=data;
		}

		alert("接下来选择返程日期");
	},"endDay":function(data,obj){
		var date=document.getElementById("endDate");
		if(date)
		{
			date.innerHTML=data;
		}
		cal.hide();
		//alert(obj.innerHTML);
	}});

	cal.init();
	var date=document.getElementById("startDate");
	if(date){
		date.onclick=function () {
			//cal.init();
			cal.show();			
		}

	}
	var date=document.getElementById("endDate");
	if(date){
		date.onclick=function () {
			//cal.init();
			cal.isSelectEnd=true;
			cal.show();
		}

	}
	window.cal=cal;
});