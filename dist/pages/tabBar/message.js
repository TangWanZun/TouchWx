import msgBroadcast from '../../library/sdk/msgBroadcast.js'
import {
  CHAT_CONST,
  util,
  configUrl
} from '../../library/sdk.js'
//这个是不需要更新数据的
let data = {
  /**
   * 本地虚拟缓存
   */
  storageData: [],
  /**
   * 获取数据(聊天列表)
   */
  page: {
    start: 0,
    limit: 25
  },
  /**
   * 信息广播接收者
   */
  //个人标识ID
  onMeId: undefined,
  //全部红点数量
  pendCount: 0,
  /**
   * 进行数据合并(数据池与缓存进行合并)
   */
  dataMergeList: [],
}
// component/dialog.js
Component({

  /**
   * 组件的初始数据
   */
  data: {
    dataList: [],
    //图片数据
    imgUrl: getApp().privateData.configUrl.imgUrl,
    //获取聊天常量
    CHAT_CONST: CHAT_CONST,
    //分页功能
    pageOver: false,
    //出现删除标志的index
    delIndex: -1,
  },
  /**
   * 当组件刚刚进入页面结点树的时候
   */
  attached() {
    let app = getApp();
    //查看是否存在data缓存
    if (app.tabBarPageCache.message) {
      this.setData(Object.assign(this.data, app.tabBarPageCache.message))
    } else {
      var _this = this;
      //初始化消息广播
      msgBroadcast.init();
      this.getData(true, function() {
        //运行数据轮询获取
        _this.getMsgList()
      });
      //加载个人信息
      getApp().loadInfo(function() {
        data.onMeId = getApp().privateData.loginInfo.DeptCode;
        //读取缓存信息
        _this.dataGetStorage();
      })
    }
  },
  /**
   * 组件被移除的时候
   */
  detached() {
    let app = getApp();
    app.setTabBarPageCache('message', this.data);
  },
  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 下拉刷新
     */
    onPullDownRefresh() {
      this.getData(true)
    },
    /**
     * 碰底部刷新
     */
    onReachBottom(){
      this.getData();
    },
    /**
     * 页面点击事件
     */
    bodyTap() {
      //当点击任意一个地方的时候，是需要将删除模式取消的
      if (this.data.delIndex != -1) {
        this.setData({
          delIndex: -1
        })
      }
    },
    /**
     * 点击信息
     */
    itemTouchTap(e) {
      //运行事件
      wx.navigateTo({
        url: e.currentTarget.dataset.url
      })
    },

    // ListTouch触摸开始
    ListTouchStart(e) {
      this.setData({
        ListTouchStart: e.touches[0].pageX
      })
    },

    // ListTouch计算方向
    ListTouchMove(e) {
      this.setData({
        ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart < -100 ? 'left' : 'right'
      })
    },

    // ListTouch计算滚动
    ListTouchEnd(e) {
      if (this.data.ListTouchDirection == 'left') {
        this.setData({
          delIndex: e.currentTarget.dataset.index
        })
      } else {
        this.setData({
          delIndex: -1
        })
      }
      this.setData({
        ListTouchDirection: null
      })
    },
    /**
     *删除当前信息
     */
    delItem(e) {
      let index = e.currentTarget.dataset.index;
      // console.log(index);
      this.data.dataList.splice(index, 1)
      this.setData({
        dataList: this.data.dataList,
        //重置删除标记
        delIndex: -1
      })
      //更新虚拟缓存
      data.storageData = this.data.dataList;
      //更新真实缓存
      this.dataSetStorage()
    },

    /**
     *  更新红点 
     */
    refreshBadge() {
      //将当前全部的红点数据传递出去
      this.triggerEvent('badgeChange', data.pendCount);
      //当未读消息大于0为消息的右上角添加未读消息数量
      // if (data.pendCount > 0) {
      //   wx.setTabBarBadge({
      //     index: 0,
      //     text: `${data.pendCount}`
      //   })
      // }
    },
    getData(dataReset = false, callback) {
      //消息红点为0的消息列表
      var PendCountList = [];
      //数据重置
      if (dataReset) {
        //红点清空
        data.pendCount = 0;
        let meDataList = this.data.dataList;
        //获取当前信息红点为0的信息
        for (let i = 0; i < meDataList.length; i++) {
          if (meDataList[i].PendCount == 0) {
            PendCountList.push(meDataList[i]);
          }
        }
        //如果当前存在为红点为0的数据,则将这些数据添加到列表的前面
        this.setData({
          pageOver: false,
          dataList: PendCountList,
        })
        data.page.start = 0;
      }
      //数据全部加载后阻止
      if (this.data.pageOver) {
        return;
      }
      let _this = this;

      wx.$request({
        url: "/WeMinProChatMessage/GetNeedReplyList",
        data: {
          start: data.page.start,
          limit: data.page.limit,
        },
        success(res) {
          if (res.length < data.page.limit) {
            //数据以全部拉取完成
            _this.setData({
              pageOver: true
            })
          }
          /**
           * 这里需要整理数据
           */
          let meData = res;
          for (let i = 0; i < meData.length; i++) {
            //转化时间为小程序时间
            meData[i].MsgDate = util.dateParse(meData[i].MsgDate);
            //计算全部未读消息数量
            //只有在登录的用户才会计入红点中
            if (meData[i].Online) {
              data.pendCount += meData[i].PendCount;
            } else {
              meData[i].Online = 0;
            }
          }
          //当未读消息大于0为消息的右上角添加未读消息数量
          _this.refreshBadge()
          //数据更新但不更新视图 用来解决页面更新抖动问题
          _this.data.dataList = _this.data.dataList.concat(res)
          // _this.setData({
          //     dataList: _this.data.dataList
          // })
          // 与数据池中进行合并
          _this.dataMerge()
          data.page.start += data.page.limit;
          //启动轮询获取数据
          callback && callback();
        },
        complete() {
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
      wx.$msgBroadcast.add('message', function(msgList) {
        //获取本地带回消息列表
        let dataDataList = _this.data.dataList;
        //遍历返回的消息池
        var forList = msgList;
        //将最新的数据赋值到待回复的消息列表中
        for (let i = 0; i < forList.length; i++) {
          let item = forList[i];
          var index = util.find(dataDataList, "OpenId", item.OpenId)
          //只有当获取数据的时间大于当前消息列表(获取的时间是最新的时候)上的时间的时候，才将消息赋值上去
          if (index >= 0 && util.dateTo(item.CreateDate) > util.dateTo(dataDataList[index].CreateDate)) {
            //判断如果当前信息是客服发送
            if (item.FromType === CHAT_CONST.CHAT_RIGHT) {
              //减去消息右上角相应的数量
              data.pendCount -= dataDataList[index].PendCount;
              //为客服消息则去掉红点
              dataDataList[index].PendCount = 0;
            } else {
              //客户信息添加一个红点
              dataDataList[index].PendCount++;
              //加上消息右上角相应的数量
              data.pendCount++;
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
            _this.upDateMessage([item.OpenId]);
          }
          //数据更新 
          // _this.data.dataList = dataDataList;
          _this.setData({
            dataList: dataDataList
          })
          //将数据缓存
          _this.dataSetStorage();
        }
      })
    },
    /**
     * 将信息列表缓存到物理硬盘上
     */
    dataSetStorage() {
      let privateData = getApp().privateData;
      wx.setStorage({
        key: `${privateData.loginInfo.CmpCode}-${privateData.loginInfo.DeptCode}-msgList`,
        data: this.data.dataList,
      })
      //并将数据暂时更新到变量中,用于之后的与数据池合并
      //因为，为了保证性能,从物理硬盘中读取数据只是在启动的时候，加载一次
      //接下来就会用storageData替代
      data.storageData = this.data.dataList
    },
    /**
     * 读取存储的信息列表
     */
    dataGetStorage() {
      var _this = this;
      let privateData = getApp().privateData;
      wx.getStorage({
        key: `${privateData.loginInfo.CmpCode}-${privateData.loginInfo.DeptCode}-msgList`,
        success: function(res) {
          let data = res.data;
          data.storageData = data
          // 与数据池中进行合并
          _this.dataMerge()
        },
        //无论因为什么原因读取失败都将忽略
        fail(res) {
          console.log(res)
          //当没有数据的时候，也将走错误，但是这个时候也是需要数据合并的
          _this.dataMerge();
        }
      })
    },
    dataMerge() {
      //这里 因为  获取 缓存信息  与  获取实际数据池信息 都是异步的 ，所以必须保证两个
      // 数据 都完成的时候才可以进行下面的计算
      data.dataMergeList.push(true);
      //这里表示只有这个函数被调用了至少两次的时候才会生效
      if (data.dataMergeList.length < 2) return
      //实际操作
      let dataList = this.data.dataList;
      let storageData = data.storageData;
      //合并数据池
      let list = dataList;
      //表示需要更新的消息
      let upDateList = [];
      //循环读取数据池函数
      for (let item of storageData) {
        let index = util.find(dataList, "OpenId", item.OpenId);
        if (index >= 0) {
          //当数据池中存在的OpendId的也在缓存中存在时,以数据池为主
          // list.push(dataList[index]);
        } else {
          //当数据池中不存在这个消息但是缓存中这个消息存在的时候，这个时候需要注意一件事情
          //就是如果这个消息有红点 说明 这个消息需要更新一下了，因为在数据池中不存在的消息
          //就一定不会存在红点的
          if (item.PendCount) {
            //将这个需要更新数据的openid提取出来
            upDateList.push(item.OpenId)
          }
          list.push(item);
        }
      }
      //当全部循环结束的时候，我们要对需要更新的数据进行重新获取数据
      if (upDateList.length > 0) this.upDateMessage(upDateList)
      // console.log('dataList', dataList)
      // console.log('storageData', storageData)
      data.storageData = storageData;
      this.setData({
        dataList: list
      })
    },
    /**
     * 获取消息的最新数据
     */
    upDateMessage(opendIdList) {
      let _this = this;
      wx.$request({
        url: "/WeMinProChatMessage/GetNewNeedReplyList",
        headerType: 'application/json',
        data: {
          bean: opendIdList
        },
        success(res) {
          //获取本地带回消息列表
          let dataDataList = _this.data.dataList;
          // console.log(res);
          //转化时间
          for (let i = 0; i < res.length; i++) {
            let item = res[i];
            //转化时间
            item.MsgDate = util.dateParse(item.MsgDate);
            //成功则判断当前信息数据中是否存在消息列表中，
            let index = util.find(dataDataList, "OpenId", item.OpenId);
            if (index >= 0) {
              //存在的话更新列表
              //更新红点个数
              //只有在登录的用户才会计入红点中
              if (item.Online) {
                data.pendCount = item.PendCount - dataDataList[index].PendCount;
              } else {
                item.PendCount = 0;
              }
              dataDataList[index] = item;
            } else {
              //不存在的话直接添加到信息列表中
              //更新红点个数
              //只有在登录的用户才会计入红点中
              if (item.Online) {
                data.pendCount += item.PendCount;
              } else {
                item.PendCount = 0;
              }
              dataDataList.push(item)
            }
          }
          //更新红点
          // _this.refreshBadge();
          // dataDataList = dataDataList.concat(res);
          //数据更新 
          // _this.data.dataList = dataDataList;
          _this.setData({
            dataList: dataDataList
          })
          //将数据缓存
          _this.dataSetStorage();
        }
      })
    },
  }
})




// Page({
//     /**
//      * 页面的初始数据
//      */
//     data: {
//         UX_CONST: wx.$UX,
//         dataList: [],
//         //图片数据
//         imgUrl: getApp().privateData.configUrl.imgUrl,
//         //获取聊天常量
//         CHAT_CONST: CHAT_CONST,
//         //分页功能
//         pageOver: false,
//         //出现删除标志的index
//         delIndex: -1,
//     },
//     /**
//      * 本地虚拟缓存
//      */
//     storageData: [],
//     /**
//      * 页面点击事件
//      */
//     bodyTap() {
//         //当点击任意一个地方的时候，是需要将删除模式取消的
//         if (this.data.delIndex != -1) {
//             this.setData({
//                 delIndex: -1
//             })
//         }
//     },
//     /**
//      * 长按事件属性
//      */
//     //当前是否触发了长按
//     itemLong: false,
//     //时间数，用于中断时间
//     itemTime: [],
//     /**
//      * 点击信息
//      */
//     itemTouchTap(e) {
//         //运行事件
//         wx.navigateTo({
//             url: e.currentTarget.dataset.url
//         })
//     },

//     // ListTouch触摸开始
//     ListTouchStart(e) {
//         this.setData({
//             ListTouchStart: e.touches[0].pageX
//         })
//     },

//     // ListTouch计算方向
//     ListTouchMove(e) {
//         this.setData({
//             ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart < -100 ? 'left' : 'right'
//         })
//     },

//     // ListTouch计算滚动
//     ListTouchEnd(e) {
//         if (this.data.ListTouchDirection == 'left') {
//             this.setData({
//                 delIndex: e.currentTarget.dataset.index
//             })
//         } else {
//             this.setData({
//                 delIndex: -1
//             })
//         }
//         this.setData({
//             ListTouchDirection: null
//         })
//     },
//     /**
//      *删除当前信息
//      */
//     delItem(e) {
//         let index = e.currentTarget.dataset.index;
//         // console.log(index);
//         this.data.dataList.splice(index, 1)
//         this.setData({
//             dataList: this.data.dataList,
//             //重置删除标记
//             delIndex: -1
//         })
//         //更新虚拟缓存
//         this.storageData = this.data.dataList;
//         //更新真实缓存
//         this.dataSetStorage()
//     },
//     /**
//      * 获取数据(聊天列表)
//      */
//     page: {
//         start: 0,
//         limit: 25
//     },
//     /**
//      *  更新红点 
//      */
//     refreshBadge() {
//         //当未读消息大于0为消息的右上角添加未读消息数量
//         if (this.pendCount > 0) {
//             wx.setTabBarBadge({
//                 index: 0,
//                 text: `${this.pendCount}`
//             })
//         }
//     },
//     /**
//      * 信息广播接收者
//      */
//     //个人标识ID
//     onMeId: undefined,
//     //全部红点数量
//     pendCount: 0,
//     getData(dataReset = false, callback) {
//         //消息红点为0的消息列表
//         var PendCountList = [];
//         //数据重置
//         if (dataReset) {
//             //红点清空
//             this.pendCount = 0;
//             let meDataList = this.data.dataList;
//             //获取当前信息红点为0的信息
//             for (let i = 0; i < meDataList.length; i++) {
//                 if (meDataList[i].PendCount == 0) {
//                     PendCountList.push(meDataList[i]);
//                 }
//             }
//             //如果当前存在为红点为0的数据,则将这些数据添加到列表的前面
//             this.setData({
//                 pageOver: false,
//                 dataList: PendCountList,
//             })
//             this.page.start = 0;
//         }
//         //数据全部加载后阻止
//         if (this.data.pageOver) {
//             return;
//         }
//         let _this = this;

//         wx.$request({
//             url: "/WeMinProChatMessage/GetNeedReplyList",
//             data: {
//                 start: this.page.start,
//                 limit: this.page.limit,
//             },
//             success(res) {
//                 if (res.length < _this.page.limit) {
//                     //数据以全部拉取完成
//                     _this.setData({
//                         pageOver: true
//                     })
//                 }
//                 /**
//                  * 这里需要整理数据
//                  */
//                 let meData = res;
//                 for (let i = 0; i < meData.length; i++) {
//                     //转化时间为小程序时间
//                     meData[i].MsgDate = util.dateParse(meData[i].MsgDate);
//                     //计算全部未读消息数量
//                     //只有在登录的用户才会计入红点中
//                     if (meData[i].Online) {
//                         _this.pendCount += meData[i].PendCount;
//                     }else{
//                         meData[i].Online = 0;
//                     }
//                 }
//                 //当未读消息大于0为消息的右上角添加未读消息数量
//                 _this.refreshBadge()
//                 //数据更新但不更新视图 用来解决页面更新抖动问题
//                 _this.data.dataList = _this.data.dataList.concat(res)
//                 // _this.setData({
//                 //     dataList: _this.data.dataList
//                 // })
//                 // 与数据池中进行合并
//                 _this.dataMerge()
//                 _this.page.start += _this.page.limit;
//                 //启动轮询获取数据
//                 callback && callback();
//             },
//             complete() {
//                 wx.stopPullDownRefresh();
//             }
//         })
//     },
//     /**
//      * 获取数据
//      */
//     // isDestroy: false,
//     getMsgList() {
//         var _this = this;
//         wx.$msgBroadcast.add('message', function(msgList) {
//             //获取本地带回消息列表
//             let dataDataList = _this.data.dataList;
//             //遍历返回的消息池
//             var forList = msgList;
//             //将最新的数据赋值到待回复的消息列表中
//             for (let i = 0; i < forList.length; i++) {
//                 let item = forList[i];
//                 var index = util.find(dataDataList, "OpenId", item.OpenId)
//                 //只有当获取数据的时间大于当前消息列表(获取的时间是最新的时候)上的时间的时候，才将消息赋值上去
//                 if (index >= 0 && util.dateTo(item.CreateDate) > util.dateTo(dataDataList[index].CreateDate)) {
//                     //判断如果当前信息是客服发送
//                     if (item.FromType === CHAT_CONST.CHAT_RIGHT) {
//                         //减去消息右上角相应的数量
//                         _this.pendCount -= dataDataList[index].PendCount;
//                         //为客服消息则去掉红点
//                         dataDataList[index].PendCount = 0;
//                     } else {
//                         //客户信息添加一个红点
//                         dataDataList[index].PendCount++;
//                         //加上消息右上角相应的数量
//                         _this.pendCount++;
//                         //更新消息红点
//                         _this.refreshBadge()
//                     }
//                     //如果最新消息池中与本地带回消息列表中存在同一个用户,则将直接赋值到用户上
//                     dataDataList[index].MsgDate = util.dateParse(item.MsgDate);
//                     dataDataList[index].MsgType = item.MsgType;
//                     dataDataList[index].MsgData = item.MsgData;
//                 } else {
//                     //如果本地待会消息中没有最新消息池中的数据,则需要调用获取客户消息方法获取客户头像等,然后添加入本地带回消息中
//                     // GetNewNeedReplyList需要接受一个参数是openid
//                     _this.upDateMessage([item.OpenId]);
//                 }
//                 //数据更新 
//                 // _this.data.dataList = dataDataList;
//                 _this.setData({
//                     dataList: dataDataList
//                 })
//                 //将数据缓存
//                 _this.dataSetStorage();
//             }
//         })
//     },
//     /**
//      * 生命周期函数--监听页面加载
//      */
//     onLoad: function(options) {
//         let app = getApp();
//         //查看是否存在data缓存
//         if (app.tabBarPageCache.message) {
//             this.setData(Object.assign(this.data, app.tabBarPageCache.message))
//         } else {
//             var _this = this;
//             //初始化消息广播
//             msgBroadcast.init();
//             this.getData(true, function() {
//                 //运行数据轮询获取
//                 _this.getMsgList()
//             });
//             //加载个人信息
//             getApp().loadInfo(function() {
//                 _this.onMeId = getApp().privateData.loginInfo.DeptCode;
//                 //读取缓存信息
//                 _this.dataGetStorage();
//             })
//         }
//     },
//     /**
//      * 将信息列表缓存到物理硬盘上
//      */
//     dataSetStorage() {
//         let privateData = getApp().privateData;
//         wx.setStorage({
//             key: `${privateData.loginInfo.CmpCode}-${privateData.loginInfo.DeptCode}-msgList`,
//             data: this.data.dataList,
//         })
//         //并将数据暂时更新到变量中,用于之后的与数据池合并
//         //因为，为了保证性能,从物理硬盘中读取数据只是在启动的时候，加载一次
//         //接下来就会用storageData替代
//         this.storageData = this.data.dataList
//     },
//     /**
//      * 读取存储的信息列表
//      */
//     dataGetStorage() {
//         var _this = this;
//         let privateData = getApp().privateData;
//         wx.getStorage({
//             key: `${privateData.loginInfo.CmpCode}-${privateData.loginInfo.DeptCode}-msgList`,
//             success: function(res) {
//                 let data = res.data;
//                 _this.storageData = data
//                 // 与数据池中进行合并
//                 _this.dataMerge()
//             },
//             //无论因为什么原因读取失败都将忽略
//             fail(res) {
//                 console.log(res)
//                 //当没有数据的时候，也将走错误，但是这个时候也是需要数据合并的
//                 _this.dataMerge();
//             }
//         })
//     },
//     /**
//      * 进行数据合并(数据池与缓存进行合并)
//      */

//     dataMergeList: [],
//     dataMerge() {
//         //这里 因为  获取 缓存信息  与  获取实际数据池信息 都是异步的 ，所以必须保证两个
//         // 数据 都完成的时候才可以进行下面的计算
//         this.dataMergeList.push(true);
//         //这里表示只有这个函数被调用了至少两次的时候才会生效
//         if (this.dataMergeList.length < 2) return
//         //实际操作
//         let dataList = this.data.dataList;
//         let storageData = this.storageData;
//         //合并数据池
//         let list = dataList;
//         //表示需要更新的消息
//         let upDateList = [];
//         //循环读取数据池函数
//         for (let item of storageData) {
//             let index = util.find(dataList, "OpenId", item.OpenId);
//             if (index >= 0) {
//                 //当数据池中存在的OpendId的也在缓存中存在时,以数据池为主
//                 // list.push(dataList[index]);
//             } else {
//                 //当数据池中不存在这个消息但是缓存中这个消息存在的时候，这个时候需要注意一件事情
//                 //就是如果这个消息有红点 说明 这个消息需要更新一下了，因为在数据池中不存在的消息
//                 //就一定不会存在红点的
//                 if (item.PendCount) {
//                     //将这个需要更新数据的openid提取出来
//                     upDateList.push(item.OpenId)
//                 }
//                 list.push(item);
//             }
//         }
//         //当全部循环结束的时候，我们要对需要更新的数据进行重新获取数据
//         if (upDateList.length>0)this.upDateMessage(upDateList)
//         // console.log('dataList', dataList)
//         // console.log('storageData', storageData)
//         this.storageData = storageData;
//         this.setData({
//             dataList: list
//         })
//     },
//     /**
//      * 获取消息的最新数据
//      */
//     upDateMessage(opendIdList) {
//         let _this = this;
//         wx.$request({
//             url: "/WeMinProChatMessage/GetNewNeedReplyList",
//             headerType:'application/json',
//             data: {
//                 bean: opendIdList
//             },
//             success(res) {
//                 //获取本地带回消息列表
//                 let dataDataList = _this.data.dataList;
//                 // console.log(res);
//                 //转化时间
//                 for (let i = 0; i < res.length; i++) {
//                     let item = res[i];
//                     //转化时间
//                     item.MsgDate = util.dateParse(item.MsgDate);
//                     //成功则判断当前信息数据中是否存在消息列表中，
//                     let index = util.find(dataDataList, "OpenId", item.OpenId);
//                     if (index>=0){
//                         //存在的话更新列表
//                         //更新红点个数
//                         //只有在登录的用户才会计入红点中
//                         if (item.Online) {
//                             _this.pendCount = item.PendCount - dataDataList[index].PendCount;
//                         }else{
//                             item.PendCount = 0;
//                         }
//                         dataDataList[index] = item;
//                     }else{
//                         //不存在的话直接添加到信息列表中
//                         //更新红点个数
//                         //只有在登录的用户才会计入红点中
//                         if (item.Online) {
//                             _this.pendCount += item.PendCount;
//                         }else{
//                             item.PendCount = 0;
//                         }
//                         dataDataList.push(item)
//                     }
//                 }
//                 //更新红点
//                 // _this.refreshBadge();
//                 // dataDataList = dataDataList.concat(res);
//                 //数据更新 
//                 // _this.data.dataList = dataDataList;
//                 _this.setData({
//                     dataList: dataDataList
//                 })
//                 //将数据缓存
//                 _this.dataSetStorage();
//             }
//         })
//     },
//     /**
//      * 生命周期函数--监听页面初次渲染完成
//      */
//     onReady: function() {

//     },

//     /**
//      * 生命周期函数--监听页面显示
//      */
//     onShow: function () {
//         // this.getData();
//         //更新消息红点
//         this.refreshBadge();
//         //初始化消息广播
//         msgBroadcast.init();
//     },

//     /**
//      * 生命周期函数--监听页面隐藏
//      */
//     onHide: function() {},

//     /**
//      * 生命周期函数--监听页面卸载
//      */
//     onUnload: function() {
//         let app = getApp();
//         app.setTabBarPageCache('message', this.data);
//     },

//     /**
//      * 页面相关事件处理函数--监听用户下拉动作
//      */
//     onPullDownRefresh: function() {
//         console.log('下拉');
//         this.getData(true)
//     },

//     /**
//      * 页面上拉触底事件的处理函数
//      */
//     onReachBottom: function() {
//         console.log('触底');
//         this.getData()
//     },

//     /**
//      * 用户点击右上角分享
//      */
//     onShareAppMessage: function() {

//     },
// })