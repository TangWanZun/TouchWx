// pages/user/sweepCode.js
import {
  configUrl
} from '../../library/sdk.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [
      // {
      //   ImgUrl: "/assets/sweepCode/6.svg",
      //   Name: "用户信息"
      // },
      // {
      //   ImgUrl: "/assets/sweepCode/2.svg",
      //   Name: "预约到店登记"
      // },
      // {
      //   ImgUrl: "/assets/sweepCode/3.svg",
      //   Name: "餐券核销"
      // },
      // {
      //   ImgUrl: "/assets/sweepCode/4.svg",
      //   Name: "洗车券核销"
      // },
    ],
    imgUrl: configUrl.imgUrl,
    formData: {},
    openId: "",
    online: undefined
  },

  /**
   * 获取数据信息
   */
  getData() {
    let _this = this;

    wx.$request({
      url: "/WeMinProPlatJson/GetDataSet",
      data: {
        docType: 'Main',
        actionType: 'ScanBaseInfo',
        docId: this.data.openId,
      },
      success(res) {
        console.log(res);
        _this.setData({
          formData: res.Table[0]
        })
      },
      complete() {
        wx.hideLoading()
      }
    })
  },
  /**
   * 点击用户档案
   */
  toPage(e){
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      openId: options.openId,
      online: options.online
    })
    wx.showLoading({
      title: '数据加载中',
      mask: true
    })
    //获取数据权限之后进行
    getApp().loadInfo(() => {
      //获取数据
      this.getData();
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