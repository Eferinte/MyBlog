export default function getOffset(elem,mouseEvent){
    let elemPos = elem.getBoundingClientRect();
    return {offsetX:mouseEvent.clientX-elemPos.x,offsetY:mouseEvent.clientY-elemPos.y}
}