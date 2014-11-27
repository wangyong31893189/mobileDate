define(function(require, exports, module) {
	var Calender=require("./calender");
	var cal=new Calender({"id":"calender","weekName":"","style":"default","monthCount":"1","vScroll":true,"hScroll":false,"format":"yyyy-MM-dd hh:mm:ss q S 星期w","currentDay":function(data,obj){
		var date=document.getElementById("date");
		if(date)
		{
			date.value=data;
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
	window.cal=cal;
});