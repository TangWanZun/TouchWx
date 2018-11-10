import { CHAT_CONST, util } from '../../library/sdk.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    dataList:[],
    //图片数据
    imgUrl: getApp().privateData.configUrl.imgUrl,
    //获取聊天常量
    CHAT_CONST: CHAT_CONST,
    //分页功能
    pageOver: false
  },
  /**
   * 获取数据(聊天列表)
  */
  page: {
    start: 0,
    limit: 25
  },
  getData(dataReset = false) {
    //数据重置
    if (dataReset) {
      this.setData({
        dataList: [],
        pageOver: false
      })
      this.page.start = 0;
    }
    //数据全部加载后阻止
    if (this.data.pageOver) {
      return;
    }
    let _this = this;
    wx.$request({
      url: "/WeMinProChatMessage/GetNeedReplyList",
      data: {
        start: this.page.start,
        limit: this.page.limit,
      },
      success(res) {
        if (res.data.length < _this.page.limit) {
          //数据以全部拉取完成
          _this.setData({
            pageOver: true
          })
        }
        /**
         * 这里需要整理数据
        */
        let meData = res.data;
        let newDate = new Date();
        for (let i = 0; i < meData.length;i++){
          let date = new Date(meData[i].CreateDate);
          if (newDate.toDateString() === date.toDateString()){
            //表示为今天
            meData[i].CreateDate = `${date.getHours()}:${date.getMinutes()}`;
          }else{
            //不为今天
            meData[i].CreateDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
          }
        }
        _this.setData({
          dataList: _this.data.dataList.concat(res.data)
        })
        _this.page.start += _this.page.limit;
        //启动轮询获取数据
        if (dataReset){
          _this.getMsgList()
        }
      },
      complete(){
        wx.stopPullDownRefresh();
      }
    })
  },
  /**
   * 轮询获取数据
  */
  isDestroy: false,
  getMsgList() {
    var _this = this;
    var createDate;
    function fun() {
      //状态被销毁
      if (_this.isDestroy) {
        return;
      }
      wx.$request({
        url: "/WeMinProChatMessage/GetLastMsg",
        data: {
          Date: createDate,
        },
        success(res) {
          console.log(res);
        },
        fail(res) {
          console.log(res);
        },
        complete(res) {
          //当存在返回值的时候,说明有信息池中存在数据
          if (res.Data) {
            //更新时间
            createDate = res.Data.CreateDate;
            //获取本地带回消息列表
            let dataDataList = _this.data.dataList;
            //遍历返回的消息池
            var forList = res.Data.List;
            //将最新的数据赋值到待回复的消息列表中
            for(let i = 0;i<forList.length;i++){
              let item = forList[i];
              var index = util.find(dataDataList, "OpenId", item.OpenId)
              if(index>0){
                //如果最新消息池中与本地带回消息列表中存在同一个用户,则将直接赋值到用户上
                dataDataList[index].MsgDate = item.MsgDate;
                dataDataList[index].MsgType = item.MsgType;
                dataDataList[index].MsgData = item.MsgData;
                dataDataList[index].PendCount++;
              }else{
                //如果本地待会消息中没有最新消息池中的数据,则需要调用获取客户消息方法获取客户头像等,然后添加入本地带回消息中
                //GetNewNeedReplyList需要接受一个参数是openid
                wx.$request({
                  url:"/WeiXinChatMessage/GetNewNeedReplyList",
                  data:{
                    bean: item.OpenId
                  },
                  success(res){
                    //成功则将返回的信息添加一个新的本地带回消息
                    dataDataList = dataDataList.concat(res.Data)
                  }
                })
              }
              //数据更新
              _this.setData({
                dataList: dataDataList
              })
            }
          }
          //轮询运行
          fun()
        }
      })
    }
    fun();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData(true);
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
    // this.getData();
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
    console.log(1);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getData(true)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getData()
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