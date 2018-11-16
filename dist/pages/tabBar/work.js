import  * as sdk from "../../library/sdk.js"
Page({
  /**
   * 页面的初始数据
   */
  data: {
    workTypeData:[
      {
        title: "救援",
        iconUrl:"/assets/workType/WORK_JY.svg",
        url: "/pages/work/workRescue"
      },
      {
        title: "投诉",
        iconUrl: "/assets/workType/WORK_TS.svg",
        url: "/pages/work/workComplain"
      },
      {
        title: "预约",
        iconUrl: "/assets/workType/WORK_YY.svg", 
        url: "/pages/work/workMake"
      },
      {
        title: "活动",
        iconUrl: "/assets/workType/WORK_HD.svg", 
        url: "/pages/work/workActivity"
      },
      {
        title: "到期",
        iconUrl: "/assets/workType/WORK_DQ.svg", 
        url: "/pages/work/workExpire"
      }
    ],
    workType:{},
    //数据列表
    dataList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      workType: sdk.WORK_TYPE
    })
    //加载模拟数据
    this.messData();
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
  messData:function(){
    this.setData({
      dataList:[
        {
          id: 1,
          workType: "A01",
          clientName: "曹操",
          clientImg: "https://tse4.mm.bing.net/th?id=OIP.ylVp5b20v4LTsB7ZJWtI2wAAAA&pid=Api",
          date: "2018-10-24",
          data: {
            carNum: "京A12345",
            adds: "山东省济南市槐荫区西客站北500米",
          }
        },
        {
          id: 2,
          workType: "A02",
          clientName: "小乔",
          clientImg: "http://imgtu.5011.net/uploads/content/20170420/1469701492668162.jpg",
          date: "2018-10-24",
          data: {
            conText: "服务态度不好,交车时居然缺少了配件,服务态度不好, 交车时居然缺少了配件,服务态度不好, 交车时居然缺少了配件,",
          }
        },
        {
          id: 3,
          workType: "A03",
          clientName: "张春华",
          clientImg: "http://imgtu.5011.net/uploads/content/20170515/1938101494835991.jpg",
          date: "2018-10-24",
          data: {
            carNum: "京A12345",
            time: "8:00-9:00",
            makeType: "维修预约"
          }
        },
        {
          id: 4,
          workType: "A04",
          clientName: "典韦",
          clientImg: "http://imgz.ermiao.com/2010/09/6992022-fr.jpg",
          date: "2018-10-24",
          data: {
            assImg: "https://tse2.mm.bing.net/th?id=OIP.QAR17CqccTLd0dAUQTMiKAHaEv&pid=Api",
            assName: "啤酒狂欢节"
          }
        },
        {
          id: 5,
          workType: "A05",
          clientName: "袁绍",
          clientImg: "http://up.qqjia.com/z/26/tu32813_1.jpg",
          date: "2018-10-24",
          data: {
            conText: "车辆保养还有3天到期"
          }
        },
        {
          id: 6,
          workType: "A03",
          clientName: "夏侯惇",
          clientImg: "http://img.jf258.com/uploads/2013-07-07/194913270.jpg",
          date: "2018-10-24",
          data: {
            carNum: "京A12345",
            time: "10:00-11:00",
            makeType: "维修预约"
          }
        },
        {
          id: 7,
          workType: "A04",
          clientName: "孙尚香",
          clientImg: "http://imgtu.5011.net/uploads/content/20170428/6956571493368294.jpg",
          date: "2018-10-24",
          data: {
            assImg: "https://tse2.mm.bing.net/th?id=OIP.QAR17CqccTLd0dAUQTMiKAHaEv&pid=Api",
            assName: "啤酒狂欢节"
          }
        },
        {
          id: 2,
          workType: "A02",
          clientName: "陈宫",
          clientImg: "http://pic.qqtn.com/up/2017-11/15115072217014845.jpg",
          date: "2018-10-24",
          data: {
            conText: "服务态度不好,交车时居然缺少了配件,服务态度不好, 交车时居然缺少了配件,服务态度不好, 交车时居然缺少了配件,",
          }
        },
      ]
    })
  }
})