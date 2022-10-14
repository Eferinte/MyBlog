function test(){
    let log={
        msg:"",
        add(test){
            this.msg+="[LOG]"+test+"    ["+ new Date()+"]\n"
        }
    };
    log.add("开始执行测试函数");

    
    log.add("测试函数执行结束");
    return log.msg;
}
export {test}