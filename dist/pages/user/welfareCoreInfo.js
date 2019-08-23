// pages/user/welfareCoreInfo.js
import {
  configUrl
} from '../../library/sdk/config.js'
import {
  vw2px
} from '../../library/sdk/util.js'
import QRCode from '../../library/sdk/weapp-qrcode.js'
let qrcode;
const qrcodeWidth = vw2px(70);
let id = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    formData: {},
    imgRootUrl: configUrl.imgUrl,
    qrcodeWidth: qrcodeWidth,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中'
    })
    wx.$request({
      url: "/WeMinProPlatJson/GetDataSet",
      data: {
        docType: 'WelfareCenter',
        actionType: 'WelfareCenterDetail',
        docid: options.id,
        needTotal: false,
      },
      success:res=>{
        let data = res.Table[0]
        console.log(data);
        //生成新的二维码
        qrcode = new QRCode('canvas', {
          // usingIn: this,
          text: `${configUrl.peUrl}myUser/welfareCoreInfor?wxid=${data.WxId}&id=${options.id}`,
          width: qrcodeWidth,
          height: qrcodeWidth,
          colorDark: "black",
          colorLight: "white",
          correctLevel: QRCode.CorrectLevel.H,
        });
        this.setData({
          formData:data
        })
      },
      complete() {
        wx.hideLoading();
        wx.hideLoading()
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