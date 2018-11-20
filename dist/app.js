import $request from 'library/sdk/request.js'
import * as $config from 'library/sdk/config.js'
import login from 'library/sdk/login.js'
App({

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    //挂载$request接口
    wx.$request = $request;
    //挂载configUrl
    this.privateData.configUrl = $config.configUrl;
    //运行
    login();
    //在程序加载时,先展示消息红点,等到点击到消息页签的时候弹出来具体消息的条数
    wx.showTabBarRedDot({
      index:0
    })
  },
  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {
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
   * 初始化当程序加载完成运行
  */
  onLoading(){

  },
  /**
   * 自定义加载完成运行
   * 有些页面会用到info信息，但是通常当我们调用info时 info暂未加载成功,
   * 此方法就是用来解决这个问题的
   * 仅仅需要传递一个回调函数，当信息全部获取的时候,就会调用回调函数
  */
  loadInfo(callback){
    //判断当前用户信息是否存在
    if (typeof this.privateData.loginInfo === 'undefined'){
      //当用户信息不存在的时候，将函数存入滞留池中
      this.privateData.loadRetention.push(callback);
    }else{
      //当用户信息存在的时候
      //调用方法
      callback();
    }
  },
  /**
   * 私有数据,
   * 用于存放全局变量的
  */
  privateData:{
    //登陆凭证
    Token:"",
    //用户信息
    loginInfo:undefined,
    //请求滞留池
    requestRetention: [],
    //加载滞留池
    loadRetention:[],
    // url配置
    configUrl:{}
  }
})
