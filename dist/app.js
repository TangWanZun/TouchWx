import $request from 'library/sdk/request.js'
import login from 'library/sdk/login.js'
App({

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    //挂载$request接口
    wx.$request = $request;
  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {
    //获取用户数据
    // login();
  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {
    
  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {
    
  },

  /**
   * 私有数据,
   * 用于存放全局变量的
  */
  privateData:{
    //用户信息
    userInfo:undefined,
    //请求滞留池
    requestRetention:[],
    // url配置
    configUrl:{}
  }
})
