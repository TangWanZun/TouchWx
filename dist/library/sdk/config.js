let configUrl = {
  wxid:"ax1111111",
  url:"www.sap-unis.com"
}
//
let app = getApp();
app.privateData.configUrl = configUrl;
//工作类型
const WORK_TYPE = {
  WORK_JY: "A01",
  WORK_TS: "A02",
  WORK_YY: "A03",
  WORK_HD: "A04",
  WORK_DQ: "A05"
}
//聊天文本类型
const CHAT_TYPE = {
  CHAT_TEXT:'text',//文本消息
  CHAT_IAMGE:'image',//图片消息
  CHAT_ADDS:'location',//位置消息
  CHAT_VOICE:'voice',//音频消息
  CHAT_VIDEO:'video',//视频信息
}
export { WORK_TYPE, CHAT_TYPE}