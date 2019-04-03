// const wxid = "gh_a8db42819a59";
const wxid = "gh_88faf4d66bc0";
const host = "https://evip.rocar.net/";
// const host = "https://vip.sap-unis.com/";
let configUrl = {
    wxid,
    host,
    url: `${host}wx/${wxid}`,
    imgUrl: `${host}`
}
//工作类型
const WORK_TYPE = {
    WORK_JY: "Rescue", //救援
    WORK_TS: "Feedback", //投诉
    WORK_YY: "Reserve", //预约
    WORK_HD: "ActSignUp", //活动
    WORK_DQ: "Timed" //到期
}
//聊天文本类型
const CHAT_CONST = {
    CHAT_TEXT: 'text', //文本消息
    CHAT_IAMGE: 'image', //图片消息
    CHAT_ADDS: 'location', //位置消息
    CHAT_VOICE: 'voice', //音频消息
    CHAT_VIDEO: 'video', //视频信息
    CHAT_LEFT: 'Client', //客户
    CHAT_RIGHT: 'Server', //客服
    CHAT_EVALUATE: 'Evaluate', // 业务  评价
    CHAT_FEEDBACK: 'Feedback', // 业务  信息反馈
    CHAT_DISCUSS: 'Discuss', // 业务 留言
    CHAT_NATIVE: 'Native', // 业务 原生消息
    CHAT: 0, //聊天信息
    DATE: 1, //日期信息
    LOG_IN: 2, //加载中
    LOG_OUT: 3, //加载完成
    LOG_FAIL: 4 //加载失败
}
//聊天文本类型
const DEDUCTION_TYPE = {
    //数量
    NUMBER: 'A01',
    //金额
    AMOUNT: 'A02'
}
//权限控制
const UX_TYPE = {
    //有权限
    ON_UX: 'A02',
    //无权限
    NO_UX: 'A01'
}
//权限控制
const UX_NAME = {
    //用来进行用户核销权限
    A01: 'Consume',
}
export {
    WORK_TYPE,
    CHAT_CONST,
    DEDUCTION_TYPE,
    UX_TYPE,
    UX_NAME,
    configUrl
}