// pages/user/test.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    textContent:"",
    inpuValue:""
  },
  ws:{},
  /**
   * input
   */
  input(e){
    this.setData({
      inpuValue: e.detail.value
    })
  },
  /**
   * 启动连接
   */
  start(){
    this.sf("连接启动中...")
    this.ws =  wx.connectSocket({
      url: 'wss://vip.sap-unis.com/rocar2/websocket',
      success:()=>{
        this.sf("连接成功");
      }
    })
    this.ws.onMessage((data)=>{
      this.sf('接受数据：'+data);
    })
  },
  /**
   * 发送连接
   */
  send(){
    this.ws.send({
      data: this.data.inpuValue,
      success:()=>{
        this.sf("发送数据：" + this.data.inpuValue)
      }
    })
  },
  /**
   * 赋值
   */
  sf(val){
    this.setData({
      textContent: this.data.textContent+val+" \n"
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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