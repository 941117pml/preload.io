//图片预加载
//一般将插件写在局部，以便与外部的内容互不干涉、影响，使用闭包来模拟局部作用域
(function($){
	function PreLoad(imgs,options){//构造函数
		this.imgs=(typeof imgs==='string')?[imgs]:imgs;
		this.opts=$.extend({},PreLoad.DEFAULTS,options);//将PreLoad.DEFAULTS, options这两个对象融合一下，生成一个新的对象{}

		if(this.opts.order==='ordered'){
			this._ordered();
		}else{
			this._unordered();//下划线的含义：内部使用，而不提供外部调用
		}
	}
	PreLoad.DEFAULTS={//当没有传递参数的时候，使用默认参数来代替
		each:null,//每张图片加载完毕后执行
		all:null,//所有图片加载完毕后执行
		order:'unordered'//默认情况下是无序预加载的
	};
	PreLoad.prototype._unordered = function(){   //无序加载
	//面向对象写方法，都写在原型上，以使每一次调用都保持原样
	    var imgs = this.imgs;
	    // console.log(imgs)
	    var opts = this.opts;
	    var count = 0;
	    var len = imgs.length;

	    $.each(imgs, function(i, src) {
	      if (typeof src != 'string') {
	        return;
	      }

	      var imgObj = new Image();
	      $(imgObj).on('load error', function() {
	        	opts.each && opts.each(count);
		        if (count >= len - 1) {
		          opts.all && opts.all();
		        }
	        count++;
	      });
	      imgObj.src = src;
	    });
	  };
	  
	PreLoad.prototype._ordered=function(){//有序加载
		var opts = this.opts;
		var imgs = this.imgs;
		var len = imgs.length;
	    // console.log(imgs)
	    var count = 0;
	    
	    function load() {
			var imgObj=new Image();

			$(imgObj).on('load error',function(){
				opts.each && opts.each(count);
				if(count>=len){
					//所有图片加载完毕
					opts.all && opts.all();
				}else{
					load();
				}
				count++;
			});

			imgObj.src=imgs[count];
		}
		load();
	}
	// $.fn.extend->$('#img').preload();
	// $.extend->$.preload();
	$.extend({
		preload:function(imgs,opts){
			new PreLoad(imgs,opts);
		}
	});
})(jQuery);
