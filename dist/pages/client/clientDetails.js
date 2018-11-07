// pages/client/clientDetails.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    clientData:{
      //用户openId
      openId:null,
      //头像
      headImage:"/assets/icon/tx.png",
      //爱好
      likeList: ["高尔夫","文学","自驾游","游泳","爬山"],
      //积分
      integral:35600,
      //储值
      stored:5600,
      //电子券
      coupon:20,
      //联系方式
      contact:[
        { num: '18953895214', conType: 'panel' },
        { num: '99705651', conType: 'QQ' },
        { num: 'sunshangxiang1', conType:'WX'}
      ],
      //服务顾问
      counselor:[
        { img: "http://5b0988e595225.cdn.sohucs.com/images/20171007/92f1ce0072f64e979a3545892f9b05fd.jpeg", name: "王小田", career: "销售顾问", index: "NO.00213" },
        { img: "http://www.hyundai-service.com.cn/uploads/useruser/DSC_0359.jpg", name: "张良", career: "维修顾问", index: "NO.00412" },
        { img:"http://image.bitauto.com/dealer/news/2301039/7cb523f3-7be0-4752-b461-59737f7b2162.jpg", name:"李玉" , career:"售后顾问" , index:"NO.00213"},
      ],
      //绑定汽车
      car:[
        { brand: "bc", model: "奔驰S210 运动型", num: "京A12345" },
        {brand:"bjxd",model:"北京现代H321 商务",num:"京B12345"}
      ],
      //用户画像
      portrayal:[
        { title: "职场类别", value: "金融白领" },
        { title: "消费观念", value: "易接受新鲜事物" },
        { title:"购买力",value:"稳健性"}
      ]
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //测试使用
    wx.setNavigationBarTitle({
      title: options.clientId,
    })
    this.setData({
      "clientData.openId": options.openId
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  /**
   * 拨打电话
  */
  makePhoneCall(e){
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.panel,
    })
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