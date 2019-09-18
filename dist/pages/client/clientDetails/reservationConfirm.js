import {
  RESERVE_TYPE,
  RESERVE_ASS_TYPE,
  RESERVE_ZS,
  RESERVE_WX,
  RESERVE_BY
} from "../../../library/sdk/config.js"
import {
  toTime,
  toDate
} from "../../../library/sdk/util.js"
let RESERVE_ITEM = Object.assign({}, RESERVE_ZS, RESERVE_WX, RESERVE_BY);
// pages/client/clientDetails/ceservationConfirm.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    RESERVE_TYPE,
    RESERVE_ASS_TYPE,
    RESERVE_ITEM,
    formList: [],
    openId: ""
  },
  /**
   * 加载组件
   */
  myLlbox: {},
  //用户的openId
  openId: "",
  /**
   * 确认到店
   */
  confirmComeShop(e) {
    let id = e.currentTarget.dataset.id;
    let _this = this;
    wx.showModal({
      title: '提示',
      content: '是否确认用户到店',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '数据提交中',
          })
          wx.$request({
            url: "/WeMinProPlatJson/Submit",
            data: {
              docType: 'Ocrd',
              actionType: 'WeiXinReserveSubmit',
              docId: id,
            },
            success(res) {
              setTimeout(()=>{
                wx.showToast({
                  title: '确认成功',
                })
              },300)
            },
            complete(){
              _this.getData();
              wx.hideLoading();
            }
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.openId = options.openId;
    this.setData({
      openId: options.openId
    })
    //获取自定义组件
    this.myLlbox = this.selectComponent('#myLlbox');
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
  getData() {
    //首先清空数据
    this.setData({
      formList: []
    })
    //获取储值历史
    this.myLlbox.init({
      url: "/WeMinProPlatJson/GetList",
      data: {
        docType: 'Ocrd',
        actionType: 'DealWeiXinReserve',
        docId: this.openId,
        needTotal: false,
      },
      success: res => {
        for (let item of res) {
          //添加预约时间
          item._date = `${toDate(item.ReserveDate)} ${toTime(item.ReserveStartTime)} - ${toTime(item.ReserveEndTime)}`;
        }
        this.setData({
          formList: this.data.formList.concat(res)
        })
      },
      complete(res) {
        wx.stopPullDownRefresh();
      }
    });
  },
})