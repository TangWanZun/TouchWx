// pages/tabBar/index.js
import login from '../../library/sdk/login.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    formData: [],
    loginWidth: 0,
    loginHeight:0,
    loginTop:0,
    headerTop:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let systemInfo = getApp().privateData.systemInfo;
    let boundInfo = getApp().privateData.boundInfo;
    // console.log(systemInfo,boundInfo)
    let width = boundInfo.left - 30;
    this.setData({
      loginWidth: width,
      loginHeight: width*0.128,
      loginTop: boundInfo.top+2,
      headerTop: boundInfo.bottom+10
    })
    //这里会出现抢线程的问题，比如app的跳转早于这个页面
    let privateData = getApp().privateData;
    if (typeof privateData.loginInfo === 'undefined') {
      //运行
      login.init();
    }
    try {
      var value = wx.getStorageSync('indexData')
      if (value) {
        this.setData({
          formData: value
        });
      } else {
        this.getData(true);
      }
    } catch (e) {
      console.log(`获取首页指标信息错误：${e}`)
      this.getData(true);
    }
  },
  /**
   * 点击搜索按钮
   */
  toQuery() {
    wx.navigateTo({
      url: '/pages/client/query'
    });
  },
  /**
   * 点击扫码按钮
   */
  scanCode() {
    let _this = this;
    wx.scanCode({
      scanType: ['qrCode'],
      success(res) {
        // 扫码返回成功跳转到扫码入口页面
        wx.navigateTo({
          url: '/pages/user/sweepCode?openId=' + res.result
        });
      },
      fail() {

      }
    })
  },
  /**
   * 加载数据
   */
  getData(isLoad = false) {
    let _this = this;
    if (isLoad) {
      wx.showLoading({
        title: '数据加载中',
        mask: true
      })
    }
    wx.$request({
      url: "/WeMinProPlatJson/GetList",
      data: {
        docType: 'Main',
        actionType: 'ReportList',
        needTotal: false,
      },
      success(res) {
        _this.setData({
          formData: res
        });
        wx.setStorage({
          key: "indexData",
          data: res
        })
      },
      complete() {
        wx.stopPullDownRefresh();
        isLoad && wx.hideLoading()
      }
    })
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
    this.getData();
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