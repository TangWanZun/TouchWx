Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginInfo: {}
  },
  /**
   * 打开手机扫码
  */
  scanCode(){
    let _this = this;
    wx.scanCode({
      scanType: ['qrCode'],
      success(res){
        console.log(res)
        //扫码返回成功跳转到卡券页面中
        wx.navigateTo({
          url: '/pages/client/clientDetails/coupon'
        });          
      },
      fail(){

      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var _this = this;
    getApp().loadInfo(function(){
      _this.setData({
        loginInfo: getApp().privateData.loginInfo
      })
    })
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