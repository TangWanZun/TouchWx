// pages/message/chat.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //输入框中是否存在内容
    inputCon:false,
    //语音按钮
    voiceBtn:{
      CONST_I:{
        HINT_OUT: "按住说话",
        HINT_IN: "左滑取消发送",
        HINT_DEL: "松开取消发送",
      },
      //语音功能是否被打开
      functionUnfoldShow:false,
      //按钮是否被按下
      btnStart: false,
      //手指是否位于删除位置
      isDelete:false,
      hint:"按住说话",
    },
    //音频播放
    audio:{
      isPlay:false,
      playMsgId:0,
    },
    //获取聊天类型
    CHAT_TYPE:{
      CHAT_TEXT: 'text',//文本消息
      CHAT_IAMGE: 'image',//图片消息
      CHAT_ADDS: 'location',//位置消息
      CHAT_VOICE: 'voice',//音频消息
      CHAT_VIDEO: 'video',//视频信息
      CHAT_LEFT: 'Client',//客户
      CHAT_RIGHT:'Server',//客服
    },
    chatData:[

    ]
  },
  /**========================================
   *  页面样式控制函数
   * ========================================
  */
  /**
   * 输入框输入内容是
  */
  bindInput:function(e){
    // 改变发送按钮颜色
    this.setData({
      inputCon: e.detail.value.length > 0
    })
  },
  /**
   * 语音功能开关 
  */
  voiceInShow:function(){
    this.setData({
      'voiceBtn.functionUnfoldShow': !this.data.voiceBtn.functionUnfoldShow
    })
  },
  /**========================================
   * 页面聊天事件
   * ========================================
  */
  /**
   * 打开地图查看位置
  */
  openLocationFun(e){
    var data = e.currentTarget.dataset;
    console.log(e);
    wx.openLocation({
      latitude: data.latitude,
      longitude: data.longitude,
      name: data.name,
      address: data.address
    })
  },
  /**
   * 播放音频
  */
  playAudio(e){
    //获取需要播放的msgid
    var id = e.currentTarget.dataset.msgid;
    //音频图片闪动
    this.setData({
      'audio.playMsgId': id
    })
    // const innerAudioContext = wx.createInnerAudioContext()
    // innerAudioContext.autoplay = true
    // innerAudioContext.src = 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46'
    // innerAudioContext.onPlay(() => {
    //   console.log('开始播放')
    // })
    // innerAudioContext.onError((res) => {
    //   console.log(res.errMsg)
    //   console.log(res.errCode)
    // })
  },
  /**
   * 打开相册
  */
  chooseImageFun(){
    wx.chooseImage({
      success(res){
        console.log(tempFilePaths);
      }
    })
  },
  /**
   * 选择位置
  */
  chooseLocationFun(){
    wx.chooseLocation({
      success(res){
        console.log('成功', res)
      },
      fail(res){
        //判断此接口是否授权
        wx.getSetting({
          success(res){
            if (!res.authSetting['scope.userLocation']){
              //未授权
              wx.showModal({
                title:'位置信息需要授权',
                content:'是否前往授权',
                showCancel:true,
                cancelText:'取消',
                confirmText:'前往授权',
                success(res) {
                  if (res.confirm) {
                    wx.openSetting();
                    console.log(1)
                  } 
                }
              })
            }
          }
        })
      }
    })
  },
  /**
   * 开始点击语音按钮
  */
  voiceTouchstart: function () {
    //改变状态为按钮被按下
    //改变提示语句
    this.setData({
      'voiceBtn.btnStart': true,
      'voiceBtn.hint': this.data.voiceBtn.CONST_I.HINT_IN
    })
  },
  /**
   * 点击移动时
  */
  voiceTouchmove: function (e) {
    let voiceConfig = this.data.voiceBtn;
    let pageX = e.touches[0].pageX;
    if (pageX <= 100 && !voiceConfig.isDelete) {
      //当pageX(x轴)小于100默认为移动到了删除位置
      //判断如果当不是删除高亮时，才运行下面代码
      //改变提示语句
      //删除位置高亮
      this.setData({
        'voiceBtn.hint': voiceConfig.CONST_I.HINT_DEL,
        'voiceBtn.isDelete': true,
      })
    } else
      //否则依旧为发送位置
      //判断如果当前是高亮的时候才会运行下面代码
      if (pageX > 100 && voiceConfig.isDelete) {
        //改变提示语句
        //解除高亮
        this.setData({
          'voiceBtn.hint': voiceConfig.CONST_I.HINT_IN,
          'voiceBtn.isDelete': false,
        })
      }
  },
  /**
   * 结束点击语音按钮
  */
  voiceTouchend: function () {
    //改变状态为按钮被松开
    //改变提示语句
    this.setData({
      'voiceBtn.btnStart': false,
      'voiceBtn.hint': this.data.voiceBtn.CONST_I.HINT_OUT,
      //删除按钮取消高亮
      'voiceBtn.isDelete': false,
    })
  },
  /**========================================
   * app事件函数
   * ========================================
  */
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //加载模拟数据
    this.modelData();
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
  modelData(){
    this.setData({
      chatData:[
        {//默认客户图片
          MsgId: 1,
          AddressDetails: null,															//地理位置详情
          AddressName: null,																//地理位置名称
          CardName: "典韦",																 //真实姓名
          Duration: null,																	  //语音持续时间
          FromType: "Client",																//聊天人身份
          Latitude: null,																	//地理位置的维度
          Longitude: null	,																//地理位置的精度
          MediaOriginal: null,																//图片初始图
          MsgData: "https://www.sap-unis.com/wxapp/#/news/index?wxid=gh_40c534b93a9f",		//聊天内容
          MsgDate: "2018-10-12 12:45:54.000",												//时间					
          MsgType: "text",																	//类型
          NickName: "兔子只吃胡萝卜",														//微信名称
          OpenId: "oS4HgskVQqtMvZ9IbB2d-k4GhcRA",											//openid
          ProfilePhoto: "",																//头像
          Rown: 7,																		//此消息位次
          Thumbnail: null,																	//缩略图
          UserCode: null,																	//客服code
          UserName: null,																	//客服name
          WxId: "gh_40c534b93a9f"
        },
        {//默认客服图片
          MsgId: 2,
          AddressDetails: null,															//地理位置详情
          AddressName: null,																//地理位置名称
          CardName: null,																 //真实姓名
          Duration: null,																	  //语音持续时间
          FromType: "Server",																//聊天人身份
          Latitude: null,																	//地理位置的维度
          Longitude: null,																//地理位置的精度
          MediaOriginal: null,																//图片初始图
          MsgData: "请问需要什么帮助",		//聊天内容
          MsgDate: "2018-10-12 12:45:54.000",												//时间					
          MsgType: "text",																	//类型
          NickName: null,														//微信名称
          OpenId: "oS4HgskVQqtMvZ9IbB2d-k4GhcRA",											//openid
          ProfilePhoto: "",																//头像
          Rown: 7,																		//此消息位次
          Thumbnail: null,																	//缩略图
          UserCode: null,																	//客服code
          UserName: '系统管理员',																	//客服name
          WxId: "gh_40c534b93a9f"
        },
        {
          MsgId: 3,
          AddressDetails: null,															//地理位置详情
          AddressName: null,																//地理位置名称
          CardName: "典韦",																 //真实姓名
          Duration: null,																	  //语音持续时间
          FromType: "Client",																//聊天人身份
          Latitude: null,																	//地理位置的维度
          Longitude: null,																//地理位置的精度
          MediaOriginal: null,																//图片初始图
          MsgData: "https://www.sap-unis.com/wxapp/#/news/index?wxid=gh_40c534b93a9f",		//聊天内容
          MsgDate: "2018-10-12 12:45:54.000",												//时间					
          MsgType: "image",																	//类型
          NickName: "兔子只吃胡萝卜",														//微信名称
          OpenId: "oS4HgskVQqtMvZ9IbB2d-k4GhcRA",											//openid
          ProfilePhoto: "http://imgz.ermiao.com/2010/09/6992022-fr.jpg",																//头像
          Rown: 7,																		//此消息位次
          Thumbnail: 'http://img15.3lian.com/2015/f2/160/d/65.jpg',																	//缩略图
          UserCode: null,																	//客服code
          UserName: null,																	//客服name
          WxId: "gh_40c534b93a9f"
        },
        {
          MsgId: 4,
          AddressDetails: null,															//地理位置详情
          AddressName: null,																//地理位置名称
          CardName: null,																 //真实姓名
          Duration: null,																	  //语音持续时间
          FromType: "Server",																//聊天人身份
          Latitude: null,																	//地理位置的维度
          Longitude: null,																//地理位置的精度
          MediaOriginal: null,																//图片初始图
          MsgData: "请问需要什么帮助",		//聊天内容
          MsgDate: "2018-10-12 12:45:54.000",												//时间					
          MsgType: "image",																	//类型
          NickName: null,														//微信名称
          OpenId: "oS4HgskVQqtMvZ9IbB2d-k4GhcRA",											//openid
          ProfilePhoto: "https://img.52z.com/upload/news/image/20171213/20171213124121_25664.jpg",																//头像
          Rown: 7,																		//此消息位次
          Thumbnail: 'http://www.imagewa.com/PhotoPreview/229/229_18760.jpg',																	//缩略图
          UserCode: null,																	//客服code
          UserName: '系统管理员',																	//客服name
          WxId: "gh_40c534b93a9f"
        },
        //地理位置
        {
          MsgId: 5,
          AddressDetails: '北京市东城区体育馆路街道天安门广场',	//地理位置详情
          AddressName: '天安门广场',																//地理位置名称
          CardName: "典韦",																 //真实姓名
          Duration: null,																	  //语音持续时间
          FromType: "Client",																//聊天人身份
          Latitude: 39.9037118881, 															//地理位置的维度
          Longitude: 116.3978290558,																//地理位置的精度
          MediaOriginal: null,																//图片初始图
          MsgData: "https://www.sap-unis.com/wxapp/#/news/index?wxid=gh_40c534b93a9f",		//聊天内容
          MsgDate: "2018-10-12 12:45:54.000",												//时间					
          MsgType: "location",																	//类型
          NickName: "兔子只吃胡萝卜",														//微信名称
          OpenId: "oS4HgskVQqtMvZ9IbB2d-k4GhcRA",											//openid
          ProfilePhoto: "http://imgz.ermiao.com/2010/09/6992022-fr.jpg",																//头像
          Rown: 7,																		//此消息位次
          Thumbnail: 'http://img15.3lian.com/2015/f2/160/d/65.jpg',																	//缩略图
          UserCode: null,																	//客服code
          UserName: null,																	//客服name
          WxId: "gh_40c534b93a9f"
        },
        {
          MsgId:6,
          AddressDetails: '山东省济南市槐荫区淄博路与聊城路交叉口西北角济南西城实验初级中学',	//地理位置详情
          AddressName: '西城实验初级中学',																//地理位置名称
          CardName: null,																 //真实姓名
          Duration: null,																	  //语音持续时间
          FromType: "Server",																//聊天人身份
          Latitude: 36.6848711670,																//地理位置的维度
          Longitude: 116.9150018692,																//地理位置的精度
          MediaOriginal: null,																//图片初始图
          MsgData: "请问需要什么帮助",		//聊天内容
          MsgDate: "2018-10-12 12:45:54.000",												//时间					
          MsgType: "location",																	//类型
          NickName: null,														//微信名称
          OpenId: "oS4HgskVQqtMvZ9IbB2d-k4GhcRA",											//openid
          ProfilePhoto: "https://img.52z.com/upload/news/image/20171213/20171213124121_25664.jpg",																//头像
          Rown: 7,																		//此消息位次
          Thumbnail: 'http://www.imagewa.com/PhotoPreview/229/229_18760.jpg',																	//缩略图
          UserCode: null,																	//客服code
          UserName: '系统管理员',																	//客服name
          WxId: "gh_40c534b93a9f"
        },
        {
          MsgId: 7,
          AddressDetails: null,	//地理位置详情
          AddressName:null,																//地理位置名称
          CardName: "典韦",																 //真实姓名
          Duration: 5,																	  //语音持续时间
          FromType: "Client",																//聊天人身份
          Latitude: 36, 																	//地理位置的维度
          Longitude: 116,															//地理位置的精度
          MediaOriginal: null,																//图片初始图
          MsgData: "https://www.sap-unis.com/wxapp/#/news/index?wxid=gh_40c534b93a9f",		//聊天内容
          MsgDate: "2018-10-12 12:45:54.000",												//时间					
          MsgType: "voice",																	//类型
          NickName: "兔子只吃胡萝卜",														//微信名称
          OpenId: "oS4HgskVQqtMvZ9IbB2d-k4GhcRA",											//openid
          ProfilePhoto: "http://imgz.ermiao.com/2010/09/6992022-fr.jpg",																//头像
          Rown: 7,																		//此消息位次
          Thumbnail: 'http://img15.3lian.com/2015/f2/160/d/65.jpg',																	//缩略图
          UserCode: null,																	//客服code
          UserName: null,																	//客服name
          WxId: "gh_40c534b93a9f"
        },
        {
          MsgId: 8,
          AddressDetails: null,	                    //地理位置详情
          AddressName: null,																//地理位置名称
          CardName: null,																 //真实姓名
          Duration: 13,																	  //语音持续时间
          FromType: "Server",																//聊天人身份
          Latitude: null,																	//地理位置的维度
          Longitude: null,																//地理位置的精度
          MediaOriginal: null,	amr:11,															//图片初始图
          MsgData: "请问需要什么帮助",		//聊天内容
          MsgDate: "2018-10-12 12:45:54.000",												//时间					
          MsgType: "voice",																	//类型
          NickName: null,														//微信名称
          OpenId: "oS4HgskVQqtMvZ9IbB2d-k4GhcRA",											//openid
          ProfilePhoto: "https://img.52z.com/upload/news/image/20171213/20171213124121_25664.jpg",																//头像
          Rown: 7,																		//此消息位次
          Thumbnail: 'http://www.imagewa.com/PhotoPreview/229/229_18760.jpg',		mp3:11	,														//缩略图
          UserCode: null,																	//客服code
          UserName: '系统管理员',																	//客服name
          WxId: "gh_40c534b93a9f"
        },
      ]
    })
  }
})