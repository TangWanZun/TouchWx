// pages/work/workRescue.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [
    ],
    //全选是否被选中状态
    checkAll: false,
    //是否显示回复框
    dialogSelect: false
  },
  /**
   * 非需渲染属性
  */
  //记录当前被选中的check
  checkArray: [],
  /**
   * 查询框信息回调
  */
  bindinput(e) {
    console.log(e.detail.value);
  },
  /**
   * 点击提交按钮
  */
  send() {
    if (this.checkArray.length === 0) {
      wx.showToast({
        title: '请至少选择一条信息',
        icon: 'none'
      })
      return;
    }
    //打开回复框
    this.setData({
      dialogSelect: true
    })
  },
  /**
   * 点击取消按钮
  */
  cancel() {
    if (this.checkArray.length === 0) {
      wx.showToast({
        title: '请至少选择一条信息',
        icon: 'none'
      })
      return;
    }
    wx.showModal({
      title: '',
      content: "确认取消所选信息",
      cancelText: "暂不取消",
      confirmText: "确认取消",
      success(res) {
        if (res.confirm) {
          wx.showToast({
            title: '信息已取消',
          })
        }
      }
    })
  },
  /**
   * 获取多选框点击事件
  */
  checkChange(e) {
    this.checkArray = e.detail.value;
    //当所有多选框被选中的时候,全选需要被选中
    if (e.detail.value.length === this.data.dataList.length) {
      this.setData({
        checkAll: true,
      })
    } else if (this.data.checkAll) {
      //当所有多选框被没有选中的时候,全选不需要被选中
      this.setData({
        checkAll: false,
      })
    }
  },
  /**
   * 全选事件监听
  */
  checkAllChange(e) {
    //当全选被选中的时候
    let bool = e.detail.value.length > 0
    var datalist = this.data.dataList;
    //全部选择框被选中
    //更新checkArray
    if (bool) {
      for (let i = 0; i < datalist.length; i++) {
        this.checkArray[i] = i;
      }
    } else {
      this.checkArray.length = 0;
    }
    for (let i = 0; i < datalist.length; i++) {
      datalist[i].check = bool;
    }
    //同步状态
    this.setData({
      checkAll: bool,
      dataList: datalist
    })
  },
  /**
   * 获取信息回调
  */
  bindconfirm(e) {
    console.log(e.detail.value);
    wx.showToast({
      title: '信息提交',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getModel()
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

  },
  /**
   * 数据模拟
  */
  getModel() {
    this.setData({
      dataList: [
        {
          cardName: "大乔",
          headImg: "http://k2.jsqq.net/uploads/allimg/1711/17_171129092304_1.jpg",
          note: "你好啊胜利大街法律框架阿斯兰的看法进来撒开地方撒地方了卡萨丁卢卡斯大家疯狂拉升代理费氨丁卢卡斯大家疯狂拉升代理费氨丁卢卡斯大家疯狂拉升代理费氨丁卢卡斯大家疯狂拉升代理费氨基酸看到了风景",
          createDate: "2018/12/13",
          activityTitle:"青岛啤酒狂欢节",
          numberP: 3,
          check: false
        },
        {
          cardName: "大乔",
          rescueType: '救援类型',
          headImg: "http://k2.jsqq.net/uploads/allimg/1711/17_171129092304_1.jpg",
          createDate: "2018/12/13",
          note: "利大街法律框架阿斯兰的看法进来撒开地方撒地方了利大街法律框架阿斯兰的看法进来撒开地方撒地方了",
          activityTitle: "千鸟山假日游",
          numberP:2,
          check: false
        },
        {
          cardName: "大乔",
          rescueType: '救援类型',
          headImg: "http://k2.jsqq.net/uploads/allimg/1711/17_171129092304_1.jpg",
          createDate: "2018/12/13",
          note: "利大街法律框架阿斯兰的看法进来撒开地方撒地方了",
          activityTitle: "千鸟山假日游千鸟山假日游千鸟山假日游千鸟山假日游",
          numberP: 1,
          check: false
        },
        {
          cardName: "大乔",
          rescueType: '救援类型',
          headImg: "http://k2.jsqq.net/uploads/allimg/1711/17_171129092304_1.jpg",
          createDate: "2018/12/13",
          activityTitle: "青岛啤酒狂欢节青岛啤酒狂欢节青岛啤酒狂欢节",
          numberP: 5,
          note: "",
          check: false
        }
      ]
    })
  }
})