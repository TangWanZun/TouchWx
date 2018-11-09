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
 * GUID生成器
*/
function GUID() {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}
export{
  find, GUID
}