//正式
// appId wx741745d2b71d095d
const wxid = "gh_88faf4d66bc0";
const host = "https://evip.rocar.net/";
const pehost = "https://evip.rocar.net/wxapp/#/"
//测试
// const wxid = "gh_a8db42819a59";
// const host = "https://vip.sap-unis.com/wxpc/";
// const pehost = "https://vip.sap-unis.com/wxapp/#/"
// wx334450ff9ab82891
let configUrl = {
    wxid,
    host,
    url: `${host}wx/${wxid}`,
    imgUrl: `${host}`,
    //手机端页面位置
    peUrl: `${pehost}`
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
//公司汽车类型
export const CMP_CAR={
    'A01':'奔驰车',
    'A02':"中级车"
}
//公司区域
export const CMP_REGION = {
    'A01': '东区',
    'A02': '西区',
    'A03': '南区',
    'A04':'北区',
}
//客户铭牌 位置
export const  NAMEPLATE={
    'A01':{
        name:'逸蓝卡',
        src:"/assets/icon/ylk.svg"
    },
    'A02':{
        name: '厂家ISP',
        src: "/assets/icon/isp.svg"
    }
}
//指标类型
export const INDEX_TYPE = {
    //相加
    'SUM': {
        code: 'SUM',
    },
    //使用存储过程中传递的总计
    'TOTAL':{
        code:'TOTAL'
    },
    //什么都不计算
    'NONE':{
        code:'NONE',
    }
}

/**
 * Storage类型的全部key值
 */
export const STORAGE_KEY = {
  //保存的自定义的首页应用
  INDEX_APP:"indexApp"
}

export {
    WORK_TYPE,
    CHAT_CONST,
    DEDUCTION_TYPE,
    configUrl
}