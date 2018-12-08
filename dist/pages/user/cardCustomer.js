// pages/user/cardCustomer.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfor:{
      //会员编号
      CardCode: { value: 0, list:['636784838059785119','636784838059785200']},
      //会员名称
      CardName:"顾里",
      //车牌号
      CarNum:"鲁A12345",
      //VIN
      VIN:"LE4FTM8K88L020841",
      //业务类型
      DocType: { value: -1, list: [{ key: 'A01', value: '售后' }, { key: 'A02', value: '保险' }, { key: 'A03', value: '其他' }] },
    }
  },
  /**
 * 双向绑定事件回调
 */
  inputCall(e) {
    let selectDomKey = e.target.dataset.key;
    this.setData({
      [selectDomKey]: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.id)
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

  }
})