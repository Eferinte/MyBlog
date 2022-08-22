//用定时器实现防抖
function debounce(func,wait) {
    var timer=null;
    return function() {
    //保存当前调用的dom对象
     var _this=this;
     //保存事件对象
     var args=arguments;
     clearTimeout(timer)
     timer=setTimeout(function() {
         func.apply(_this,args)
     },wait)
    }
}
export {debounce};