// pages/work/workActivity/signUp.js
import {
  dateParse
} from "../../../library/sdk/util.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fromData: {},
    dataList: [],
    dataListLength: 0,
  },
  id: "",
  search: "",
  /**
   *点击搜索 
   */
  bindsearch(e) {
    this.search = e.detail.value;
    this.getData();
  },
  /**
   * 点击单个项目
   */
  bindtapitem(e) {
    wx.navigateTo({
      url: `/pages/work/workPage/activityPage?id=${e.currentTarget.dataset.id}`,
    })
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
    this.id = options.id
    this.getData();
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
    wx.showLoading({
      title: '加载中',
    })
    wx.$request({
      url: "/WeMinProPlatJson/GetDataSet",
      data: {
        docType: 'Activity',
        actionType: 'GetActivitySignUpList',
        docid: this.id,
        query: this.search
      },
      success: res => {
        if (!this.data.dataListLength) {
          this.setData({
            dataListLength: res.Table1.length,
          })
        }
        for (let item of res.Table1) {
          item._date = dateParse(item.CreateDate)
        }
        this.setData({
          fromData: res.Table[0],
          dataList: res.Table1,
        })
      },
      complete() {
        wx.hideLoading();
        wx.stopPullDownRefresh();
      }
    })
  }
})