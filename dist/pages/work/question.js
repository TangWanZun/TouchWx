// pages/work/question.js
import {
  configUrl
} from '../../library/sdk/config.js'
import {
  vw2px
} from '../../library/sdk/util.js'
import QRCode from '../../library/sdk/weapp-qrcode.js'
let qrcode;
const qrcodeWidth = vw2px(70);
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList:[],
    modalShow:false,
    qrcodeWidth: qrcodeWidth,
    modalTitle:""
  },
  /**
   * 加载组件
   */
  myLlbox: {},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //获取自定义组件
    this.myLlbox = this.selectComponent('#myLlbox');
    this.getData();
  },
  /**
   * 打开二维码
   */
  showQr(e){
    let index = e.currentTarget.dataset.index;
    let data = this.data.dataList[index]
    this.setData({
      modalShow: true,
      modalTitle:data.Name
    })
    setTimeout(() => {
      //生成新的二维码
      qrcode = new QRCode('canvas', {
        // usingIn: this,
        text: `${configUrl.peUrl}myUser/questionnaire?id=${data.DocId}&wxid=${data.WxId}`,
        width: qrcodeWidth,
        height: qrcodeWidth,
        colorDark: "black",
        colorLight: "white",
        correctLevel: QRCode.CorrectLevel.H,
      });
    }, 300)
  },
  /**
   * 关闭二维码
   */
  modalClose(){
    this.setData({
      modalShow:false
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

  },

  /**
   * 获取数据
   */
  getData() {
    //首先清空数据
    this.setData({
      dataList: []
    })
    dataList: []
    var _this = this;
    this.myLlbox.init({
      url: "/WeMinProPlatJson/GetList",
      data: {
        docType: 'WorkData',
        actionType: 'QuestionList',
        needTotal: false,
      },
      success(res) {
        _this.setData({
          dataList: _this.data.dataList.concat(res)
        })
      },
      complete(res) {
        wx.stopPullDownRefresh();
      }
    });
  }
})