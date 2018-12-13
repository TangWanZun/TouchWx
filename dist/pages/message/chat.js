import { CHAT_CONST, util} from '../../library/sdk.js'

// pages/message/chat.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    inputCon: {
      //输入框中是否存在内容
      isValue: false,
      //用于清空input内容
      value: ""
    },
    //图片数据
    imgUrl: getApp().privateData.configUrl.imgUrl,
    //语音按钮
    voiceBtn: {
      CONST_I: {
        HINT_OUT: "按住说话",
        HINT_IN: "左滑取消发送",
        HINT_DEL: "松开取消发送",
      },
      //语音功能是否被打开
      functionUnfoldShow: false,
      //按钮是否被按下
      btnStart: false,
      //手指是否位于删除位置
      isDelete: false,
      hint: "按住说话",
    },
    //音频播放
    audio: {
      isPlay: false,
      playMsgId: -1,
    },
    //获取聊天常量
    CHAT_CONST: CHAT_CONST,
    //用于滚动到页面底部的
    intoView: "",
    //登陆数据
    loginInfo:{},
    dataList: [

    ],
    //当前视频播放路径
    videoUrl:''
  },
  /**========================================
   * 全局变量非setData型
   * ========================================
  */
  openId:null,
  wxId: null,
  headImg:null,
  cardName:null,
  //消息队列
  // messageQueue:[],
  /**========================================
   *  页面样式控制函数
   * ========================================
  */
  /**
   * 语音功能开关 
  */
  voiceInShow: function () {
    var bool = this.data.voiceBtn.functionUnfoldShow
    //滚动到页面底部
    //因为滚动速度快于语音展开，所以延时调用
    setTimeout(() => {
      !bool ? this.toBottom() : "";
    }, 300);
    this.setData({
      'voiceBtn.functionUnfoldShow': !bool
    })
  },
  /**========================================
   * 发送事件
   * ========================================
  */
  /**
   * 文本信息发送
  */
  sendText() {
    if (this.inputValue.length > 0) {
      this.chatSend({
        msgType: this.data.CHAT_CONST.CHAT_TEXT,
        data: this.inputValue
      });
    }
    //清除input内容 发送键复原
    this.setData({
      'inputCon.value': '',
      'inputCon.isValue': false,
    })
    this.inputValue = "";
  },
  /**
   * 语音发送
  */
  sendRecord(res) {
    this.chatSend({
      msgType: this.data.CHAT_CONST.CHAT_VOICE,
      duration: Math.round(res.duration / 1000),
      thumbnail: res.tempFilePath
    });
  },
  /**
   * 地理位置发送
  */
  sendLocation(res) {
    this.chatSend({
      msgType: this.data.CHAT_CONST.CHAT_ADDS,
      addressName: res.name,
      addressDetails: res.address,
      latitude: res.latitude,
      longitude: res.longitude,
    });
  },
  /**
   * 图片发送
  */
  sendImage(res) {
    console.log(res);
    let forDom = res.tempFilePaths;
    for (let i = 0; i < forDom.length; i++) {
      this.chatSend({
        msgType: this.data.CHAT_CONST.CHAT_IAMGE,
        thumbnail: forDom[i],
        mediaOriginal: forDom[i],
      });
    }
  },
  /*
  * 发送信息(包括语音图片等)
  */
  chatSend(pro) {
    //基本信息
    var msg = {
      MsgId: util.GUID(),
      AddressDetails: pro.addressDetails || '',															//地理位置详情
      AddressName: pro.addressName || '',							//地理位置名称
      CardName: '',																 //真实姓名
      Duration: pro.duration || '',																	  //语音持续时间
      FromType: this.data.CHAT_CONST.CHAT_RIGHT,					//聊天人身份
      Latitude: pro.latitude || '',																	//地理位置的维度
      Longitude: pro.longitude || '',																//地理位置的精度
      MediaOriginal: pro.mediaOriginal || '',																//图片初始图
      MsgData: pro.data || '',		                          //聊天内容
      MsgDate: pro.msgDate || util.jsToDateTime(new Date()),												//时间					
      MsgType: pro.msgType,																	//类型
      NickName: "",														//微信名称
      OpenId: this.openId,											//openid
      ProfilePhoto: this.data.loginInfo.ProfilePhoto,																//头像
      Thumbnail: pro.thumbnail || '',																	//缩略图
      UserCode: this.data.loginInfo.UserCode,																	//客服code
      UserName: this.data.loginInfo.UserName,																	//客服name
      WxId: this.wxId
    }
    var data = this.getMsgData(msg, this.data.CHAT_CONST.LOG_IN);
    //加载到本地
    this.data.dataList.push(data);
    var _this = this;
    //发送数据
    wx.$request({
      url:"/WeMinProChatMessage/SendMsg",
      data: msg,
    })
    this.setData({
      dataList: this.data.dataList
    });
    //滚动到页面底部
    this.toBottom();
  },
  /**========================================
   * 页面聊天事件所需被调用函数
   * ========================================
  */
  /**
   * 滚动到页面底部
  */
  toBottom() {
    this.setData({
      intoView: this.data.dataList.length - 1
    })
  },
  /*
  *文本输入框内容
  */
  inputValue: "",
  /**
   * 输入框输入内容
  */
  bindInput: function (e) {
    // 改变发送按钮颜色
    this.setData({
      'inputCon.isValue': e.detail.value.length > 0,
    })
    //拿去文件数据
    this.inputValue = e.detail.value;
  },
  /**
   * 音乐停止
   * 当音乐正常关闭,或者页面发生跳转音乐强行关闭许运行的函数
  */
  audioStop() {
    var audio = this.createAudio();
    audio.isPlay = false;
    //将播放ID设置为-1 取消闪动
    this.setData({
      'audio.playMsgId': -1
    })
  },
  //录音单例
  record: undefined,
  /**
   * 录音事件单例模式
  */
  createRecord() {
    if (this.record) {
      return this.record;
    } else {
      this.record = wx.getRecorderManager()
      //开始录音时
      this.record.onStart(() => {
        console.log('录音开始')
      })
      //录音停止时
      this.record.onStop((res) => {
        console.log('录音停止', res);
      })
      //录音出现错误
      this.record.onError((res) => {
        if (this.record.isError) {
          return;
        }
        console.log("录音错误", res);
        var _record = this.record;
        _record.isError = true;
        //处理未授权
        wx.getSetting({
          success(res) {
            if (!res.authSetting['scope.record']) {
              //未授权
              wx.showModal({
                title: '使用录音需要授权',
                content: '是否前往授权',
                showCancel: true,
                cancelText: '取消',
                confirmText: '前往授权',
                success(res) {
                  if (res.confirm) {
                    wx.openSetting();
                  }
                },
                complete(res) {
                  _record.isError = false;
                }
              })
            }
          }
        })
      })
      this.record.options = {
        duration: 10000,
        sampleRate: 44100,
        numberOfChannels: 1,
        encodeBitRate: 192000,
        format: 'mp3',
        frameSize: 50
      }
      return this.record;
    }
  },
  //音频单例
  audio: undefined,
  /**
   * 音频事件单例模式
  */
  createAudio() {
    if (this.audio) {
      //取消开始音乐播放监听
      this.audio.offPlay();
      return this.audio
    } else {
      this.audio = wx.createInnerAudioContext();
      this.audio.isPlay = false;
      //音频播放出现错误
      this.audio.onError((res) => {
        console.log(res.errMsg)
        console.log(res.errCode);
        //停止闪动
        this.audioStop();
      })
      //音乐停止事件
      this.audio.onStop((res) => {
        console.log('播放停止');
        this.audioStop()
      })
      //音频自然播放至停止
      this.audio.onEnded((res) => {
        console.log('播放结束');
        this.audioStop()
      })
      //音频因为数据不足，需要停下来加载时会触发
      this.audio.onWaiting((res) => {
        console.log('数据不足');
      })
      return this.audio;
    }
  },
  /**========================================
   * 页面聊天事件
   * ========================================
  */
  /**
   * 查看大图
  */
  showBigImage(e) {
    wx.previewImage({
      urls: [e.currentTarget.dataset.src]
    })
  },
  /**
   * 播放视频
   */
  playVideo(e){
    //获取播放路径
    var src = e.currentTarget.dataset.src;
    wx.navigateTo({
      url: "./video?videoUrl=" + src
    })
    // //设置播放路径
    // this.setData({
    //   videoUrl: src
    // });
    // let meVideo = wx.createVideoContext('meVideo',this);
    // //全屏观看 竖着观看
    // meVideo.requestFullScreen({
    //   direction:0
    // });
    // // //播放视频
    // // meVideo.play();
  },
  /**
   * 视频播放器进入全屏与退出全屏
   */
  fullscreenchange(e){
    let meVideo = wx.createVideoContext('meVideo', this);
    meVideo.pause();
  },
  /**
   * 播放音频
  */
  playAudio(e) {
    //获取需要播放的msgid
    var id = e.currentTarget.dataset.msgid;
    //获取播放路径
    var src = e.currentTarget.dataset.src;
    var audio = this.createAudio();
    //当前为播放音频状态时且点击的为同一ID时，音频暂停
    if (audio.isPlay && id === this.data.audio.playMsgId) {
      audio.stop();
    } else {
      audio.src = src;
      audio.play();
    }
    audio.onPlay(() => {
      console.log('播放开始');
      this.audio.isPlay = true;
      //音频图片闪动
      this.setData({
        'audio.playMsgId': id
      })
    })
  },
  /**
   * 打开地图查看位置
  */
  openLocationFun(e) {
    var data = e.currentTarget.dataset;
    wx.openLocation({
      latitude: data.latitude*1,
      longitude: data.longitude*1,
      name: data.name,
      address: data.address
    })
  },
  /**
   * 打开相册
  */
  chooseImageFun() {
    var _this = this;
    wx.chooseImage({
      success(res) {
        _this.sendImage(res);
      }
    })
  },
  /**
   * 选择位置
  */
  chooseLocationFun() {
    var _this = this;
    wx.chooseLocation({
      success(res) {
        _this.sendLocation(res);
      },
      fail(res) {
        //判断此接口是否授权
        wx.getSetting({
          success(res) {
            if (!res.authSetting['scope.userLocation']) {
              //未授权
              wx.showModal({
                title: '位置信息需要授权',
                content: '是否前往授权',
                showCancel: true,
                cancelText: '取消',
                confirmText: '前往授权',
                success(res) {
                  if (res.confirm) {
                    wx.openSetting();
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
   * 点击运行时间
  */
  TOUCH_TIME:0,
  /**
   * 开始点击语音按钮
  */
  voiceTouchstart: function () {
    var _this = this;
    //按键超过350毫秒才运行下面代码
    this.TOUCH_TIME = setTimeout(function(){
      //改变状态为按钮被按下
      var record = _this.createRecord();
      record.start(record.options);
      //改变提示语句
      _this.setData({
        'voiceBtn.btnStart': true,
        'voiceBtn.hint': _this.data.voiceBtn.CONST_I.HINT_IN
      })
    },350);
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
    //当前点击时间低于350毫秒时,取消按钮开始事件
    clearTimeout(this.TOUCH_TIME);
    //停止语音录制
    var record = this.createRecord();
    //判断语音是在被什么状态下结束
    if (this.data.voiceBtn.isDelete) {
      //取消语音
      console.log('取消语音');
      record.onStop((res) => { })
    } else {
      //发送语音
      console.log('发送语音');
      record.onStop((res) => {
        console.log(res);
        //判断如果语音时间小于500毫秒则显示录音时间太短
        if (res.duration<=500){
          wx.showToast({
            icon:"none",
            title:"按键时间太短"
          });
          return;
        }
        //调用语音发送
        this.sendRecord(res)
      })
    }
    record.stop();
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
   * app底层函数
   * ========================================
  */
  /**
   *时间生成器,会根据两个时间间隔，来决定是否需要生成一个时间标签
  */
  dataGenerate(aTime, bTime){
    //需要返回的时间
    let dataString = "";
    //获取当前时间
    let newDate = new Date();
    //首先判断如果aTIme是否为null
    if (aTime){
      let aNTime = util.dateTo(aTime).getTime();
      let bNTime = util.dateTo(bTime).getTime();
      //当两者时间间隔超过10分钟时,获取时间
      if (bNTime - aNTime > 600000) {
        dataString = util.dateParse(bTime);
      }
    }else{
      //为null的时候必定为返回一个时间,为bTime的时间
      dataString = util.dateParse(bTime);
    }
    if (dataString){
      return {
        //信息类型
        dataType: CHAT_CONST.DATE,
        date: dataString
      }
    }else{
      return false
    }
    // console.log(util.dateTo(aTime), util.dateTo(bTime));
  },
  /**
   * 根据传进的内容生成聊天所需内容
  */
  getMsgData(msg,state){
    var CHAT_CONST = this.data.CHAT_CONST;
    //获取是不是客户
    var isLeft = msg.FromType === CHAT_CONST.CHAT_LEFT;
    //获取显示名称
    var name = isLeft ? this.cardName: msg.UserName ;
    //获取显示头像
    var headImg = isLeft ? (this.headImg ? this.data.imgUrl + this.headImg : '/assets/chat/kh_tx.svg') : (msg.ProfilePhoto ? this.data.imgUrl + msg.ProfilePhoto:'/assets/chat/kf_tx.svg');
    //获取存放数据内容
    var msgData;
    switch (msg.MsgType){
      //文字
      case CHAT_CONST.CHAT_TEXT:{
        msgData = msg.MsgData
        break;
      }
      //图片
      case CHAT_CONST.CHAT_IAMGE:{
        msgData = {
          //缩略图
          thumbnail: this.data.imgUrl+msg.Thumbnail,
          //初始图
          mediaOriginal: this.data.imgUrl+msg.MediaOriginal
        }
        break;
      }
      //位置消息
      case CHAT_CONST.CHAT_ADDS: {
        msgData = {
          //地理详细位置
          addressDetails: msg.AddressDetails,
          //地理名称
          addressName: msg.AddressName,
          //经度
          longitude: msg.Longitude,
          //纬度
          latitude: msg.Latitude,
        }
        break;
      }
      //音频消息
      case CHAT_CONST.CHAT_VOICE: {
        msgData = {
          //音频持续时间
          time: msg.Duration,
          //音频路径mp3
          src: this.data.imgUrl+ msg.Thumbnail,
        }
        break;
      }
      //视频消息
      case CHAT_CONST.CHAT_VIDEO:{
        msgData = {
          //视频路径mp4格式
          src: this.data.imgUrl + msg.MediaOriginal,
          cover: this.data.imgUrl + msg.Thumbnail,
        }
        break;
      }
    }
    //整理信息
    return {
      //信息类型
      dataType: CHAT_CONST.CHAT,
      //msgId
      msgId: msg.MsgId,
      //是不是为左侧
      isLeft,
      //头像
      headImg,
      //时间
      msgDate:msg.MsgDate,
      //名称
      name,
      //类型
      msgType: msg.MsgType,
      //数据内容
      msgData,
      //当前状态
      state: state || CHAT_CONST.LOG_OUT
    }
  },
  /**
   * 轮询获取数据
  */
  getMsgList(){
    var _this = this;
    wx.$msgBroadcast.add('chat', function (msgList) {
      //获取的返回的消息
      var forList = msgList;
      //setData上的dataList
      let dataDataList = _this.data.dataList;
      for (let i = 0; i < forList.length; i++) {
        let item = forList[i];
        let msgId = item.MsgId;
        //msgId重复
        let index = util.find(dataDataList, "msgId", item.MsgId);
        if (index >= 0) {
          //来自于客户
          if (forList[i].FromType == CHAT_CONST.CHAT_LEFT) {
            //重复信息去掉
            continue;
          } else {
            //来自于客服
            //更新信息
            if (item.MsgStatus=='Fail') {//判断这条消息发送是否成功
              //失败
              dataDataList[index].state = CHAT_CONST.LOG_FAIL;
            } else {
              //成功
              dataDataList[index].state = CHAT_CONST.LOG_OUT;
            }
          }
        } else {
          //msgId不重复
          if (forList[i].FromType == CHAT_CONST.CHAT_LEFT && _this.openId !== item.OpenId) {
            //非当前用户
            continue;
          }
          //添加当前状态
          let state = _this.data.CHAT_CONST.LOG_OUT;
          //当为fail为消息为失败
          if (item.MsgStatus == 'Fail') { state = _this.data.CHAT_CONST.LOG_FAIL}
          //添加并到消息列表
          dataDataList = dataDataList.concat(_this.getMsgData(item, state))
        }
        //判断当前传入的信息时间与列表中上个信息时间,有时间控制器来决定是否需要插入一个时间
        let time = _this.dataGenerate(dataDataList.length === 0 ? null : dataDataList[dataDataList.length - 1].msgDate, item.MsgDate);
        if (time) {
          dataDataList.push(time);
        }
        //更新到消息列表
        _this.setData({
          "dataList": dataDataList
        });
      }
      //到底部
      _this.toBottom();
    });
  },
  /**
   * 获取数据
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
      })
      this.page.start = 0;
    }
    let _this = this;
    wx.$request({
      url: "/WeMinProChatMessage/GetChatList",
      data: {
        start: this.page.start,
        limit: this.page.limit,
        OpenId: this.openId
      },
      success(res) {
        if (res.length < _this.page.limit) {
          //数据以全部拉取完成
          _this.setData({
            pageOver: true
          })
        }
        /**
         * 这里需要整理数据
        */
        let meDataList = [];
        let meData = res;
        for (let i = 0; i < meData.length; i++) {
          //由时间生成器5来决定是不是需要生成一个时间
          let time = _this.dataGenerate(i == 0 ? null : meData[i - 1].MsgDate, meData[i].MsgDate);
          //当time存在,表示时间生成器决定生成一个时间,那就需要把这个时间插入的列表中
          if(time){
            meDataList.push(time);
          }
          //将获得数据经过处理生成为所需数据
          meDataList.push(_this.getMsgData(meData[i]));
        }
        /*数据更新*/
        _this.setData({
          dataList: meDataList.concat(_this.data.dataList)
        })
        _this.page.start += _this.page.limit;
      },
      complete() {
        wx.stopPullDownRefresh();
        if (dataReset) {
          //滚动到页面底部
          _this.toBottom();
          //启动消息广播收听者
          _this.getMsgList();
        }
      }
    })
  },
  /**
   *  当页面距离顶部50时触发方法 
  */
  bindscrolltoupper:function(){
    this.getData();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    this.openId = options.openId;
    this.wxId = options.wxId;
    this.headImg = options.headImg == 'null' ? null : options.headImg;
    this.cardName = options.cardName;
    //加载名称
    wx.setNavigationBarTitle({
      title: (options.online=='true'?'':'[离线]')+options.cardName
    })
    //加载数据
    this.getData(true);
    //获取登陆信息
    _this.setData({
      loginInfo: getApp().privateData.loginInfo
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
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.audioStop()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // 删除当前页面消息广播收听者
    wx.$msgBroadcast.remove('chat');
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