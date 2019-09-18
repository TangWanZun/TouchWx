// pages/client/clientDetails/addReservation.js
import {
  RESERVE_TYPE,
  RESERVE_ASS_TYPE,
  RESERVE_MAP,
  RESERVE_ZS,
  RESERVE_WX,
  RESERVE_BY
} from "../../../library/sdk/config.js"


Page({

  /**
   * 页面的初始数据
   */
  data: {
    //预约类型
    RESERVE_TYPE_SELECT: [],
    RESERVE_MAP_SELECT: {},
    RESERVE_BY_SELECT: [],
    RESERVE_WX_SELECT: [],
    RESERVE_ZS_SELECT: [],
    //分类的索引
    assTypeIndex: -1,
    //预约项目的索引，
    reserveItemIndex: -1,
    formData: {
      ReserveType: "",
      AssType: "",
      ReserveItem: "",
      Note: "",
    }
  },
  //用户openId
  openId:"",
  /**
   * 选择回调
   */
  inputSelect(e) {
    let value = e.detail.value;
    let key = e.target.dataset.key
    this.setData({
      [key]: value
    })
    if (key == "formData.ReserveType") {
      //表示当预约类型发生变化的时候，分类就应该重置
      this.setData({
        assTypeIndex: -1,
        reserveItemIndex: -1,
        ['formData.ReserveItem']: "",
        ['formData.AssType']: "",
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.openId = options.openId;
    //对预约类型进行修改
    let RESERVE_TYPE_SELECT = [];
    for (let x in RESERVE_TYPE) {
      RESERVE_TYPE_SELECT.push({
        Code: x,
        Name: RESERVE_TYPE[x]
      })
    }
    //对预约分类进行修改
    let RESERVE_MAP_SELECT = {};
    for (let x in RESERVE_MAP) {
      let list = [];
      RESERVE_MAP_SELECT[x] = [];
      for (let item of RESERVE_MAP[x]) {
        RESERVE_MAP_SELECT[x].push({
          Code: item,
          Name: RESERVE_ASS_TYPE[item]
        })
      }
    }
    //对预约项目进行分类
    //保养
    let RESERVE_BY_SELECT = [];
    for (let x in RESERVE_BY) {
      RESERVE_BY_SELECT.push({
        Code: x,
        Name: RESERVE_BY[x]
      })
    }
    //维修
    let RESERVE_WX_SELECT = [];
    for (let x in RESERVE_WX) {
      RESERVE_WX_SELECT.push({
        Code: x,
        Name: RESERVE_WX[x]
      })
    }
    //装饰
    let RESERVE_ZS_SELECT = [];
    for (let x in RESERVE_ZS) {
      RESERVE_ZS_SELECT.push({
        Code: x,
        Name: RESERVE_ZS[x]
      })
    }
    this.setData({
      RESERVE_MAP_SELECT,
      RESERVE_TYPE_SELECT,
      RESERVE_BY_SELECT,
      RESERVE_WX_SELECT,
      RESERVE_ZS_SELECT
    })
  },
  /**
   * 提交信息
   */
  submit() {
    wx.showLoading({
      title: '数据添加中',
    })
    wx.$request({
      url: "/WeMinProPlatJson/Submit",
      data: {
        docType: 'Ocrd',
        actionType: 'OhemWeiXinReserveSubmit',
        docId: this.openId,
        docJson: JSON.stringify({
          WeiXinReserve:this.data.formData
        })
      },
      success(res) {
        setTimeout(()=>{
          wx.showToast({
            title: '修改成功',
          })
          wx.navigateBack();
        },300)
      },
      complete(){
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