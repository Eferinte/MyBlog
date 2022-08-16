function strToList(str){    
    let list=[]       
    let point = String(str).lastIndexOf("#");
    while(point!=-1){
        let tag = str.slice(point+1);
        list.push(tag);
        str =  str.slice(0,point);
        point = str.lastIndexOf("#");
    }
    return list;
}
function listToStr(list){
    let str = "";
    if(typeof list != undefined){
        list.forEach((item)=>{
            str += "#"+item;
        })
    }
    return str;
}
export {strToList,listToStr}