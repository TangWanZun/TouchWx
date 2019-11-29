// pages/work/workActivity/signUp.js
import WebSocket from "../../../library/sdk/websocket.js"
import {
  configUrl
} from '../../../library/sdk/config.js'
import {
  dateParse,
  find
} from "../../../library/sdk/util.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fromData: {},
    dataList: [],
    dataListLength: 0,
    //图片地址
    imgUrl: configUrl.imgUrl,
  },
  id: "",
  search: "",
  //websocket
  ws:undefined,
  /**
   *点击搜索 
   */
  bindsearch(e) {
    this.search = e.detail.value;
    this.getData();
  },
  /**
   * 打电话
   */
  playPhone(e) {
    console.log(e);
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let app = getApp();
    this.id = options.id
    this.getData();
    app.loadInfo(() => {
      this.ws = new WebSocket(configUrl.webSocket, {
        success:()=>{
          //发送登录信息
          this.ws.sendObj("LoginIn", {
            Token: app.privateData.Token.split("=")[1],
            WxId: configUrl.wxid
          });
        }
      });
      this.ws.registerReceiver("AcitvityCheckIn", (res) => {
        //对数据进行处理一下
        res.Headimgurl = res.ProfilePhoto;
        let index = find(this.data.dataList, "Id", res.Id);
        if (index < 0) {
          this.setData({
            dataList: [].concat(this.setDataList([res]), this.data.dataList),
            dataListLength: this.data.dataListLength+1
          })
        }
      })
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
    if(this.ws){
      this.ws.close();
    }
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
   * 对数据进行处理
   */
  setDataList(list) {
    for (let item of list) {
      item._date = dateParse(item.CreateDate)
    }
    return list
  },
  /**
   * 获取数据
   */
  getData() {
    wx.showLoading({
      title: '加载中',
    })
    wx.$request({
      url: "/WeMinProPlatJson/GetDataSet",
      data: {
        docType: 'Activity',
        actionType: 'GetActivitySignInList',
        docid: this.id,
        query: this.search
      },
      success: res => {
        if (!this.data.dataListLength) {
          this.setData({
            dataListLength: res.Table1.length,
          })
        }
        this.setData({
          fromData: res.Table[0],
          dataList: this.setDataList(res.Table1)
        })
      },
      complete() {
        wx.hideLoading();
        wx.stopPullDownRefresh();
      }
    })
  }
})