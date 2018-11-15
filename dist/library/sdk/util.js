/**
 * objArror对象数组第一个出现属性等于prname的对象索引
*/
function find(objArror, prNamn, value){
  for (let i = objArror.length - 1; i >= 0; i--) {
    if (objArror[i][prNamn] == value) {
      return i
    }
  }
  return -1;
}
/**
 * 服务器时间转本地时间
*/
function dateParse(dateString){
  //转化为当前可使用时间字符串
  var regEx = new RegExp("\\-", "gi");
  dateString = dateString.replace(regEx, "/");
  //获取当前时间
  let newDate = new Date();
  let date = new Date(dateString);
  var returnDate;
  if (newDate.toDateString() === date.toDateString()) {
    //当分钟为个位数的时候,在前面添加一个0
    let minu = date.getMinutes();
    if (minu<10){
      minu = `0${minu}`;
    }
    //表示为今天
    returnDate = `${date.getHours()}:${minu}`;
  } else {
    //不为今天
    returnDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
  }
  return returnDate;
}
/**
 * GUID生成器
*/
function GUID() {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}
export{
  find, GUID, dateParse
}