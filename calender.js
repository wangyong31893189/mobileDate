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
			weekName:"星期",//星期前缀
			year:"",
			style:"default",
			monthCount:3,//显示的月份数量
			appType:"air",
			max:3,//可以向后查看3个月
			min:3,//可以向前查看3个月
			vScroll:true,//竖向
			hScroll:false,//横向 
			animateTime:500,//动画时间
			month:"",
			day:"",
			week:""
		};
		for(var i in options ){
			this.options[i]=options[i];
		}
	
		this.init();
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
		width : document.documentElement.clientWidth, 
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
			var calender=that.calender=that.$(that.options.id);
			var moveBy=that.moveBy="marginLeft";
			var moveStyleBy=that.moveStyleBy="margin-left";
			if(that.options.vScroll){//竖向滚动
				unit=that.unit="height";
				moveBy=that.moveBy="marginTop";
				moveStyleBy=that.moveStyleBy="margin-top";
			}
			var wh=getViewSizeWithoutScrollbar();
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
			//for (var i =0,len= calenders.length; i<len; i++) {				
			that.showCalender(calender);
		},
		showCalender:function(calender){//显示日历框架 year 显示的年份   month显示的月份
			var that=this;			
			that.reloadCalender(calender);

			that._bind(START_EV,null,function(e){that.handlerEvent(e,that)});//绑定鼠标按下或触摸开始事件
			that._bind(MOVE_EV,null,function(e){that.handlerEvent(e,that)});//绑定鼠标移动或触摸移动事件
			that._bind(END_EV,null,function(e){that.handlerEvent(e,that)});//绑定鼠标弹上或触摸停止事件
			/*that._bind(CANCEL_EV,null,function(e){
				clearInterval(that.intervalId);
			});//绑定鼠标弹上或触摸取消事件
			that._bind(RESIZE_EV,window,function(e){//绑定窗口放大缩小或设备横竖事件
				clearInterval(that.intervalId);
				that.refresh();
				that.loadRun();
			});*/
		},
		reloadCalender:function(calender,year,month){//calender 日历对象  year 年份   month 月份  monthCount 显示的月份数量
			var that=this;		
			calender.innerHTML="";
			
			if(that.options.monthCount){
				var count=that.options.monthCount;
				for(var i=0;i<count;i++){					
					that.appendMonth(calender,year,month,i,"append");			
				}
			}else{				
				that.appendMonth(calender,year,month,0);
			}
	    	//calender.getElementsByTagName("div");
	    	//$(calender.find(".cal_show")).fadeIn("slow");
		},
		appendMonth:function(calender,year,month,index,type){//日历显示类型 是附加还是替换  append 附加   insert 插入   replace替换
	    	var that=this;
			var count=that.options.monthCount;
			var weekName=that.options.weekName;
			var weekArray=[weekName+"日",weekName+"一",weekName+"二",weekName+"三",weekName+"四",weekName+"五",weekName+"六"];
			//var monthArray=["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"];
			var monthArray=["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];
			
			var date=new Date();
			if(!year&&year!=0){
				year=date.getFullYear();
			}else{
				date.setYear(year);
			}
			if(!month&&month!=0){
				month=date.getMonth()+1;
				if(index!=0){
					month=month+index;
					/*if(month>12){
						year+=1
						month=1;
					}else if(month<1){
						year-=1;
						month=12;
					}*/
					date.setYear(year);
					date.setMonth(month-1);
				}
			}else{
				month=month+index;
				/*if(month>12){
					year+=1
					month=1;
				}else if(month<1){
					year-=1;
					month=12;
				}*/
				date.setYear(year);
				date.setMonth(month-1);
			}
					
			date.setDate(1);
			year=date.getFullYear();
			month=date.getMonth()+1;
			that.options.year=year;
			that.options.month=month;
			var day=date.getDate();			
			that.options.day=day;
			var week=date.getDay();
			that.options.week=week;
			var today=new Date();
			var todayYear=that.todayYear=today.getFullYear();//当前年份
			var todayDay=today.getDate();//当前年份月份的天数
			var todayMonth=that.todayMonth=today.getMonth()+1;////当前年份月份
			
			var calendarHtml='<div class="cal_month_container"><table border="1" id=\"calender_'+year+'_'+month+'\"><tbody><tr class="cal_month"><td colspan="9">2014年11月</td></tr>'+
			'<tr class="cal_week"></tr></tbody></table></div>';
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
				that.minYear=year;
				that.minMonth=month;
				var tableCount=calender.children.length;
				if(tableCount==1){
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
			if(style=="default"){
				weekArr.push('<td rowspan="8" class="cal_prev">上一月</td>');
			}
	    	for (var i =0; i<7; i++) {						
	    		weekArr.push("<td>"+weekArray[i]+"</td>");
	    	}
			if(style=="default"){
				weekArr.push('<td rowspan="8" class="cal_next">下一月</td>');
			}
			weekHtml=weekArr.join("");
	    	var dayCount=that.getCountDays(year,month);
	    	var dayHtml="";
	    	var dayArr=["<tr class=\"cal_day\">"];
	    	for (var i =0; i <week; i++) {
	    		dayArr.push("<td class=\"disable\"></td>");
	    	}
			//dayArr.push("</tr><tr class=\"cal_day\">");
			//dayCount=week+dayCount+lastDayCount;
	    	for (var i = 0; i <dayCount; i++) {
				var newI=i+week;
				if(newI%7==0&&i==0){
					dayArr.push("<tr class=\"cal_day\">");
				}else if(newI%7==0&&i!=dayCount){
					dayArr.push("</tr><tr class=\"cal_day\">");
				}
	    		if(todayDay==(i+1)&&year==todayYear&&month==todayMonth){
					switch(that.options.appType){
						case "air":
							dayArr.push("<td class=\"active\" data-year=\""+year+"\" data-month=\""+month+"\" data-day=\""+(i+1)+"\" data-week=\"\">今天</td>");	 
							break;
						default:
							dayArr.push("<td class=\"active\" data-year=\""+year+"\" data-month=\""+month+"\" data-day=\""+(i+1)+"\" data-week=\"\">"+(i+1)+"</td>");	
					}					
	    		}else if(todayDay+1==(i+1)&&year==todayYear&&month==todayMonth){
					switch(that.options.appType){
						case "air":
							dayArr.push("<td class=\"tomorrow\" data-year=\""+year+"\" data-month=\""+month+"\" data-day=\""+(i+1)+"\" data-week=\"\">明天</td>"); 
							break;
						default:
							dayArr.push("<td class=\"normal\" data-year=\""+year+"\" data-month=\""+month+"\" data-day=\""+(i+1)+"\" data-week=\"\">"+(i+1)+"</td>");	
					} 			
	    		}else if(todayDay+2==(i+1)&&year==todayYear&&month==todayMonth){
					switch(that.options.appType){
						case "air":
							dayArr.push("<td class=\"afterday\" data-year=\""+year+"\" data-month=\""+month+"\" data-day=\""+(i+1)+"\" data-week=\"\">后天</td>");    			
							break;
						default:
							dayArr.push("<td class=\"normal\" data-year=\""+year+"\" data-month=\""+month+"\" data-day=\""+(i+1)+"\" data-week=\"\">"+(i+1)+"</td>");	
					}   			
	    		}else if(todayDay>(i+1)&&year<=todayYear&&month<=todayMonth){
					dayArr.push("<td class=\"disable\" data-year=\""+year+"\" data-month=\""+month+"\" data-day=\""+(i+1)+"\" data-week=\"\">"+(i+1)+"</td>");	
				}else{
	    			dayArr.push("<td class=\"normal\" data-year=\""+year+"\" data-month=\""+month+"\" data-day=\""+(i+1)+"\" data-week=\"\">"+(i+1)+"</td>");  			
	    		}
	    	}
	    	var lastDayCount=(dayCount+week)%7>0?Math.ceil((dayCount+week)/7)*7-(dayCount+week):Math.ceil((dayCount+week)/7)*7-(dayCount+week);
	    	for (var i =0; i <lastDayCount; i++) {
	    		dayArr.push("<td class=\"disable\"></td>");  		
	    	}
			dayArr.push("</tr>");
			dayHtml=dayArr.join("");
			var oTable=document.getElementById('calender_'+year+'_'+month);
			oTable.children[0].innerHTML+=dayHtml;
			var oTrs=oTable.children[0].getElementsByTagName("tr");
			for(var i=0,len=oTrs.length;i<len;i++){				
				if(oTrs[i].className.indexOf("cal_month")!=-1){
					oTrs[i].innerHTML="<td colspan=\"9\"><!--<span class=\"today\">回到今天</span>-->"+year+"年"+monthArray[month-1]+"</td>";								
				}else if(oTrs[i].className.indexOf("cal_week")!=-1){
					oTrs[i].innerHTML=weekHtml;						
				}		
			}
			that.bindCalenderEvent(calender);			
		},
		bindCalenderEvent:function(calender){
			var that=this;
			//绑定上月  下月事件
			var oContainers=calender.getElementsByTagName("div");
			for(var k=0,kLen=oContainers.length;k<kLen;k++){
				var oTable=oContainers[k].children[0];
				var oTrs=oTable.children[0].getElementsByTagName("tr");
				for(var i=0,len=oTrs.length;i<len;i++){				
					if(oTrs[i].className.indexOf("cal_month")!=-1){
						//oTrs[i].innerHTML="<td colspan=\"9\"><!--<span class=\"today\">回到今天</span>-->"+year+"年"+monthArray[month-1]+"</td>";
						var oTd=oTrs[i].getElementsByTagName("td")[0];
						if(oTd){
							var today=oTd.children;
							if(today&&today.length>0){
								today[0].onclick=function(){
									that.returnToday(calender);
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
						for(var j=0,jLen=oTds.length;j<jLen;j++){
							if(oTds[j].className.indexOf("disable")==-1){
								oTds[j].onclick=function(){
									var year=this.getAttribute("data-year");
									var month=this.getAttribute("data-month");
									var day=this.getAttribute("data-day");
									alert(year+"年"+month+"月"+day+"日");
								};
							}
						}
					}			
				}
			}
		},
		nextMonth:function(calender){
			//$(calender.find(".cal_show")).fadeOut("slow");
			var that=this;
			that.reloadCalender(calender,this.options.year,this.options.month+1);
		},
		prevMonth:function(calender){
			//$(calender.find(".cal_show")).fadeOut("slow");
			var that=this;
			that.reloadCalender(calender,this.options.year,this.options.month-1);
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
			if (that.options.onSliderStart){that.options.onSliderStart.call(that,e)};
		},
		_move:function(e){//
			var that=this;			
			e.preventDefault();
			that.isMoved=true;
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
				that.calender.style[transitionDuration] = "0";
				calender.style[moveBy]=left+"px";
				//console.log("---------"+that.calender.scrollTop+"----"+(eY-startPos.y));
				if (that.options.onSliderMove){that.options.onSliderMove.call(that,e)};
			}
		},
		refresh:function(){
			
		},
		_end: function (e) {
			var that=this;
			if(that.isMoved){
				e.preventDefault();
			}
			var minYear=that.minYear;
			var maxYear=that.maxYear;
			var minMonth=that.minMonth;
			var maxMonth=that.maxMonth;
			that.isMouseDown=false;
			var calender=that.calender;
			var moveBy=that.moveBy;
			var browserWidth=that.browserWidth;
			var min=that.options.min;
			var max=that.options.max;
			var oHeight=0;
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
				setTimeout(function(){
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
					secDate.setYear(minYear);
					var tempMonth=that.todayMonth-min;
					secDate.setMonth(tempMonth);
					if(firDate.getTime()>=secDate.getTime()){
						that.appendMonth(calender,minYear,minMonth,0,"before");					
					}
				},that.options.animateTime);
			}else if(Math.abs(left)+browserWidth>oHeight){
				if(browserWidth>oHeight){
					left=0;
				}else{
					left=browserWidth-oHeight-20;					
				}
				setTimeout(function(){
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
					secDate.setYear(maxYear);
					var tempMonth=that.todayMonth+max+(parseInt(that.options.monthCount,10)-1);
					secDate.setMonth(tempMonth);
					if(firDate.getTime()<=secDate.getTime()){
						that.appendMonth(calender,maxYear,maxMonth,0,"append");
					}
				},that.options.animateTime);				
			}			
			that.calender.style[transitionDuration] = that.options.animateTime/1000+"s";
			calender.style[moveBy]=left+"px";
		},_bind: function (type,el,fn,bubble) {
			(el || this.calender).addEventListener(type, fn, !!bubble);
		},_unbind: function (type, el, bubble) {
			(el || this.calender).removeEventListener(type, fn, !!bubble);
		}
	}
	
	module.exports  = Calender;
});