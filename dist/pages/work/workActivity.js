// import createPage from './work.js'
// import { util, WORK_TYPE } from '../../library/sdk.js'
// Page(createPage({
//   $WORK_TYPE: WORK_TYPE.WORK_HD+'List',
//   //修改获取的数据
//   $alterData: function (res) {
//     res.forEach(function (item) {
//       item.CreateDate = util.dateParse(item.CreateDate);
//       item.check = false;
//     })
//     return res;
//   }
// }))
import {
  util,
  configUrl
} from '../../library/sdk.js'
// pages/work/workRescue.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    dataList: [],
    //全选是否被选中状态
    checkAll: false,
    //是否显示回复框
    dialogSelect: false,
    //分页功能
    pageOver: false,
    //图片地址
    imgUrl: configUrl.imgUrl,
  },
  /**
   * 当前的搜索文字
   */
  query: "",
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
    this.getData()
  },
  /**
   * 搜索的时候
   */
  bindsearch(e) {
    // console.log(e);
    this.query = e.detail.value;
    this.getData();
  },
  /**
   * 点击签到信息
   */
  bindSignIn(e) {
    wx.navigateTo({
      url: `/pages/work/workActivity/signIn?id=${e.currentTarget.dataset.id}`,
    })
  },
  /**
   * 点击报名信息
   */
  bindSignUp(e) {
    wx.navigateTo({
      url: `/pages/work/workActivity/signUp?id=${e.currentTarget.dataset.id}`,
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
    // this.getData(true)
    this.getData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    // this.getData();
    this.myLlbox.request();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  /**
   * 数据获取
   */
  /**
   * 获取数据
   */
  getData() {
    //首先清空数据
    this.setData({
      dataList: []
    })
    var _this = this;
    //获取活动列表
    this.myLlbox.init({
      url: "/WeMinProPlatJson/GetList",
      data: {
        docType: 'Activity',
        actionType: 'GetActivityList',
        query: this.query
      },
      success(res) {
        // console.log(res);
        let newDate = util.dateTo(res[0].CurrentDate);
        //对数据进行处理
        for (let item of res) {
          let startDate = util.dateTo(item.StartDate);
          let endDate = util.dateTo(item.EndDate);
          if (newDate < startDate) {
            //尚未开始
            item._state = 'A01'
          } else
          if (newDate >= startDate && newDate < endDate) {
            //正在进行中
            item._state = 'A02'
          } else {
            // 已经结束
            item._state = 'A03'
          }
        }
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