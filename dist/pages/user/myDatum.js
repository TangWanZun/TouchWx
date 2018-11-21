// pages/user/myDatum.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginInfo:{}
  },
  /**
   * 退出登录
  */
  button(){
    wx.showModal({
      title:"确定退出登录",
      content:"",
      success(res){
        if (res.confirm) {
          wx.reLaunch({
            url: '/pages/tabBar/login'
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    getApp().loadInfo(function () {
      _this.setData({
        loginInfo: getApp().privateData.loginInfo
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})