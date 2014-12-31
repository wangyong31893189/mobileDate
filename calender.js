define(function(require, exports, module) {

	function prefixStyle (style) {
	if ( vendor === '' ) return style;

	style = style.charAt(0).toUpperCase() + style.substr(1);
	return vendor + style;
}

var doc=document;
var m = Math,dummyStyle = doc.createElement('div').style,
	vendor = (function () {
		var vendors = 't,webkitT,MozT,msT,OT'.split(','),
			t,
			i = 0,
			l = vendors.length;

		for ( ; i < l; i++ ) {
			t = vendors[i] + 'ransform';
			if ( t in dummyStyle ) {
				return vendors[i].substr(0, vendors[i].length - 1);
			}
		}

		return false;
	})(),// Style properties
	cssVendor = vendor ? '-' + vendor.toLowerCase() + '-' : '',
	transform = prefixStyle('transform'),
	transitionProperty = prefixStyle('transitionProperty'),
	transitionDuration = prefixStyle('transitionDuration'),
	transformOrigin = prefixStyle('transformOrigin'),
	transitionTimingFunction = prefixStyle('transitionTimingFunction'),
	transitionDelay = prefixStyle('transitionDelay'),isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),
			hasTouch = 'ontouchstart' in window && !isTouchPad,
			hasTransform = vendor !== false,
			hasTransitionEnd = prefixStyle('transition') in dummyStyle,

			RESIZE_EV = 'onorientationchange' in window ? 'orientationchange' : 'resize',
			START_EV = hasTouch ? 'touchstart' : 'mousedown',
			MOVE_EV = hasTouch ? 'touchmove' : 'mousemove',
			END_EV = hasTouch ? 'touchend' : 'mouseup',
			CANCEL_EV = hasTouch ? 'touchcancel' : 'touchcancel';
			TRNEND_EV = (function () {
				if ( vendor === false ){
					return false;
				}

				var transitionEnd = {
						''			: 'transitionend',
						'webkit'	: 'webkitTransitionEnd',
						'Moz'		: 'transitionend',
						'O'			: 'otransitionend',
						'ms'		: 'MSTransitionEnd'
					};

				return transitionEnd[vendor];
			})();
	var Calender=function(options){
		this.options={
			id:"calender",
			scroll:true,//是否需要滑动
			weekName:"星期",//星期前缀
			style:"default",//默认皮肤
			single:true,//是否只显示一个月
			monthCount:3,//显示的月份数量
			appType:"air",  //适用的应用类型
			oneByOne:true,//是否需要 一月一月的滚动  true为需要  false为不需要
			container:"window",  //外层容器   默认为整个窗口   其它则填写对应的ID
			max:3,//可以向后查看3个月
			min:3,//可以向前查看3个月
			vScroll:true,//竖向
			more:false,//是否显示加载更多按钮
			moreName:"点击加载更多",//显示加载更多按钮上的文字
			header:false,//是否需要头部
			headerName:"选择日期",//头部显示名称
			hScroll:false,//横向 
			animateTime:500,//动画时间
			todayShow:true,//是否显示今天 
			todayShowName:"今天",//显示今天名称  默认今天
			tomorrowShow:true,//是否显示明天 
			tomorrowShowName:"明天",//显示明天名称  默认明天
			afterdayShow:true,//是否显示后天 			
			afterdayShowName:"后天",//显示后天的名称  比如后天  aftertommorrow 
			startShow:false,//是否显示启程
			startShowName:"出发",//显示启程名称
			endShow:false,//是否显示返程
			endShowName:"返程",//显示返程名称
			selectDay:function(index){ //选择日期
				console.log("选择日期成功！");
			},
			nextDay:function(){
				console.log("选择下一天成功！");
			},
			currentDay:function(){
				console.log("选择当天成功！");
			},
			prevDay:function(){
				console.log("选择上一天成功！");
			},
			startDay:function(){
				console.log("选择开始时间！");
			},endDay:function(){
				console.log("选择结束时间！");
			},
			format:"yyyy-MM-dd",
			year:"",
			month:"",
			day:"",
			week:""
		};
		for(var i in options ){
			this.options[i]=options[i];
		}
		
		this.initFlag=false;//是否进行过初始化
		//this.init();
	}
	
	var Pos=function (){
		this.x=0;
		this.y=0;
	};
	var startPos=new Pos();
	var movePos=new Pos();
	var endPos=new Pos();
	
	function getViewSizeWithoutScrollbar(){//不包含滚动条 
		return { 
		width : document.body.offsetWidth, 
		height: document.documentElement.clientHeight
		};
	} 
	function getViewSizeWithScrollbar(){//包含滚动条 
		if(window.innerWidth){ 
			return { 
				width : window.innerWidth, 
				height: window.innerHeight 
			};
		}else if(document.documentElement.offsetWidth == document.documentElement.clientWidth){ 
			return { 
			width : document.documentElement.offsetWidth, 
			height: document.documentElement.offsetHeight 
			};
		}else{ 
			return { 
				width : document.documentElement.clientWidth + getScrollWith(), 
				height: document.documentElement.clientHeight + getScrollWith() 
			};
		} 
	}
	
	Calender.prototype={
		$:function(id){
			return typeof(id)==="object"?id:document.getElementById(id);
		},
		init:function(){
			var that=this;
			if(that.initFlag){
				return;
			}
			var calender=that.calender=that.$(that.options.id);

			if(!calender){
				//var calenderHtml='';
				var calenderArr=[];
				calenderContainer=document.createElement("div");
				//calender.setAttribute("id","calender");
				calenderContainer.setAttribute("class","cal_container");
				if(that.options.header){
					calenderArr.push('<div class="cal_head"><div class="cal_prev" id="cal_prev">&lt;--</div><div class="cal_head_title">'+that.options.headerName+'</div><div class="cal_head_menu"></div></div>');
				}
				calenderArr.push('<div class="calender" id="calender"></div>');					
				if(that.options.more){
					calenderArr.push('<button id="cal_more" class="cal_more">'+that.options.moreName+'</botton>');
				}
				calenderContainer.innerHTML=calenderArr.join("");
				document.body.appendChild(calenderContainer);
				calender=that.calender=that.$(that.options.id);
			}
			/*
			if(!calenderBg){
				var calenderHtml='';
				calenderBg=that.calenderBg=document.createElement("div");
				calenderBg.setAttribute("id","cal_bg");
				calenderBg.setAttribute("class","cal_bg"+style);
				document.body.appendChild(calenderBg);
			}*/

			var unit=that.unit="width";
			var moveBy=that.moveBy="marginLeft";
			var moveStyleBy=that.moveStyleBy="margin-left";			
			if(that.options.vScroll){//竖向滚动
				unit=that.unit="heightt";
				moveBy=that.moveBy="marginTop";
				moveStyleBy=that.moveStyleBy="margin-top";
			}
			var wh={width:0,height:0};
			if(that.options.container==="window"){
				wh=getViewSizeWithoutScrollbar();
			}else{
				var container=that.$(that.options.container);
				if(container){
					wh={width:container.offsetWidth,height:container.offsetHeight};
				}
			}
			if(that.options.hScroll&&!that.options.vScroll){//横向滚动 true 并且竖向滚动为false
				browserWidth=that.browserWidth=that.options.containerWidth;
				if(!browserWidth){
					browserWidth=that.browserWidth=wh.width;			
				}
			}else if(!that.options.hScroll&&that.options.vScroll){//横向滚动 false 并且竖向滚动为 true
				browserWidth=that.browserWidth=that.options.containerHeight;
				if(!browserWidth){
					browserWidth=that.browserWidth=wh.height;		
				}
			}else{
				console.error("对不起，滚动方向请重新设置！");
				slider.style.display="none";
				return false;
			}
			that.sliderType={"ease":"cubic-bezier(0.25, 0.1, 0.25, 1.0)","linear":"cubic-bezier(0.0, 0.0, 1.0, 1.0)","ease-in":"cubic-bezier(0.42, 0, 1.0, 1.0)","ease-out":"cubic-bezier(0, 0, 0.58, 1.0)",  "ease-in-out":"cubic-bezier(0.42, 0, 0.58, 1.0)"};
			that.sliderFunc=that.sliderType[that.options.scrollType];
			that.calender.style[transitionProperty] = that.options.useTransform ? cssVendor + 'transform' : moveStyleBy;
			that.calender.style[transitionDuration] =that.options.animateTime/1000+"s";
			that.calender.style[transformOrigin] = '0 0';
			if (that.options.useTransition){
				that.calender.style[transitionTimingFunction] =that.sliderFunc;		
			}
			//var sliderList=that.sliderList=calender.getElementsByTagName("table");
			//var length=that.length=sliderList.length;
			calender.parentNode.style[unit]=browserWidth+"px";
			var weekName=that.options.weekName;
			var weekArray=that.weekArray=[weekName+"日",weekName+"一",weekName+"二",weekName+"三",weekName+"四",weekName+"五",weekName+"六"];
			//var monthArray=["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"];
			var monthArray=that.monthArray=["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];
			seajs.use("./"+that.options.style+".css");
			//slider.width=""
			/*for(var i=0;i<length;i++){				
				sliderList[i].style[unit]=browserWidth+"px";				
			}*/			
			//calender.style[unit]=browserWidth*length+"px";
			//for (var i =0,len= calenders.length; i<len; i++) {				
			that.showCalender(calender);

			this.initFlag=true;
			this.isSelectEnd=false;
		},
		show:function(){
			var that=this;
			that.calender.parentNode.style.display="block";
			//that.calenderBg.style.display="block";
			//that.reloadCalender(calender);
			//that.bindCalenderEvent(calender);
		},hide:function(){
			var that=this;
			that.calender.parentNode.style.display="none";
			//that.calenderBg.style.display="block";
			//that.reloadCalender(calender);
			//that.bindCalenderEvent(calender);
		},
		showCalender:function(calender){//显示日历框架 year 显示的年份   month显示的月份
			var that=this;			
			that.reloadCalender(calender);

			var scroll=that.options.scroll;
			if(scroll){			
				that._bind(START_EV,null,function(e){that.handlerEvent(e,that)});//绑定鼠标按下或触摸开始事件
				that._bind(MOVE_EV,null,function(e){that.handlerEvent(e,that)});//绑定鼠标移动或触摸移动事件
				that._bind(END_EV,null,function(e){that.handlerEvent(e,that)});//绑定鼠标弹上或触摸停止事件
			}
			/*that._bind(CANCEL_EV,null,function(e){
				clearInterval(that.intervalId);
			});//绑定鼠标弹上或触摸取消事件
			that._bind(RESIZE_EV,window,function(e){//绑定窗口放大缩小或设备横竖事件
				clearInterval(that.intervalId);
				that.refresh();
				that.loadRun();
			});*/
		},dateFormat:function(format,date){ 
			var that=this;		
			var o = { 
				"M+" : date.getMonth()+1, //month 
				"d+" : date.getDate(), //day 
				"h+" : date.getHours(), //hour 
				"m+" : date.getMinutes(), //minute 
				"s+" : date.getSeconds(), //second 
				"q+" : Math.floor((date.getMonth()+3)/3), //quarter 
				"w+" : that.weekArray[date.getDay()], //quarter 
				"S" : date.getMilliseconds() //millisecond 
			};
			if(/(y+)/.test(format)){ 
				format = format.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length)); 
			} 
			for(var k in o) { 
				if(new RegExp("("+ k +")").test(format)) { 
					format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length)); 
				} 
			} 
			return format; 
		},
		reloadCalender:function(calender,year,month){//calender 日历对象  year 年份   month 月份  monthCount 显示的月份数量
			var that=this;		
			calender.innerHTML="";
			var unit=that.unit;
			if(that.options.monthCount){
				var count=that.options.monthCount;
				for(var i=0;i<count;i++){					
					that.appendMonth(calender,year,month,i,"append");			
				}
			}else{				
				that.appendMonth(calender,year,month,0);
			}
			var unit=that.unit;
			var sliderList=that.sliderList=calender.getElementsByTagName("div");
			var length=that.length=sliderList.length;
			var browserWidth=that.browserWidth;
			for(var i=0;i<length;i++){
				sliderList[i].style[unit]=browserWidth-2+"px";
			}
			calender.style[unit]=browserWidth*length+"px";
	    	//calender.getElementsByTagName("div");
	    	//$(calender.find(".cal_show")).fadeIn("slow");
		},
		appendMonth:function(calender,year,month,index,type){//日历显示类型 是附加还是替换  append 附加   before 插入   replace替换
	    	var that=this;
			var count=that.options.monthCount;
			var weekArray=that.weekArray;
			//var monthArray=["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"];
			var monthArray=that.monthArray;
			if(!index){
				index=0;
			}
			var tempDate=new Date();
			tempDate.setDate(1);
			if(!year){
				year=tempDate.getFullYear();
			}else{
				tempDate.setYear(year);
			}
			if(!month){
				month=tempDate.getMonth()+1;
				//if(!index&&index!=0){
					//month=month+index;
					/*if(month>12){
						year+=1
						month=1;
					}else if(month<1){
						year-=1;
						month=12;
					}*/					
					//tempDate.setYear(year);
					tempDate.setMonth((month+index-1));
				//}else{
				//	tempDate.setMonth(month);
				//}
			}else{
				//month=tempDate.getMonth()+1;
				//month=month+index;
				/*if(month>12){
					year+=1
					month=1;
				}else if(month<1){
					year-=1;
					month=12;
				}*/
				//tempDate.setYear(year);
				tempDate.setMonth(month+index-1);
			}
					
			year=tempDate.getFullYear();
			month=tempDate.getMonth()+1;
			that.options.year=year;
			that.options.month=month;
			var day=tempDate.getDate();			
			that.options.day=day;
			var week=tempDate.getDay();
			that.options.week=week;
			var today=new Date();
			var todayYear=that.todayYear=today.getFullYear();//当前年份
			var todayDay=today.getDate();//当前年份月份的天数
			var todayMonth=that.todayMonth=today.getMonth()+1;////当前年份月份
			
			var calendarArr=[];
			calendarArr.push('<div class="cal_month_container"><table id=\"calender_'+year+'_'+month+'\"><tbody><tr class="cal_month">');			
			calendarArr.push('<td colspan="9"></td>');
			calendarArr.push('</tr><tr class="cal_week"></tr></tbody></table></div>');
			var calendarHtml=calendarArr.join("");
			switch(type){
				case "append":
					calender.innerHTML+=calendarHtml;
					break;
				case "before":
					calender.innerHTML=calendarHtml+calender.innerHTML;
					break;
				case "replace":
				default:
					calender.innerHTML=calendarHtml;
					break;
			}			
			
			if(index==0){
				var tableCount=calender.children.length;
				if(tableCount==1){
					that.minYear=year;
					that.minMonth=month;
					that.maxYear=year;
					that.maxMonth=month;
				}else{
					that.maxYear=year;
					that.maxMonth=month;
				}
			}else if(index==count-1){
				that.maxYear=year;
				that.maxMonth=month;
			}	
			
	    	var weekHtml="";
			var weekArr=[];
			var style=that.options.style;//日历皮肤
			var sliderList=that.sliderList=calender.getElementsByTagName("div");					
			var length=that.length=sliderList.length;
			var single=that.options.single;			
			if(style=="style1"&&single){
				weekArr.push('<td rowspan="8" class="cal_prev">上一月</td>');
				//weekArr.push('<td class="cal_prev">上一月</td>');
			}
	    	for (var i =0; i<7; i++) {						
	    		weekArr.push("<td>"+weekArray[i]+"</td>");
	    	}
			if(style=="style1"&&single){
				weekArr.push('<td rowspan="8" class="cal_next">下一月</td>');
				//weekArr.push('<td class="cal_next">下一月</td>');
			}
			weekHtml=weekArr.join("");
	    	var dayCount=that.getCountDays(year,month);
	    	var dayHtml="";
	    	var dayArr=["<tr class=\"cal_day\">"];
	    	for (var i =0; i <week; i++) {
	    		dayArr.push("<td class=\"disable\"><div></div></td>");
	    	}
			//dayArr.push("</tr><tr class=\"cal_day\">");
			//dayCount=week+dayCount+lastDayCount;
			var tempDate=new Date();
			var tempDate2=new Date();
	    	for (var i = 0; i <dayCount; i++) {
				var newI=i+week;
				if(newI%7==0&&i==0){
					dayArr.push("<tr class=\"cal_day\">");
				}else if(newI%7==0&&i!=dayCount){
					dayArr.push("</tr><tr class=\"cal_day\">");
				}
				tempDate.setDate(i+1);
				tempDate.setFullYear(year);
				tempDate.setMonth(month-1);

				var tomorrow=todayDay+1;
				tempDate2.setDate(tomorrow);
				var todayYear1=tempDate2.getFullYear();
				var todayMonth1=tempDate2.getMonth()+1;
				tomorrow=tempDate2.getDate();
				var afterday=tomorrow+1;
				tempDate2.setDate(afterday);
				var todayYear2=tempDate2.getFullYear();
				var todayMonth2=tempDate2.getMonth()+1;
				afterday=tempDate2.getDate();
				tempDate2=new Date();
				//console.log("todayYear="+todayYear+",todayYear1="+todayYear1+",todayYear2="+todayYear2+",todayMonth="+todayMonth+",todayMonth1="+todayMonth1+",todayMonth2="+todayMonth2);
				//console.log("todayDay="+todayDay+",tomorrow="+tomorrow+",afterday="+afterday+",i+1="+(i+1));
    			var showText=i+1;
    			var showClass="normal";
	    		if(todayDay==(i+1)&&year==todayYear&&month==todayMonth){
	    			var showName=i+1;	    			
	    			if(that.options.todayShow){
	    				showText=that.options.todayShowName;
	    				showName=that.options.todayShowName;
	    				showClass="today active";
	    			}
	    			if(that.options.startShow){
	    				showText=that.options.startShowName;
	    				showClass="cal_start";
	    			}
					/*switch(that.options.appType){
						case "air":
							dayArr.push("<td class=\"today active\" data-year=\""+year+"\" data-month=\""+month+"\" data-day=\""+(i+1)+"\" data-week=\""+tempDate.getDay()+"\"><div>今天</div></td>");	 
							break;
						default:
							dayArr.push("<td class=\"today active\" data-year=\""+year+"\" data-month=\""+month+"\" data-day=\""+(i+1)+"\" data-week=\""+tempDate.getDay()+"\"><div>"+(i+1)+"</div></td>");	
					}	*/	
					dayArr.push("<td class=\""+showClass+"\" data-year=\""+year+"\" data-month=\""+month+"\" data-day=\""+(i+1)+"\" data-week=\""+tempDate.getDay()+"\" data-show=\""+showName+"\"><div>"+showText+"</div></td>");				
	    		}else if(tomorrow==(i+1)&&year==todayYear1&&month==todayMonth1){
	    			if(that.options.tomorrowShow){
	    				showText=that.options.tomorrowShowName;
	    				showClass="tomorrow";
	    			}
	    			/*switch(that.options.appType){
						case "air":
							dayArr.push("<td class=\"tomorrow\" data-year=\""+year+"\" data-month=\""+month+"\" data-day=\""+(i+1)+"\" data-week=\""+tempDate.getDay()+"\"><div>明天</div></td>"); 
							break;
						default:
							dayArr.push("<td class=\"normal\" data-year=\""+year+"\" data-month=\""+month+"\" data-day=\""+(i+1)+"\" data-week=\""+tempDate.getDay()+"\"><div>"+(i+1)+"</div></td>");	
					} 	*/		
					dayArr.push("<td class=\""+showClass+"\" data-year=\""+year+"\" data-month=\""+month+"\" data-day=\""+(i+1)+"\" data-week=\""+tempDate.getDay()+"\" data-show=\""+showText+"\"><div>"+showText+"</div></td>");	
	    		}else if(afterday==(i+1)&&year==todayYear2&&month==todayMonth2){	    			
	    			if(that.options.tomorrowShow){
	    				showText=that.options.afterdayShowName;
	    				showClass="afterday";
	    			}
					/*switch(that.options.appType){
						case "air":
							dayArr.push("<td class=\"afterday\" data-year=\""+year+"\" data-month=\""+month+"\" data-day=\""+(i+1)+"\" data-week=\""+tempDate.getDay()+"\"><div>后天</div></td>");    			
							break;
						default:
							dayArr.push("<td class=\"normal\" data-year=\""+year+"\" data-month=\""+month+"\" data-day=\""+(i+1)+"\" data-week=\""+tempDate.getDay()+"\"><div>"+(i+1)+"</div></td>");	
					}  */ 			
					dayArr.push("<td class=\""+showClass+"\" data-year=\""+year+"\" data-month=\""+month+"\" data-day=\""+(i+1)+"\" data-week=\""+tempDate.getDay()+"\" data-show=\""+showText+"\"><div>"+showText+"</div></td>");	
	    		}else if(todayDay>(i+1)&&year<=todayYear&&month<=todayMonth){
					dayArr.push("<td class=\"disable\" data-year=\""+year+"\" data-month=\""+month+"\" data-day=\""+(i+1)+"\" data-week=\""+tempDate.getDay()+"\" data-show=\""+showText+"\"><div>"+showText+"</div></td>");	
				}else{
	    			dayArr.push("<td class=\"normal\" data-year=\""+year+"\" data-month=\""+month+"\" data-day=\""+(i+1)+"\" data-week=\""+tempDate.getDay()+"\" data-show=\""+showText+"\"><div>"+showText+"</div></td>");  			
	    		}
	    	}
	    	var lastDayCount=(dayCount+week)%7>0?Math.ceil((dayCount+week)/7)*7-(dayCount+week):Math.ceil((dayCount+week)/7)*7-(dayCount+week);
	    	for (var i =0; i <lastDayCount; i++) {
	    		dayArr.push("<td class=\"disable\"><div></div></td>");  		
	    	}
			dayArr.push("</tr>");
			dayHtml=dayArr.join("");
			var oTable=document.getElementById('calender_'+year+'_'+month);
			oTable.children[0].innerHTML+=dayHtml;
			var oTrs=oTable.children[0].getElementsByTagName("tr");
			for(var i=0,len=oTrs.length;i<len;i++){				
				if(oTrs[i].className.indexOf("cal_month")!=-1){
					var oTrsArr=[];
					if(style=="default"&&single){
						//weekArr.push('<td rowspan="8" class="cal_prev">上一月</td>');
						oTrsArr.push('<td class="cal_prev"><div>&lt;</div></td>');
					}
					if(style=="default"){						
						oTrsArr.push("<td colspan=\"5\"><!--<span class=\"today\">回到今天</span>-->"+year+"年"+monthArray[month-1]+"</td>");
					}else{
						oTrsArr.push("<td colspan=\"9\"><!--<span class=\"today\">回到今天</span>-->"+year+"年"+monthArray[month-1]+"</td>");
					}
					if(style=="default"&&single){
						//weekArr.push('<td rowspan="8" class="cal_prev">上一月</td>');
						oTrsArr.push('<td class="cal_next"><div>&gt;</div></td>');
					}
					oTrs[i].innerHTML=oTrsArr.join("");								
				}else if(oTrs[i].className.indexOf("cal_week")!=-1){
					oTrs[i].innerHTML=weekHtml;						
				}		
			}
			that.bindCalenderEvent(calender);			
		},
		bindCalenderEvent:function(calender){
			var that=this;
			var style=that.options.style;//日历皮肤
			var single=that.options.single;	
			//绑定上月  下月事件			
			var oContainers=calender.getElementsByTagName("div");
			for(var k=0,kLen=oContainers.length;k<kLen;k++){
				if(oContainers[k].className.indexOf("cal_month_container")==-1){
					continue;
				}
				var oTable=oContainers[k].children[0];
				var oTrs=oTable.tBodies[0].getElementsByTagName("tr");
				for(var i=0,len=oTrs.length;i<len;i++){				
					if(oTrs[i].className.indexOf("cal_month")!=-1){
						//oTrs[i].innerHTML="<td colspan=\"9\"><!--<span class=\"today\">回到今天</span>-->"+year+"年"+monthArray[month-1]+"</td>";
						
						var oTds=oTrs[i].getElementsByTagName("td");
						for(var j=0,jLen=oTds.length;j<jLen;j++){
							if(oTds[j].className.indexOf("today")!=-1){
								oTds[j].onclick=function(){
										that.returnToday(calender);
								}
							}else if(oTds[j].className.indexOf("cal_prev")!=-1){
								oTds[j].onclick=function(){
									that.prevMonth(calender);
								}
							}
							if(oTds[j].className.indexOf("cal_next")!=-1){
								oTds[j].onclick=function(){
									that.nextMonth(calender);
								}
							}
						}				
					}else if(oTrs[i].className.indexOf("cal_week")!=-1){
						//oTrs[i].innerHTML=weekHtml;
						var oTds=oTrs[i].getElementsByTagName("td");
						for(var j=0,jLen=oTds.length;j<jLen;j++){
							if(oTds[j].className.indexOf("cal_prev")!=-1){
								oTds[j].onclick=function(){
									that.prevMonth(calender);
								}
							}
							if(oTds[j].className.indexOf("cal_next")!=-1){
								oTds[j].onclick=function(){
									that.nextMonth(calender);
								}
							}
						}	
					}else if(oTrs[i].className.indexOf("cal_day")!=-1){
						var oTds=oTrs[i].getElementsByTagName("td");
						var weekArray=that.weekArray;
						//var currentActive=null;
						for(var j=0,jLen=oTds.length;j<jLen;j++){
							if(oTds[j].className.indexOf("active")!=-1){
								that.currentActive=oTds[j];
							}
							if(that.options.startShow){
								if(oTds[j].className.indexOf("cal_start")!=-1){
									that.startActive=oTds[j];
								}
								if(oTds[j].className.indexOf("cal_end")!=-1){
									that.endActive=oTds[j];
								}
							}
							if(oTds[j].className.indexOf("disable")==-1){
								oTds[j].onclick=function(){
									var year=this.getAttribute("data-year");
									var month=this.getAttribute("data-month");
									var day=parseInt(this.getAttribute("data-day"),10);
									var week=this.getAttribute("data-week");									
									var date=new Date();
									this.className+=" active";
									if(that.currentActive){
										var showText=that.currentActive.getAttribute("data-show");
										that.currentActive.className=that.currentActive.className.replace("active","");
										that.currentActive.innerHTML="<div>"+showText+"</div>";
										if(that.options.startShow){
											that.currentActive.className=that.currentActive.className.replace("cal_start","");
											that.currentActive.className=that.currentActive.className.replace("cal_end","");
										}
										that.currentActive=this;
									}
									/*if(that.options.startShow){
										if(that.startActive){
											var showText=that.startActive.getAttribute("data-show");
											that.startActive.className=that.startActive.className.replace("cal_start","");
											that.startActive.innerHTML="<div>"+showText+"</div>";
											//that.currentActive.className=that.currentActive.className.replace("cal_start","");
											//that.currentActive.className=that.currentActive.className.replace("cal_end","");										
											//that.currentActive=this;
										}
										if(that.endActive){
											var showText=that.endActive.getAttribute("data-show");
											that.endActive.className=that.endActive.className.replace("active","");
											that.endActive.innerHTML="<div>"+showText+"</div>";
											//that.currentActive.className=that.currentActive.className.replace("cal_start","");
											//that.currentActive.className=that.currentActive.className.replace("cal_end","");										
											//that.currentActive=this;
										}
									}*/
									date.setFullYear(year);
									date.setMonth(month-1);
									date.setDate(day);
									var formatDate=parseInt(that.dateFormat("yyyyMMddhhmmss",date),10);
									//执行启程函数
									if(that.options.startShow){
										if(!that.isSelectEnd){//如果没有选择启程 则继续执行  有选择则不执行
											if(that.startActive){
												var showText=that.startActive.getAttribute("data-show");
												that.startActive.className=that.startActive.className.replace("cal_start","");												
												that.startActive.className=that.startActive.className.replace("cal_end","");												
												that.startActive.innerHTML="<div>"+showText+"</div>";
												that.startActive=this;
											}
											if(that.endActive){
												var showText=that.endActive.getAttribute("data-show");
												that.endActive.className=that.endActive.className.replace("cal_start","");
												that.endActive.className=that.endActive.className.replace("cal_end","");
												that.endActive.innerHTML="<div>"+showText+"</div>";
											}
											this.className=this.className.replace("cal_end","");
											this.className+=" cal_start";
											this.innerHTML="<div>"+that.options.startShowName+"</div>";

											if(that.options.startDay){
												that.options.startDay.call(that,that.dateFormat(that.options.format,date),this);
											}							
											that.startDate=formatDate;
											that.isSelectEnd=false;
											//that.isStartShow=false;  //打开选择返程日期
										}

									}
									//执行返回函数
									if(that.options.endShow){
										if(that.isSelectEnd){
											that.isSelectEnd=false;
											//this.className+=" cal_end";
											that.endDate=formatDate;
											if(that.endDate>that.startDate){
												if(that.endActive){
													var showText=that.endActive.getAttribute("data-show");
													that.endActive.className=that.endActive.className.replace("cal_start","");
													that.endActive.className=that.endActive.className.replace("cal_end","");
													that.endActive.innerHTML="<div>"+showText+"</div>";
												}
												that.endActive=this;
												this.className=this.className.replace("cal_start","");
												this.className+=" cal_end";												
												that.isSelectEnd=false;											
												this.innerHTML="<div>"+that.options.endShowName+"</div>";
												if(that.options.endDay){
													that.options.endDay.call(that,that.dateFormat(that.options.format,date),this);
												}
											}else{
												if(that.startActive){
													var showText=that.startActive.getAttribute("data-show");
													that.startActive.className=that.startActive.className.replace("cal_start","");												
													that.startActive.className=that.startActive.className.replace("cal_end","");												
													that.startActive.innerHTML="<div>"+showText+"</div>";
													that.startActive=this;
												}
												that.isSelectEnd=true;
												this.innerHTML="<div>"+that.options.startShowName+"</div>";
												this.className+=" cal_start";		
											}
											//that.isStartShow=false;  //返程选择结束之后把startShow关闭
										}else{											
											//that.isStartShow=true;  //打开选择返程日期
											that.isSelectEnd=true;
										}
									}else{
										that.isSelectEnd=false;
										//that.isStartShow=false;  //返程选择结束之后把startShow关闭	
									}
									//alert(year+"年"+month+"月"+day+"日"+" 星期"+weekArray[week]);
									if(that.options.currentDay){
										that.options.currentDay.call(that,that.dateFormat(that.options.format,date),this);
									}
									if(that.options.nextDay){
										date.setDate(day+1);
										that.options.nextDay.call(that,that.dateFormat(that.options.format,date),this);
									}
									if(that.options.prevDay){
										date.setDate(day-1);
										that.options.prevDay.call(that,that.dateFormat(that.options.format,date),this);
									}
									if(that.options.selectDay){
										that.options.selectDay.call(that,that.dateFormat(that.options.format,date),this);
									}
								};
							}
						}
					}			
				}
			}
			if(that.options.more){
				var btn_more=that.$("cal_more");
				if(btn_more){
					btn_more.onclick=function(){
						var maxYear=that.maxYear;
						var maxMonth=that.maxMonth;
						maxMonth=that.maxMonth=maxMonth+1;
						that.appendMonth(calender,maxYear,maxMonth,0,"append");
					};
				}
			}
			if(that.options.header){
				var cal_prev=that.$("cal_prev");
				if(cal_prev){
					cal_prev.onclick=function(){
						that.hide();
					};
				}
			}
		},
		nextMonth:function(calender){
			//$(calender.find(".cal_show")).fadeOut("slow");
			var that=this;
			that.reloadCalender(calender,this.options.year,this.options.month+1);
			var unit=that.unit;			
			var moveBy=that.moveBy;			
			var browserWidth=that.browserWidth;			
			calender.style[unit]=browserWidth+"px";
			calender.style[moveBy]="0px";
		},
		prevMonth:function(calender){
			//$(calender.find(".cal_show")).fadeOut("slow");
			var that=this;
			that.reloadCalender(calender,this.options.year,this.options.month-1);
			var unit=that.unit;	
			var moveBy=that.moveBy;					
			var browserWidth=that.browserWidth;		
			calender.style[unit]=browserWidth+"px";
			calender.style[moveBy]="0px";
		},
		selectMonth:function(){

		},
		returnToday:function(calender){
			//$(calender.find(".cal_show")).fadeOut("slow");
			var that=this;
			that.reloadCalender(calender);
		},
		selectYear:function(){

		},
		getCountDays:function(year,month) {
	        var curDate = new Date();
	        /* 获取当前月份 */
	        //var curMonth = curDate.getMonth();
	       /*  生成实际的月份: 由于curMonth会比实际月份小1, 故需加1 */
	       if(year&&year!=0){
	       		curDate.setYear(year);//设置年份
	       }
	       if(month&&month!=0){
	       		curDate.setMonth(month);//设置月份  
	       }
	       /* 将日期设置为0, 这里为什么要这样设置, 我不知道原因, 这是从网上学来的 */
	       curDate.setDate(0);
	       /* 返回当月的天数 */
	       return curDate.getDate();
		},
		handlerEvent:function(e,that){
		    // var that=this;
			switch(e.type) {
				case START_EV:
					if (!hasTouch && e.button !== 0) return;
					that._start(e);
					break;
				case MOVE_EV: that._move(e); break;
				case END_EV:
				case CANCEL_EV: that._end(e); break;
			 //  case RESIZE_EV: that._resize(); break;
			   // case 'DOMMouseScroll': case 'mousewheel': that._wheel(e); break;
			   // case TRNEND_EV: that._transitionEnd(e); break;
			}
		},
		_start:function(e){  //开始事件
			var that=this;
			//clearInterval(that.intervalId);
			//e.preventDefault();
			that.isMoved=false;
			if(e.changedTouches){
				e=e.changedTouches[e.changedTouches.length-1];
			}
			var eX=startPos.x=e.clientX || e.pageX;
			var eY=startPos.y=e.clientY || e.pageY;			
			that.isMouseDown=true;
			//if (that.options.onSliderStart){that.options.onSliderStart.call(that,e)};
		},
		_move:function(e){//
			var that=this;			
			e.preventDefault();
			var calender=that.calender;
			var moveBy=that.moveBy;
			if(that.isMouseDown){
				if(e.changedTouches){
					e=e.changedTouches[e.changedTouches.length-1];
				}
				var eX=movePos.x=e.clientX || e.pageX;
				var eY=movePos.y=e.clientY || e.pageY;
				var left=parseFloat(calender.style[moveBy]);
				if(isNaN(left)){
					left=0;
				}
				if(that.options.hScroll){
					left=left+(eX-startPos.x);
					startPos.x=eX;
				}else{
					left=left+(eY-startPos.y);
					startPos.y=eY;
				}
				if(Math.abs(left)>10){
					that.isMoved=true;
				}else{					
					that.isMoved=false;
				}
				that.calender.style[transitionDuration] = "0";
				calender.style[moveBy]=left+"px";
				//console.log("---------"+that.calender.scrollTop+"----"+(eY-startPos.y));
				//if (that.options.onSliderMove){that.options.onSliderMove.call(that,e)};
			}
		},
		refresh:function(){
			
		},
		_end: function (e) {
			var that=this;
			if(that.isMoved){
				e.preventDefault();
			
				var minYear=that.minYear;
				var maxYear=that.maxYear;
				var minMonth=that.minMonth;
				var maxMonth=that.maxMonth;
				var todayYear=that.todayYear
				that.isMouseDown=false;
				var calender=that.calender;
				var moveBy=that.moveBy;
				var browserWidth=that.browserWidth;
				var min=that.options.min;
				var max=that.options.max;
				var oHeight=0;
				that.isNext=false;//月份是否加大
				that.isPrev=false;//月份是否减少
				that.isLoaded=false;//是否有加载数据
				if(that.options.hScroll){
					oHeight=calender.offsetWidth;
				}else{
					oHeight=calender.offsetHeight;
				}
				
				if(e.changedTouches){
					e=e.changedTouches[e.changedTouches.length-1];
				}
				var eX=movePos.x=e.clientX || e.pageX;
				var eY=movePos.y=e.clientY || e.pageY;
				var left=parseFloat(calender.style[moveBy]);
				if(isNaN(left)){
					left=0;
				}
				if(that.options.hScroll){
					left=left+(eX-startPos.x);					
				}else{
					left=left+(eY-startPos.y);					
				}
				if(left>0){
					left=0;
					//setTimeout(function(){
						//@TODO  这里为什么要这样设置   这里向前计算的月份会有问题
						/*var tempMonth=that.todayMonth-min;
						var tempYear=that.todayYear;
						if(tempMonth<1){
							tempMonth=12-Math.abs(tempMonth);
							tempYear=tempYear-1;
						}*/
						minMonth=that.minMonth=minMonth-1;
						//if(minMonth<1){
							//minMonth=that.minMonth=12;
							//minYear=that.minYear=minYear-1;
						//}
						var firDate=new Date();
						var secDate=new Date();
						firDate.setYear(minYear);
						firDate.setMonth(minMonth);
						secDate.setYear(todayYear);
						var tempMonth=that.todayMonth-min;
						secDate.setMonth(tempMonth);
						if(firDate.getTime()>=secDate.getTime()){
							that.appendMonth(calender,minYear,minMonth,0,"before");					
							that.isPrev=true;//月份是否减少
							that.isNext=false;//月份是否加大
							that.isLoaded=true;//数据已经加载
						}else{
							that.isPrev=true;//月份是否减少
							that.isNext=false;//月份是否加大
							that.isLoaded=false;//数据已经加载
						}
					//},that.options.animateTime);
				}else if(Math.abs(left)+browserWidth>oHeight){
					if(browserWidth>oHeight){
						left=0;
					}else{
						left=browserWidth-oHeight;					
					}
					//setTimeout(function(){
						/*var tempMonth=that.todayMonth+max+parseInt(that.options.monthCount,10);
						var tempYear=that.todayYear;
						if(tempMonth>12){
							tempMonth=tempMonth-12;
							tempYear=tempYear+Math.ceil(tempMonth/12);
						}*/
						maxMonth=that.maxMonth=maxMonth+1;
						//if(maxMonth>12){
							//maxMonth=that.maxMonth=1;
							//maxYear=that.maxYear=maxYear+1;
						//}
						var firDate=new Date();
						var secDate=new Date();
						firDate.setYear(maxYear);
						firDate.setMonth(maxMonth);
						secDate.setYear(todayYear);
						var tempMonth=that.todayMonth+max+(parseInt(that.options.monthCount,10)-1);
						secDate.setMonth(tempMonth);
						if(firDate.getTime()<=secDate.getTime()){
							that.appendMonth(calender,maxYear,maxMonth,0,"append");
							that.isNext=true;//月份是否加大
							that.isPrev=false;//月份是否减少
							that.isLoaded=true;//数据已经加载
						}else{
							that.isNext=true;//月份是否加大
							that.isPrev=false;//月份是否减少
							that.isLoaded=false;//数据已经加载
						}
					//},that.options.animateTime);				
				}
				if(that.options.oneByOne&&that.options.hScroll){
					if(Math.abs(left%browserWidth/parseFloat(browserWidth))>=0.5){
						left=Math.floor(left/browserWidth)*browserWidth;
						if(that.options.debug){
							console.log("大于");
						}
					}else{
						left=Math.ceil(left/browserWidth)*browserWidth;
						if(that.options.debug){
							console.log("小于");
						}
					}
				}
				if(that.isLoaded&&that.isPrev&&that.options.hScroll){
					//left+=browserWidth;
				}else if(that.isLoaded&&that.isNext&&that.options.hScroll){
					left-=browserWidth;
					/*if(that.options.hScroll){
						oHeight=calender.offsetWidth;
					}else{
						oHeight=calender.offsetHeight;
					}
					if(Math.abs(left)+browserWidth>oHeight){
						if(browserWidth>oHeight){
							left=0;
						}else{
							left=browserWidth-oHeight;					
						}
					}*/
				}
				if(that.isNext&&that.options.vScroll){
					left=left-calender.parentNode.offsetTop;
				}
				that.calender.style[transitionDuration] = that.options.animateTime/1000+"s";
				calender.style[moveBy]=left+"px";
				var unit=that.unit;
				var sliderList=that.sliderList=calender.getElementsByTagName("div");
				var length=that.length=sliderList.length;
				var browserWidth=that.browserWidth;
				for(var i=0;i<length;i++){
					sliderList[i].style[unit]=browserWidth-2+"px";
				}
				calender.style[unit]=browserWidth*length-15+"px";
			}			
			that.isMouseDown=false;
		},_bind: function (type,el,fn,bubble) {
			(el || this.calender).addEventListener(type, fn, !!bubble);
		},_unbind: function (type, el,fn, bubble) {
			(el || this.calender).removeEventListener(type, fn, !!bubble);
		}
	}
	
	module.exports  = Calender;
});