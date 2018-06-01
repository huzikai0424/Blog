jQuery.CateNav=function(elem1,elem2){
	//添加目录
	var currObj;
	var offsetTop=0;
	var aHeight = []
	var hasNav = false
	var h2List=new Array(),h3List=new Array();
	
	var addNav=function(){
		var i1=0,i2=0,n1=0,n2=0;
		var temp='<dl>';
		var cateList=$(elem1).html().match(/(<h[2-3][^>]*>.*?<\/h[2-3]>)/ig);
		if (cateList){
			hasNav=true
			for(var i=0;i<cateList.length;i++){
				if(/(<h2[^>]*>.*?<\/h2>)/ig.test(cateList[i])){
					n1++;
					n2=0;
					temp+='<dd class="cate-item1"><a href="#'+n1+'">'+cateList[i].replace(/<[^>].*?>/g,"")+'</a></dd>';
					h2List[i1]=n1;
					i1++;
				}else{
					n2++;
					temp+='<dd class="cate-item2"><a href="#'+n1+'_'+n2+'">'+cateList[i].replace(/<[^>].*?>/g,"")+'</a></dd>';
					h3List[i2]=n1+'_'+n2;
					i2++;
				}
			}
			temp+='</dl>';
			$(elem2).append(temp);
		}
	};
	//添加锚点
	var addPoint=function(){
		var i1=i2=0;
		$(elem1).find('h2').each(function(){
			$(this).prepend('<a name="'+h2List[i1]+'"></a>');
			var height = $(this).offset().top+5
			aHeight.push(height)
			i1++;
		});
		$(elem1).find('h3').each(function(){
			$(this).prepend('<a name="'+h3List[i2]+'"></a>');
			var height = $(this).offset().top + 5
			aHeight.push(height)
			i2++;
		});
		function asc(a, b) {
			return a > b;
		}
		aHeight.sort(asc)
	};
	//点击锚点，跳转制定位置
	var clickPoint=function(){
		$(elem2+' a').click(function(e){
			e.preventDefault();
			//$(elem2+' dd').removeClass('active');
			//$(this).parent('dd').addClass('active');
			currObj=$("[name='"+$(this).attr('href').replace(/#/,'')+"']");
			offsetTop=currObj.offset().top-10;
			
			$('html,body').animate({
				scrollTop:offsetTop
			},500,'swing');
			//console.log($(window).scrollTop(), offsetTop)
		});
	};
	
	//屏幕滚动，显示并选中锚点
	var scrollWin=function(){
	var windowTop=0;
		$(window).scroll(function(){
			windowTop=$(window).scrollTop()+15; //微调
			fixNav()
			if (hasNav){
				for(var i=0;i<aHeight.length;i++){
					if (windowTop >= aHeight[i] && windowTop<aHeight[i+1]){
						$(elem2 + ' dd').removeClass('active');
						$(elem2 + ' dd').eq(i).addClass('active');
						break
					} else if (windowTop < aHeight[0]){
						$(elem2 + ' dd').removeClass('active');
						$(elem2 + ' dd').eq(0).addClass('active');
					} else if (windowTop >= aHeight[aHeight.length-1]){
						$(elem2 + ' dd').removeClass('active');
						$(elem2 + ' dd').eq(aHeight.length-1).addClass('active');
					}else{
						$(elem2 + ' dd').removeClass('active');
					}
				}
			}
		});
	};
	var fixNav = function(){
		var windowTop = $(window).scrollTop();
		if (windowTop >= $(".rightBox").offset().top) {
			$("#active-block").addClass("fixed")
		} else {
			$("#active-block").removeClass('fixed')
		}
	}
	var init=function(){
		addNav();
		addPoint();
		clickPoint();
		scrollWin();
		fixNav()
	}
	init();
}