//全局cookie
function setCookie(cname,cvalue,exdays=365)
{
  var d = new Date();
  d.setTime(d.getTime()+(exdays*24*60*60*1000));
  var expires = "expires="+d.toGMTString();
  let cql = cname + "=" + cvalue + ";" + expires+";path='/'";
  console.log("[CQL=]",cql);
  document.cookie = cql;
}
function getCookie(cname)
{
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i=0; i<ca.length; i++) 
  {
    var c = ca[i].trim();
    if (c.indexOf(name)==0) return c.substring(name.length,c.length);
  }
  return "";
}
function delCookie(cname){

    document.cookie = cname+"=; expires=Thu, 01 Jan 1970 00:00:00 GMT;path='/';";
}
export { setCookie , getCookie , delCookie};