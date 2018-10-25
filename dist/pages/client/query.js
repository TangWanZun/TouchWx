// pages/client/query.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList:[
      {
        img: "http://imgz.ermiao.com/2010/09/6992022-fr.jpg",
        name: "典韦"
      },
      {
        img: "https://tse1.mm.bing.net/th?id=OIP.BRoCEgh15frmcQfT0Z0j2AAAAA&pid=Api",
        name: "张飞"
      },
      {
        img: "http://img2.woyaogexing.com/2017/08/07/17a2f2a6de5de111!400x400_big.jpg",
        name: "吕蒙"
      },
      {
        img: "http://imgtu.5011.net/uploads/content/20170428/6956571493368294.jpg",
        name: "孙尚香"
      }
    ],
    selectBodyShow:false
  },
  /**
   * 输入框查询
  */
  queryInput: function (event){
    //这里先做一个假的
    this.setData({
      selectBodyShow: event.detail.value.length > 0
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