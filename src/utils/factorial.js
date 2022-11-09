//阶乘函数
//limitTimes为小于等于n的整数，为方便计算Cnm等排列组合而引入，默认等于n
export default function getFactorial(n, limitTimes){
    let ans = 1;
    // if(typeof limitTimes === 'undefined'){
    //     limitTimes = n;
    // }
    while((n>0)&&(limitTimes>0)){
        ans = ans * n;
        n--,limitTimes--;
    }
    return ans;
}