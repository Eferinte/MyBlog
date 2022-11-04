export default function warp(arr, a, b){
    let temp = arr[a];
    arr[a] = arr[b];
    arr[b] = temp;
}