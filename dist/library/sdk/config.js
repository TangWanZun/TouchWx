const wxid = "gh_88faf4d66bc0";
const host = "https://www.sap-unis.com/";
let configUrl = {
  wxid,
  host,
  url: `${host}wx/${wxid}`,
  imgUrl:`${host}pc/`
}
//工作类型
const WORK_TYPE = {
  WORK_JY: "A01",//救援
  WORK_TS: "A02",//投诉
  WORK_YY: "A03",//预约
  WORK_HD: "A04",//活动
  WORK_DQ: "A05"//到期
}
//聊天文本类型
const CHAT_CONST = {
  CHAT_TEXT: 'text',//文本消息
  CHAT_IAMGE: 'image',//图片消息
  CHAT_ADDS: 'location',//位置消息
  CHAT_VOICE: 'voice',//音频消息
  CHAT_VIDEO: 'video',//视频信息
  CHAT_LEFT: 'Client',//客户
  CHAT_RIGHT: 'Server',//客服
  CHAT:0,         //聊天信息
  DATE:1,          //日期信息
  LOG_IN: 2, //加载中
  LOG_OUT: 3,//加载完成
  LOG_FAIL: 4//加载失败
}
export { WORK_TYPE, CHAT_CONST, configUrl}