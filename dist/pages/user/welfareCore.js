// pages/user/welfareCore.js\
import {
  configUrl
} from '../../library/sdk/config.js'
import {
  vw2px
} from '../../library/sdk/util.js'
import QRCode from '../../library/sdk/weapp-qrcode.js'
let qrcode;
const qrcodeWidth = vw2px(70);
import {
  toDate
} from '../../library/sdk/util.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //文件数目
    dataList: [],
    //卡券背景色
    eCardBg: "/assets/bg/ECard.png",
    //选择的福利中心经销商
    cmpList: [],
    //福利中心选择
    cmpIndex: 0,
    //选择的公司WXID
    cmpWxid: '',
    //选择公司的名称
    cmpName:"",
    qrcodeWidth: qrcodeWidth,
    //是否打开微信二维码
    qrIsShow: false,
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
    this.getWelfaceList();
  },
  /**
   * 获取名下的福利中心
   */
  getWelfaceList() {
    wx.showLoading({
      title: '加载中',
    })
    wx.$request({
      url: "/WeMinProPlatJson/GetDataSet",
      data: {
        docType: 'WelfareCenter',
        actionType: 'WelfareCenterCmp',
        needTotal: false,
      },
      success: res => {
        this.setData({
          cmpList: res.Table,
          cmpWxid: res.Table[0].WxId,
          cmpName: res.Table[0].CmpName,
        })
      },
      complete: res => {
        wx.hideLoading()
      }
    })
  },
  /**
   * 选择经销商
   */
  bindPickerChange(e) {
    console.log(e)
    let index = e.detail.value;
    let cmp = this.data.cmpList[index];
    this.setData({
      cmpIndex: index,
      cmpWxid: cmp.WxId,
      cmpName: cmp.CmpName,
    })
  },
  /**
   * 生成二维码
   */
  showQr() {
    this.setData({
      qrIsShow: true,
    })
    setTimeout(() => {
      //生成新的二维码
      qrcode = new QRCode('canvas', {
        // usingIn: this,
        text: `${configUrl.peUrl}myUser/welfareCore?wxid=${this.data.cmpWxid}`,
        width: qrcodeWidth,
        height: qrcodeWidth,
        colorDark: "black",
        colorLight: "white",
        correctLevel: QRCode.CorrectLevel.H,
      });
    }, 300)
  },
  /**
   * 点击二维码弹框
   */
  modalClose() {
    this.setData({
      qrIsShow: false
    })
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
        docType: 'WelfareCenter',
        actionType: 'WelfareCenterList',
        needTotal: false,
      },
      success(res) {
        //对数据进行处理
        for (let x of res) {
          x._date = `${toDate(x.StartDate)}至${toDate(x.EndDate)}`
        }
        _this.setData({
          dataList: _this.data.dataList.concat(res)
        })
      },
      complete(res) {
        wx.stopPullDownRefresh();
      }
    });
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
    this.myLlbox.request();
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