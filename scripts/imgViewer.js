// JavaScript Document

//ҳ��������ʱִ�к���
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
//����һ���й�ͼƬ���ܵı�������
var ImgViewer={  
};  
ImgViewer.drag=document.getElementById("img");  //��ȡͼƬ��id
ImgViewer.width=ImgViewer.drag.width;  //��ȡ��ʼͼƬ�ĳ��ȺͿ�� 
ImgViewer.height=ImgViewer.drag.height;
ImgViewer.w=ImgViewer.width/2;
ImgViewer.h=ImgViewer.height/2;

//ʶ���������
ImgViewer.client=function(){  
	var engine={
		//��������
		ie:0,
		gecko:0,
		webkit:0,
		khtml:0,
		opera:0,
		//����İ汾��
		ver:null
	};
	
	return {
		engine:engine
	};
}();

//����һ���¼����󣬼��������
ImgViewer.EventUtil={     
	addHandler:function(element,type,handler){    //����¼�
		if(element.addEventListener){
			element.addEventListener(type,handler,false);
		}else if(element.attachEvent){
			element.attachEvent("on"+type,handler);
		}else{
			element["on"+type]=handler;
		}
	},
	getEvent:function(event){       //��ȡ�¼�����
		return event?event:window.event;
	},
	getTarget:function(event){      //��ȡ�¼�Ŀ��
		return event.target||event.srcElement;
	},
	getWheelDelta:function(event){   //��ȡ����������ֵ
		if(event.wheelDelta){
			return (ImgViewer.client.engine.opera&&ImgViewer.client.engine.opera<9.5?
					 -event.wheelDelta:event.wheelDelta);
		}else{
			return -event.detail*40;
		}
	},
	getButton:function(event){    //��ȡ���İ���  0:��� 1:�м��  2:�Ҽ�
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
	preventDefault:function(event){  //��ֹ�¼���Ĭ����Ϊ
        if(event.preventDefault){
            event.preventDefault();
        }else{
            event.returnValue=false;
        }
    },
	removeHandler:function(element,type,handler){   //�Ƴ��¼�
		if(element.removeEventListener){
			element.removeEventListener(type,handler,false);
		}else if(element.detachEvent){
			element.detachEvent("on"+type,handler);
		}else{
			element["on"+type]=null;
		}
	}
};

//��קͼƬ
ImgViewer.DragDrop=function(){
	var  dragging=false,
		 diffX=0,
		 diffY=0;
    
	//�϶�ͼƬ
    function dragImg(event){  
		event=ImgViewer.EventUtil.getEvent(event);
		var target=ImgViewer.EventUtil.getTarget(event),
		     xMax=ImgViewer.drag.parentNode.offsetWidth+ImgViewer.w-50, 
			 yMax=ImgViewer.drag.parentNode.offsetHeight+ImgViewer.h-50; 
		     
		switch(event.type){
		  case "mousedown":
		     if(target.id=="img"&&ImgViewer.EventUtil.getButton(event)==0){  //���������ͼƬ�����϶�
		        dragging=true;
			    diffX=event.clientX-ImgViewer.drag.offsetLeft-ImgViewer.w;  
			    diffY=event.clientY-ImgViewer.drag.offsetTop-ImgViewer.h;
			    ImgViewer.EventUtil.preventDefault(event);
		     }
		     break;
		  case "mousemove":
		     if(dragging){
				//����ͼƬ����ߺ��ϱ߿��ѳ��������Χ 
				var	  xMin=-ImgViewer.drag.offsetWidth+ImgViewer.w+50,   
					  yMin=-ImgViewer.drag.offsetHeight+ImgViewer.h+50;	   			

				 //�϶�ͼƬ������ͼƬ����ק��Χ
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

//ͼƬ������
ImgViewer.ImgZoom=function(){ 
	var  bWidth=3000,  
		 bHeight=4000,
		 sWidth=30,
		 sHeight=40;
		
	//����ͼƬ�仯���ٶ�
    function setVelocity(w,h,dist){ 
		var width=ImgViewer.drag.width,
		     height=ImgViewer.drag.height,
		     left=ImgViewer.drag.offsetLeft,
		     topp=ImgViewer.drag.offsetTop;
			 
		 if(ImgViewer.drag.movement){   //����Ŵ���СʱͼƬ�Ķ���
		    clearTimeout(ImgViewer.drag.movement);
		 }
		 
		 //�Ŵ�ͼƬ�����
		 if(dist>0){
		     if(width>=w&&height>=h){
			    return true;
			 }else{
				width+=dist;
				height+=dist;
			 }
	     }
		 
		 //��СͼƬ�����
		 if(dist<0){
		     if(width<=w&&height<=h){
			     return true;
			  }else{
				 width+=dist;
				 height+=dist;
			  }
		 }
		 
		 //�ı�ͼƬ�ĳ��ȺͿ��
		 ImgViewer.drag.style.height=Math.round(height)+"px";            
         ImgViewer.drag.style.width=Math.round(width)+"px";
			
		 //ͼƬ�����ķŴ�
	     ImgViewer.drag.style.left=Math.round((left-dist/2)+ImgViewer.w)+"px";   
	 	 ImgViewer.drag.style.top=Math.round((topp-dist/2)+ImgViewer.h)+"px";  
		 
		 //����setTimeout����ͼƬ�Ľ���Ч�� 
	     ImgViewer.drag.movement=setTimeout(setVelocity,8,w,h,dist);  
	   }
	
	//�Ŵ�ͼƬ
	function zoomIn(){   
	    var	height=ImgViewer.drag.height,            
            width=ImgViewer.drag.width,
			nHeight=height*1.2,   
			nWidth=width*1.2;
	
		 //����ͼƬ�����ߴ�
	    if(height<bHeight&&width<bWidth){   		 
			 setVelocity(nWidth,nHeight,2);	 
	    }
	}
		
	//��СͼƬ
	function zoomOut(){   
		var height=ImgViewer.drag.height;            
             width=ImgViewer.drag.width;
		     nHeight=height/1.2,    
			 nWidth=width/1.2;
			 
		//����ͼƬ����С�ߴ�
		if(height>sHeight&&width>sWidth){  
			setVelocity(nWidth,nHeight,-2);
	    } 
	}
	
	//ͨ�������¼��Ŵ���СͼƬ
	function changeImg(event){
		//��ȡ�¼���Ŀ��
	    event=ImgViewer.EventUtil.getEvent(event);
		var target=ImgViewer.EventUtil.getTarget(event),
		     height=0,
			 width=0,
			 left=0,
			 topp=0;
			 
		//�����¼�ί�У������ҳ����
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
			ImgViewer.EventUtil.addHandler(document,"mousewheel",scrollImg); //IE��Opera��Chrome��Safari�����¼�
			ImgViewer.EventUtil.addHandler(document,"DOMMouseScroll",scrollImg);  //Firefox�����¼�
		},
		unchange:function(){
			ImgViewer.EventUtil.removeHandler(document,"click",changeImg);
			ImgViewer.EventUtil.removeHandler(document,"mousewheel",scrollImg); 
			ImgViewer.EventUtil.removeHandler(document,"DOMMouseScroll",scrollImg);  
		},
	};
	
}();
ImgViewer.ImgZoom.change();

//ͼƬ�ֻ�
ImgViewer.ImgSwitch=function(){
	var  list=document.getElementById("list"),
	     items=list.getElementsByTagName("li"),          
		 top=ImgViewer.drag.offsetTop,
		 left=ImgViewer.drag.offsetLeft;
		 
	//������ʽ�任
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
				if(sibling.nodeType!=1){  //�ų���Ԫ�����͵Ľڵ�
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
	
	//�任ͼƬ
	function switchImg(event){  
		event=ImgViewer.EventUtil.getEvent(event);
		ImgViewer.drag.src=this.firstChild.href;
		ImgViewer.drag.title=this.firstChild.firstChild.nodeValue;
		
		//�任ͼƬ��������ͼƬ�Ĵ�С��λ��
		ImgViewer.drag.style.width=ImgViewer.width+"px";
		ImgViewer.drag.style.height=ImgViewer.height+"px";
		ImgViewer.drag.style.top=top+ImgViewer.h+"px";  
		ImgViewer.drag.style.left=left+ImgViewer.w+"px";
	
		//ȡ�����ͼƬ��Ĭ����Ϊ
		ImgViewer.EventUtil.preventDefault(event);
		
		var that=this;	
		changeNavStyle(that);
	}
	
	for(var i=0,len=items.length;i<len;i++){
		ImgViewer.EventUtil.addHandler(items[i],"click",switchImg);
	}
}();

}
