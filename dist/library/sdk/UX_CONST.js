/**
 * 功能应用面板信息
 */
export const FunApps = {
  //我的二维码
  "QRcode": {
    _show: true,
    imgUrl: '/assets/app/khzl.svg',
    name: '我的二维码',
    url: '/pages/user/myQr'
  },
  //数据权限
  "cmpScopeFilter": {
    _show: true,
    imgUrl: '/assets/app/sjqx.svg',
    name: '数据权限',
    url: '/pages/user/cmpScopeFilter'
  },
}
/**
 * 业务应用面板信息
 */
export const Apps = {
  //活动报名
  "WeMinProActivitySignUp":{
    _show:false,
    imgUrl:'/assets/app/WORK_HD.svg',
    name:'活动报名',
    url:'/pages/work/workActivity'
  },
  //救援单
  "WeMinProRescue": {
    _show: false,
    imgUrl: '/assets/app/WORK_JY.svg',
    name: '救援服务',
    url: '/pages/work/workRescue'
  },
  //预约单
  "WeMinProReserve": {
    _show: false,
    imgUrl: '/assets/app/WORK_YY.svg',
    name: '预约服务',
    url: '/pages/work/workMake'
  },
  //福利中心
  "WeMinProECardRules":{
    _show: false,
    imgUrl: '/assets/app/flzx.svg',
    name: '福利中心',
    url: '/pages/user/welfareCore'
  }
}
/**
 * 更新权限app，并且将数据保存到缓存中
 */
export const upDateApp = function(uxList){
  // console.log(uxList)
  for (let x in Apps){
    if (uxList[x]){
      //表示存在当前app功能权限
      Apps[x]._show = true;
    }
  }
}

/**
 * 底部栏权限
 */
export const TABBAR_UX = {
  "INDEX": {
    "pagePath": "/pages/tabBar/index",
    "text": "首页",
    // "iconPath": "/assets/tabBar/message.png",
    // "selectedIconPath": "/assets/tabBar/message-select.png",
    "iconPath": "/assets/tabBar/index.png",
    "selectedIconPath": "/assets/tabBar/index-select.png",
    isShow: true
  },
  // [wx.$UX.WeMinProWork]: {
  "WORK": {
    "pagePath": "/pages/tabBar/work",
    "text": "工作",
    "iconPath": "/assets/tabBar/work.png",
    "selectedIconPath": "/assets/tabBar/work-select.png",
    isShow: true
  },
  'app': {
    isApp: true,
    isShow: true
  },
  'MESSAGE': {
    // [wx.$UX.WeMinProMessage]: {
    "pagePath": "/pages/tabBar/message",
    "text": "客户",
    // "iconPath": "/assets/tabBar/message.png",
    // "selectedIconPath": "/assets/tabBar/message-select.png",
    "iconPath": "/assets/tabBar/client.png",
    "selectedIconPath": "/assets/tabBar/client-select.png",
    "badge": 0,
    isShow: true
  },
  // [wx.$UX.WeMinProCooReport]: {
  //   "pagePath": "/pages/tabBar/cooReport",
  //   "text": "报告",
  //   "iconPath": "/assets/tabBar/report.png",
  //   "selectedIconPath": "/assets/tabBar/report-select.png",
  //   isShow: false
  // },
  "USER": {
    // [wx.$UX.WeMinProUser]: {
    "pagePath": "/pages/tabBar/user",
    "text": "我的",
    "iconPath": "/assets/tabBar/user.png",
    "selectedIconPath": "/assets/tabBar/user-select.png",
    isShow: true
  }
}

export const UX_CONST = {
    /**
     * 最新的权限信息
     */
    
    /**
     * 原来的权限信息
     */
    //信息权限
    "WeMinProMessage": "WeMinProChat",
    //客户页面
    "WeMinProClient": "WeMinProOcrd",
    //工作权限
    "WeMinProWork": "WeMinProWorker",
    //我的权限
    "WeMinProUser": "WeMinProUserMain",
    //运营报告
    "WeMinProCooReport": "WeMinProCooReport",
    //核销权限
    "ConsumeRelease":"WeMinProOcrd.ConsumeRelease",
    //业务权限范围
    "CmpScopeFilter": "WeMinProUserMain.CmpScopeFilter",
    //预约单权限
    "WeiXinReserve": "WeMinProWorker.WeiXinReserve",
    //救援单权限
    "WeiXinRescue": "WeMinProWorker.WeiXinRescue",
    //活动报名权限
    "WeiXinActivitySignUp": "WeMinProWorker.WeiXinActivitySignUp",
    //到期提醒权限
    "TimedReport":"WeMinProWorker.TimedReport",
}
/**
 * 获取权限信息
 */
export const getUX = function(UX){
    let privateData = getApp().privateData;
    return new Promise((resolve,reject)=>{
        let dataList = UX.split('.');
        //等待获取运营权限
        getApp().loadInfo(function () {
            let res = privateData.UXList;
            for(let i=0;i<dataList.length;i++){
                let item = res[dataList[i]];
                if (item){
                    //表示还有下一层
                    res = item;
                } else if (typeof item =="undefined"){
                    //表示传递的权限中没有UX这一项 ，那么默认就是true
                    res = true;
                }else {
                    //表示权限为 false
                    res = false;
                }
            }
            resolve(res?true:false);
        })
    })
}