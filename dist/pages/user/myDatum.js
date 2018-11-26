// pages/user/myDatum.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginInfo:{},
    fromData:{
      birthday:'',
      nativePlace:'',
      sex:''
    },
    sexArray:[
      '男','女'
    ]
  },
  /**
   * 保存修改
  */
  send() {
    wx.$request({
      url: "/WeMinProPlatJson/Submit",
      data: {
        docType: 'workSend',
        actionType: 'Send',
        needTotal: false,
        docjson: JSON.stringify({
          
        })
      },
      success(res) {
        wx.showToast({
          title: '修改以保存',
        })
      }
    })
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
   * 头像
  */
  bingdHeadImg(){
    wx.chooseImage({
      count:1,
      success: function(res) {
        console.log(res);
      },
    })
  },
  /**
   * 籍贯
  */
  bindNativePlace:function(e){
    // console.log(e.detail.value);
    let value = "";
    e.detail.value.forEach(function(item){
      value += item;
    })
    this.setData({
      'fromData.nativePlace': value
    })
  },
  /**
   * 出生日
  */
  bindBirthday(e){
    // console.log(e.detail.value);
    this.setData({
      'fromData.birthday': e.detail.value
    })
  },
  /**
   *  性别 
  */
  bindSex(e){
    this.setData({
      'fromData.sex': this.data.sexArray[e.detail.value]
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