import msgBroadcast from '../../library/sdk/msgBroadcast.js'
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
  /**
   *  更新红点 
  */
  refreshBadge(){
    //当未读消息大于0为消息的右上角添加未读消息数量
    if (this.pendCount > 0) {
      wx.setTabBarBadge({
        index: 0,
        text: `${this.pendCount}`
      })
    }
  },
  /**
   * 信息广播接收者
  */
  //个人标识ID
  onMeId:undefined,
  //全部红点数量
  pendCount:0,
  getData(dataReset = false,callback) {
    //消息红点为0的消息列表
    var PendCountList = [];
    //数据重置
    if (dataReset) {
      //红点清空
      this.pendCount = 0;
      let meDataList = this.data.dataList;
      //获取当前信息红点为0的信息
      for (let i = 0; i < meDataList.length;i++){
        if (meDataList[i].PendCount==0){
          PendCountList.push(meDataList[i]);
        }
      }
      //如果当前存在为红点为0的数据,则将这些数据添加到列表的前面
      this.setData({
        dataList: PendCountList,
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
        for (let i = 0; i < meData.length;i++){
          //转化时间为小程序时间
          meData[i].MsgDate = util.dateParse(meData[i].MsgDate);
          //计算全部未读消息数量
          _this.pendCount += meData[i].PendCount;
        }
        //当未读消息大于0为消息的右上角添加未读消息数量
        _this.refreshBadge()
        _this.setData({
          dataList: _this.data.dataList.concat(res.data)
        })
        _this.page.start += _this.page.limit;
        //启动轮询获取数据
        callback && callback();
      },
      complete(){
        wx.stopPullDownRefresh();
      }
    })
  },
  /**
   * 获取数据
  */
  // isDestroy: false,
  getMsgList() {
    var _this = this;
    wx.$msgBroadcast.add('message',function(msgList){
      //获取本地带回消息列表
      let dataDataList = _this.data.dataList;
      //遍历返回的消息池
      var forList = msgList;
      //将最新的数据赋值到待回复的消息列表中
      for (let i = 0; i < forList.length; i++) {
        let item = forList[i];
        var index = util.find(dataDataList, "OpenId", item.OpenId)
        if (index > 0) {
          //判断如果当前信息是否为本机发送
          if (item.CreateDept === _this.onMeId){
            //减去消息右上角相应的数量
            _this.pendCount -= dataDataList[index].PendCount;
            //为本机消息则去掉红点
            dataDataList[index].PendCount = 0;
          }else{
            //非本机信息添加一个红点
            dataDataList[index].PendCount++;
            //加上消息右上角相应的数量
            _this.pendCount++;
            //更新消息红点
            _this.refreshBadge()
          }
          //如果最新消息池中与本地带回消息列表中存在同一个用户,则将直接赋值到用户上
          dataDataList[index].MsgDate = util.dateParse(item.MsgDate);
          dataDataList[index].MsgType = item.MsgType;
          dataDataList[index].MsgData = item.MsgData;
        } else {
          //如果本地待会消息中没有最新消息池中的数据,则需要调用获取客户消息方法获取客户头像等,然后添加入本地带回消息中
          // GetNewNeedReplyList需要接受一个参数是openid
          wx.$request({
            url:"/WeMinProChatMessage/GetNewNeedReplyList",
            data:{
              bean: item.OpenId
            },
            success(res){
              //转化时间
              for(let i = 0 ;i<res.Data.length;i++){
                //转化时间
                res.Data[i].MsgDate = util.dateParse(res.Data[i].MsgDate);
                //更新红点个数
                _this.pendCount += res.Data[i].PendCount;
              }
              //更新红点
              _this.refreshBadge();
              //成功则将返回的信息添加一个新的本地带回消息
              dataDataList = dataDataList.concat(res.Data);
              //数据更新
              _this.setData({
                dataList: dataDataList
              })
            }
          })
        }
        //数据更新
        _this.setData({
          dataList: dataDataList
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    //初始化消息广播
    msgBroadcast.init();
    this.getData(true,function(){
      //运行数据轮询获取
      _this.getMsgList()
    });
    //加载个人信息
    getApp().loadInfo(function () {
      _this.onMeId = getApp().privateData.loginInfo.DeptCode
    })
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
    //更新消息红点
    this.refreshBadge()
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
})