function test(){
    let log={
        msg:"",
        add(test){
            this.msg+="[LOG]"+test+"    ["+ new Date()+"]\n"
        }
    };
    log.add("开始执行测试函数");

    let context = '## 懒加载\n' +
    '亦称延迟加载，指对于单个长网页，在同一个页面中需要请求相当多的资源（以图片资源为例）时使用的优化方式。在用户访问页面时，仅请求用户视口内的图片资源 ，待用户滑动视口时再对使用的图片进行请求。\n' +
    '由于资源请求的减少，懒加载能够优化用户**打开网页时**的加载速度，同时分散了资源的请求，也减少了服务端的压力；\n' +
    '### 懒加载的实现\n' +
    '一般的，通过将图片的src属性设为描述性字符或空字符，将真实地址附加在[data-original](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Global_attributes/data-*)属性内，通过监听scroll事件判断在图片进入视口后触发，将属性值替换即可。\n' +
    '```html\n' +
    '<div id="view">\n' +
    '    <img class="lazyImg" src="" data-original="original-src">\n' +
    '    <img class="lazyImg" src="" data-original="original-src">\n' +
    '    <img class="lazyImg" src="" data-original="original-src">\n' +
    '</div>\n' +
    '```\n' +
    '```js\n' +
    "let view = document.getElementById('view');\n" +
    "let img = document.getElementsByClassName('lazyImg');\n" +
    'view.onscroll = function () {\n' +
    '    img.forEach((img)=>{\n' +
    '        if(inView(img)){img.src = img.dataset.original}\n' +
    '    })\n' +
    '}\n' +
    '```\n' +
    '#### 图片进入视口的判断方式\n' +
    '##### 1、直接计算图片与视口的距离\n' +
    '原生API：[getBoundingClientReat](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/getBoundingClientRect)得到元素与视口左上角的垂直距离，当该距离小于视口高度时即为进入视口。\n' +
    '```js\n' +
    '    inView(img){\n' +
    '        return window.innerHeight>img.getBoundingClientReat().top?true:false\n' +
    '    }\n' +
    '```\n' +
    '但实际上，在一次滚动中，scroll事件触发次数会远远超出我们希望的监听频率而带来不小的开销，所以通常会使用节流函数进行包装，限定事件触发的频率。\n' +  
    '##### 2、IntersectionObserver\n' +
    'HTML5新增的API：[IntersectionObserver](https://developer.mozilla.org/zh-CN/docs/Web/API/IntersectionObserver)省去了节流处理的操作。\n' +
    '```js\n' +
    "let imgs = document.getElementsByClassName('lazyImg');\n" +
    'let view = document.getElementById(view);\n' +
    'let ob = new IntersectionObserver(function (entries ) {\n' +
    '    entries.forEach(val => {\n' +
    '        let { target } = val;\n' +
    '        target.src = target.dataset.original;\n' +
    '    })\n' +
    '})\n' +
    'imgs.forEach(img => {\n' +
    '    ob.observe(img);\n' +
    '})\n' +
    '```\n' +
    '[IntersectionObserver API 使用教程 - 阮一峰的网络日志](http://www.ruanyifeng.com/blog/2016/11/intersectionobserver_api.html)\n' +
    '##### 3、img独有的标签loading（实验属性，不推荐使用）\n' +
    '```html\n' +
    '<div class="parent">\n' +
    '    <img loading="lazy" src="whatever">\n' +
    '</div>\n' +
    '```\n' +
    '## 预加载\n' +
    '指将用户暂时用不到的资源先一并请求到浏览器缓存中（如sessionStorage）,待用户使用时直接从本地缓存中取用。\n' +
    '由于是直接从本地缓存调用的，预加载能够优化用户的使用体验，缺点是资源请求集中，加重了服务端的负担。\n' +
    '## 节流（throttle）\n' +
    '定义：对于一串高频事件，第一次事件触发后的时间t内不再继续响应该事件。\n' +
    '### 节流的实现\n' +
    '```js\n' +
    '//时间戳版本实现节流\n' +
    'function throttle(func,wait) {\n' +
    '    //定义初始时间\n' +
    '    var oldTime=new Date();\n' +
    '\n' +
    '    return function() {\n' +
    '        var _this=this;\n' +
    '        var args=arguments;\n' +
    '\n' +
    '        //当前时间戳\n' +
    '        var newTime=new Date();\n' +
    '\n' +
    '        //判断用当前时间减去旧的时间，如果大于wait指定的时间就会触发\n' +
    '        if(newTime-oldTime>wait) {\n' +
    '            //执行触发的函数\n' +
    '            func.apply(_this,args)\n' +
    '            //将旧时间更新\n' +
    '            oldTime=newTime;\n' +
    '        }\n' +
    '    }\n' +
    '}\n' +
    '```\n' +
    '## 防抖（debounce\n' +
    '讲到节流就不得不提防抖。防抖在固定时间内没有触发事件会在固定时间结束后触发，如果在固定时间内触发了就会延长固定时间\n' +
    '定义：同样对于一串高频事件，仅当两次事件的间隔超过了规定的时间t时才会执行最后一次事件。\n' +
    '对比防抖和节流，节流是在固定时间t内必然触发一次事件，相当于是对过于密集的事件流的一种稀疏化处理。\n' +
    '而同样是密集事件流，防抖则是对固定时间t内不再发生该事件时才响应之前的最后一次事件；\n' +
    '### 防抖的实现\n' +
    '```js\n' +
    '//用定时器实现防抖\n' +
    'function debounce(func,wait) {\n' +
    '    var timer=null;\n' +
    '    return function() {\n' +
    '    //保存当前调用的dom对象\n' +
    '     var _this=this;\n' +
    '     //保存事件对象\n' +
    '     var args=arguments;\n' +
    '     clearTimeout(timer)\n' +
    '     timer=setTimeout(function() {\n' +
    '         func.apply(_this,args)\n' +
    '     },wait)\n' +
    '    }\n' +
    '}\n' +
    '```'
    console.log(context);



    
    log.add("测试函数执行结束");
    return log.msg;
}
export {test}