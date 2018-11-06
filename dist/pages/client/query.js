// pages/client/query.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList:[
    ],
    selectBodyShow:true,
    //图片数据
    imgUrl: getApp().privateData.configUrl.imgUrl
  },
  /**
   * 输入框查询
  */
  queryInput: function (event) {
    let _this = this;
    if (event.detail.value.length===0){
      this.setData({
        dataList: []
      })
    }else{
      wx.$request({
        url: "/WeMinProChatMessage/GetContactList",
        data: {
          searchv: event.detail.value,
          start: 0,
          limit: 25,
        },
        success(res) {
          console.log(res)
          _this.setData({
            dataList: res.data
          })
        }
      })
    }
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