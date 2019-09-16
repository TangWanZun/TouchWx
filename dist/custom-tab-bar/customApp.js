// custom-tab-bar/customApp.js
import {
  Apps,
  FunApps
} from "../library/sdk/UX_CONST.js"
import { STORAGE_KEY} from "../library/sdk/config.js"


let AllApps = Object.assign({}, FunApps, Apps);

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //业务功能
    appList: undefined,
    //应用功能
    funAppList: undefined,
    //全部应用
    allApps: AllApps,
    //首页快捷入口应用
    appsList: ["QRcode", "cmpScopeFilter", "WeMinProActivitySignUp", "WeMinProReserve"]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let appsList =  wx.getStorageSync(STORAGE_KEY.INDEX_APP);
    if(appsList){
      this.setData({
        appsList: appsList
      })
    }
    getApp().loadInfo(() => {
      //获取业务应用与 应用功能
      this.setData({
        funAppList: FunApps,
        appList: Apps
      })
    })
  },
  /**
   * 添加应用
   */
  addApp(e) {
    let index = e.currentTarget.dataset.index;
    if (this.data.appsList.length == 4) {
      wx.showToast({
        icon: "none",
        title: '首页最多添加4个应用'
      })
      return
    }
    this.data.appsList.push(index);
    this.setData({
      appsList: this.data.appsList
    })
  },
  /**
   * 减去应用
   */
  delApp(e) {
    let index = e.currentTarget.dataset.index;
    this.data.appsList.splice(index, 1);
    this.setData({
      appsList: this.data.appsList
    })
  },
  
  /**
   * 保存当前
   */
  send() {
    wx.showLoading({
      title: '保存中',
    })
    //将首页自定义功能保存
    wx.setStorageSync(STORAGE_KEY.INDEX_APP, this.data.appsList);
    wx.hideLoading();
    //控制首页页面刷新
    var pages = getCurrentPages();
    if (pages.length > 1) {
      //上一个页面实例对象 
      var prePage = pages[pages.length - 2];
      //关键在这里,这里面是触发上个界面的方法 
      prePage.indexSetAppList()
    }
    //跳转到首页
    wx.navigateBack()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})