// JavaScript Document

//页面加载完毕时执行函数
function addLoadEvent(func){
	var oldonload=window.onload;
	if(typeof window.onload!="function"){
		window.onload=func;
	}else{
		window.onload=function(){
			oldonload();
			func();
		}
	}
}
addLoadEvent(aboutImg);

function aboutImg(){
//创建一个有关图片的总的变量对象
var ImgViewer={  
};  
ImgViewer.drag=document.getElementById("img");  //获取图片的id
ImgViewer.width=ImgViewer.drag.width;  //获取初始图片的长度和宽度 
ImgViewer.height=ImgViewer.drag.height;
ImgViewer.w=ImgViewer.width/2;
ImgViewer.h=ImgViewer.height/2;

//识别呈现引擎
ImgViewer.client=function(){  
	var engine={
		//呈现引擎
		ie:0,
		gecko:0,
		webkit:0,
		khtml:0,
		opera:0,
		//具体的版本号
		ver:null
	};
	
	return {
		engine:engine
	};
}();

//创建一个事件对象，兼容浏览器
ImgViewer.EventUtil={     
	addHandler:function(element,type,handler){    //添加事件
		if(element.addEventListener){
			element.addEventListener(type,handler,false);
		}else if(element.attachEvent){
			element.attachEvent("on"+type,handler);
		}else{
			element["on"+type]=handler;
		}
	},
	getEvent:function(event){       //获取事件对象
		return event?event:window.event;
	},
	getTarget:function(event){      //获取事件目标
		return event.target||event.srcElement;
	},
	getWheelDelta:function(event){   //获取鼠标滚轮增量值
		if(event.wheelDelta){
			return (ImgViewer.client.engine.opera&&ImgViewer.client.engine.opera<9.5?
					 -event.wheelDelta:event.wheelDelta);
		}else{
			return -event.detail*40;
		}
	},
	getButton:function(event){    //获取鼠标的按键  0:左键 1:中间键  2:右键
		if(document.implementation.hasFeature("MouseEvents","2.0")){
			return event.button;
		}else{
			switch(event.button){
				case 0:
				case 1:
				case 3:
				case 5:
				case 7:
				   return 0;
				   break;
				case 2:
				case 6:
				   return 2;
				   break;
				case 4:
				   return 1;
				   break;
				default:
				   break;
			}
		}
	},
	preventDefault:function(event){  //阻止事件的默认行为
        if(event.preventDefault){
            event.preventDefault();
        }else{
            event.returnValue=false;
        }
    },
	removeHandler:function(element,type,handler){   //移除事件
		if(element.removeEventListener){
			element.removeEventListener(type,handler,false);
		}else if(element.detachEvent){
			element.detachEvent("on"+type,handler);
		}else{
			element["on"+type]=null;
		}
	}
};

//拖拽图片
ImgViewer.DragDrop=function(){
	var  dragging=false,
		 diffX=0,
		 diffY=0;
    
	//拖动图片
    function dragImg(event){  
		event=ImgViewer.EventUtil.getEvent(event);
		var target=ImgViewer.EventUtil.getTarget(event),
		     xMax=ImgViewer.drag.parentNode.offsetWidth+ImgViewer.w-50, 
			 yMax=ImgViewer.drag.parentNode.offsetHeight+ImgViewer.h-50; 
		     
		switch(event.type){
		  case "mousedown":
		     if(target.id=="img"&&ImgViewer.EventUtil.getButton(event)==0){  //鼠标左键点击图片可以拖动
		        dragging=true;
			    diffX=event.clientX-ImgViewer.drag.offsetLeft-ImgViewer.w;  
			    diffY=event.clientY-ImgViewer.drag.offsetTop-ImgViewer.h;
			    ImgViewer.EventUtil.preventDefault(event);
		     }
		     break;
		  case "mousemove":
		     if(dragging){
				//定义图片在左边和上边可已超过的最大范围 
				var	  xMin=-ImgViewer.drag.offsetWidth+ImgViewer.w+50,   
					  yMin=-ImgViewer.drag.offsetHeight+ImgViewer.h+50;	   			

				 //拖动图片且限制图片的拖拽范围
				 ImgViewer.drag.style.left=Math.max(Math.min(event.clientX-diffX,xMax),xMin)+"px";
				 ImgViewer.drag.style.top=Math.max(Math.min(event.clientY-diffY,yMax),yMin)+"px";
		     }
		     break;
		  case "mouseup":
		     dragging=false;
		     break;
		  default:
			 break;	
	    }
	}
	
	return {
		enable:function(){
			ImgViewer.EventUtil.addHandler(document,"mousedown",dragImg);
			ImgViewer.EventUtil.addHandler(document,"mousemove",dragImg);
			ImgViewer.EventUtil.addHandler(document,"mouseup",dragImg);
		},
		disable:function(){
			ImgViewer.EventUtil.removeHandler(document,"mousedown",dragImg);
			ImgViewer.EventUtil.removeHandler(document,"mousemove",dragImg);
			ImgViewer.EventUtil.removeHandler(document,"mouseup",dragImg);
		},
	};
}();
ImgViewer.DragDrop.enable();

//图片的缩放
ImgViewer.ImgZoom=function(){ 
	var  bWidth=3000,  
		 bHeight=4000,
		 sWidth=30,
		 sHeight=40;
		
	//控制图片变化的速度
    function setVelocity(w,h,dist){ 
		var width=ImgViewer.drag.width,
		     height=ImgViewer.drag.height,
		     left=ImgViewer.drag.offsetLeft,
		     topp=ImgViewer.drag.offsetTop;
			 
		 if(ImgViewer.drag.movement){   //避免放大缩小时图片的抖动
		    clearTimeout(ImgViewer.drag.movement);
		 }
		 
		 //放大图片的情况
		 if(dist>0){
		     if(width>=w&&height>=h){
			    return true;
			 }else{
				width+=dist;
				height+=dist;
			 }
	     }
		 
		 //缩小图片的情况
		 if(dist<0){
		     if(width<=w&&height<=h){
			     return true;
			  }else{
				 width+=dist;
				 height+=dist;
			  }
		 }
		 
		 //改变图片的长度和宽度
		 ImgViewer.drag.style.height=Math.round(height)+"px";            
         ImgViewer.drag.style.width=Math.round(width)+"px";
			
		 //图片以中心放大
	     ImgViewer.drag.style.left=Math.round((left-dist/2)+ImgViewer.w)+"px";   
	 	 ImgViewer.drag.style.top=Math.round((topp-dist/2)+ImgViewer.h)+"px";  
		 
		 //利用setTimeout控制图片的渐变效果 
	     ImgViewer.drag.movement=setTimeout(setVelocity,8,w,h,dist);  
	   }
	
	//放大图片
	function zoomIn(){   
	    var	height=ImgViewer.drag.height,            
            width=ImgViewer.drag.width,
			nHeight=height*1.2,   
			nWidth=width*1.2;
	
		 //限制图片的最大尺寸
	    if(height<bHeight&&width<bWidth){   		 
			 setVelocity(nWidth,nHeight,2);	 
	    }
	}
		
	//缩小图片
	function zoomOut(){   
		var height=ImgViewer.drag.height;            
             width=ImgViewer.drag.width;
		     nHeight=height/1.2,    
			 nWidth=width/1.2;
			 
		//限制图片的最小尺寸
		if(height>sHeight&&width>sWidth){  
			setVelocity(nWidth,nHeight,-2);
	    } 
	}
	
	//通过单击事件放大缩小图片
	function changeImg(event){
		//获取事件和目标
	    event=ImgViewer.EventUtil.getEvent(event);
		var target=ImgViewer.EventUtil.getTarget(event),
		     height=0,
			 width=0,
			 left=0,
			 topp=0;
			 
		//利用事件委托，提高网页性能
		switch(target.id){  
			case "zoomIn":
			   zoomIn();
			   break;
			case "zoomOut":
			   zoomOut();           
			   break;
			default:
			   break;	
		}
	}
	
	function scrollImg(event){
		event=ImgViewer.EventUtil.getEvent(event);
		var target=ImgViewer.EventUtil.getTarget(event),
		    delta=ImgViewer.EventUtil.getWheelDelta(event);
		if(delta>0){
			zoomIn();
		}else{
			zoomOut();
		}
	}
	
	return {
		change:function(){
			ImgViewer.EventUtil.addHandler(document,"click",changeImg);
			ImgViewer.EventUtil.addHandler(document,"mousewheel",scrollImg); //IE、Opera、Chrome、Safari滚轮事件
			ImgViewer.EventUtil.addHandler(document,"DOMMouseScroll",scrollImg);  //Firefox滚轮事件
		},
		unchange:function(){
			ImgViewer.EventUtil.removeHandler(document,"click",changeImg);
			ImgViewer.EventUtil.removeHandler(document,"mousewheel",scrollImg); 
			ImgViewer.EventUtil.removeHandler(document,"DOMMouseScroll",scrollImg);  
		},
	};
	
}();
ImgViewer.ImgZoom.change();

//图片轮换
ImgViewer.ImgSwitch=function(){
	var  list=document.getElementById("list"),
	     items=list.getElementsByTagName("li"),          
		 top=ImgViewer.drag.offsetTop,
		 left=ImgViewer.drag.offsetLeft;
		 
	//导航样式变换
	function changeNavStyle(that){   
		var style=that.firstChild.style; 
		     start=ImgViewer.drag.src.lastIndexOf("/"),
		     end=ImgViewer.drag.src.length,
		     value=ImgViewer.drag.src.substring(start+1,end);
        if(that.firstChild.href.indexOf(value)!=-1){
			style.backgroundColor="#9CF";
			style.color="#FFF";
			var siblings=that.parentNode.childNodes;
			for(var i=0,len=siblings.length;i<len;i++){
				var sibling=siblings[i],
				     siblingFirstChild=sibling.firstChild;
				if(sibling.nodeType!=1){  //排除非元素类型的节点
					continue;
				}else{
					if(siblingFirstChild.href.indexOf(value)==-1){
						siblingFirstChild.style.backgroundColor="#ececec";
						siblingFirstChild.style.color="#000";
					}		
				}
			}
		}
	}
	
	//变换图片
	function switchImg(event){  
		event=ImgViewer.EventUtil.getEvent(event);
		ImgViewer.drag.src=this.firstChild.href;
		ImgViewer.drag.title=this.firstChild.firstChild.nodeValue;
		
		//变换图片后设置新图片的大小和位置
		ImgViewer.drag.style.width=ImgViewer.width+"px";
		ImgViewer.drag.style.height=ImgViewer.height+"px";
		ImgViewer.drag.style.top=top+ImgViewer.h+"px";  
		ImgViewer.drag.style.left=left+ImgViewer.w+"px";
	
		//取消点击图片的默认行为
		ImgViewer.EventUtil.preventDefault(event);
		
		var that=this;	
		changeNavStyle(that);
	}
	
	for(var i=0,len=items.length;i<len;i++){
		ImgViewer.EventUtil.addHandler(items[i],"click",switchImg);
	}
}();

}
