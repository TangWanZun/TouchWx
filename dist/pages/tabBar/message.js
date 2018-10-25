Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.modelData()
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
   * 模拟数据
  */
  modelData:function(){
    this.setData({
      dataList:[
        {
          id: 1,
          clientName: "陈宫",
          clientImg: "http://pic.qqtn.com/up/2017-11/15115072217014845.jpg",
          message: "我是一条消息",
          date: "下午4:00",
          badge: 1
        },
        {
          id: 2,
          clientName: "典韦",
          clientImg: "http://imgz.ermiao.com/2010/09/6992022-fr.jpg",
          message: "啤酒节怎么报名啊",
          date: "下午1:00",
          badge: 0
        },
        {
          id: 3,
          clientName: "小乔",
          clientImg: "http://imgtu.5011.net/uploads/content/20170420/1469701492668162.jpg",
          message: "你们服务态度差劲不说，我新车的配件居然还少了一个，这个事情怎么说",
          date: "上午8:35",
          badge: 13
        },
        {
          id: 4,
          clientName: "袁绍",
          clientImg: "http://up.qqjia.com/z/26/tu32813_1.jpg",
          message: "汽车保养可以便宜点不",
          date: "上午10:27",
          badge:2
        },
        {
          id: 4,
          clientName: "曹操",
          clientImg: "https://tse4.mm.bing.net/th?id=OIP.ylVp5b20v4LTsB7ZJWtI2wAAAA&pid=Api",
          message: "快来救我啊，我的车坏掉了啊",
          date: "上午9:12",
          badge:0
        },
        {
          id: 6,
          clientName: "夏侯惇",
          clientImg: "http://img.jf258.com/uploads/2013-07-07/194913270.jpg",
          message: "明天上午的预定暂时去不了了",
          date: "上午11:15",
          badge: 0
        }
      ]
    })
  }
})