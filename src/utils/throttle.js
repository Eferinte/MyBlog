function throttle(func, wait){
    //定义初始时间
    var oldTime=new Date();

    return function() {
        var _this=this;
        var args=arguments;

        //当前时间戳
        var newTime=new Date();

        //判断用当前时间减去旧的时间，如果大于wait指定的时间就会触发
        if(newTime-oldTime>wait) {
            //执行触发的函数
            func.apply(_this,args)
            console.log("触发函数,time=",newTime)
            //将旧时间更新
            oldTime=newTime;
        }
    }
}

export  {throttle};