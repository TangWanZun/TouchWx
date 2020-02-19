import {
  Apps,
  FunApps,
  TABBAR_UX
} from "../library/sdk/UX_CONST.js"
import {
  find
} from "../library/sdk/util.js"
import login from '../library/sdk/login.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //当前选择的项目
    selected: "",
    color: "#bcbcbc",
    selectedColor: "#256cfa",
    //胶囊信息
    appHeader: undefined,
    // 底部栏
    list: TABBAR_UX,
    //业务功能
    appList: undefined,
    //应用功能
    funAppList: undefined,
    //app的抽屉现在是否在出来的状态
    isAppShow: false,
    //当前加载是否已经完成
    loadInfo: false
  },
  /**
   * 获取当前未读信息
   */
  getNoReact() {
    wx.$request({
      url: "/WeMinProChatMessage/GetNeedReplyList",
      data: {
        start: 0,
        limit: 100,
      },
      success: (res) => {
        let count = 0;
        for (let x of res) {
          //当在线的时候才进行统计
          if (x.Online) {
            count += x.PendCount;
          }
        }
        this.setBarBadge('MESSAGE', count);
      }
    })
  },
  /**
   * 为底部栏按钮设置气泡数字
   */
  setBarBadge(key, count) {
    this.setData({
      [`list.${key}.badge`]: count
    })
  },
  /**
   * 表示当信息页面中信息值发生变化的时候 
   */
  messageBadgeChange(e) {
    this.setBarBadge('MESSAGE', e.detail);
  },
  // 页面跳转
  switchTab(e) {
    const data = e.currentTarget.dataset
    const url = data.path
    if (this.data.selected == data.index) {
      //表示为当前页面
      return
    }
    //更改当前页面
    this.setData({
      selected: data.index
    })
  },
  // app抽屉展示
  appShow() {
    if (!this.data.funAppList) {
      //表示还没有获取应用功能
      getApp().loadInfo(() => {
        this.setData({
          funAppList: FunApps
        })
      })
    }
    if (!this.data.appList) {
      //表示还没有获取抽屉列表,这个时候需要获取app权限
      getApp().loadInfo(() => {
        this.setData({
          appList: Apps
        })
      })
    }
    this.setData({
      isAppShow: true
    })
  },
  //关闭app抽屉
  closeApp() {
    this.setData({
      isAppShow: false
    })
  },
  /**
   * 更新首页页面的快捷入口
   */
  indexSetAppList() {
    if (this.data.selected == 'INDEX') {
      this.selectComponent(`#${this.data.selected}`).getApps();
    }
  },
  /**
   * 更新首页指标信息
   */
  indexSetIndexList() {
    if (this.data.selected == 'INDEX') {
      this.selectComponent(`#${this.data.selected}`).getData(true);
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //这里会出现抢线程的问题，比如app的跳转早于这个页面
    let privateData = getApp().privateData;
    if (typeof privateData.loginInfo === 'undefined') {
      //运行
      login.init();
    }
    let app = getApp();
    //更新底部数据
    app.loadInfo(() => {
      let toTabber = options.to;
      //判断是否要跳转到特定页面并且这个页面是否可以展示
      if (toTabber && TABBAR_UX[toTabber]._show) {
        if (TABBAR_UX[toTabber]._show) {
          //展示这个页面
          this.setData({
            selected: toTabber
          })
        }
      } else {
        //获取当前第一个可以显示的页面
        for (let x in TABBAR_UX) {
          if (TABBAR_UX[x]._show) {
            this.setData({
              selected: x
            })
            break;
          }
        }
      }
      //更新用户底部栏权限
      this.setData({
        list: TABBAR_UX,
        //加载完成
        loadInfo: true,
      })
      //根据权限进行加载数据
      //获取未读的信息
      this.getNoReact();
    })
    let systemInfo = app.privateData.systemInfo;
    let boundInfo = app.privateData.boundInfo;
    // console.log(boundInfo)
    this.setData({
      appHeader: boundInfo,
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
    this.selectComponent(`#${this.data.selected}`).onPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.selected == 'MESSAGE') {
      this.selectComponent(`#${this.data.selected}`).onReachBottom();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})

// Component({
//   properties: {
//     //当前的选择项目
//     selected: {
//       type: String,
//       value: '',
//     },
//     //当前页面是否自定义顶部栏
//     isTitle: {
//       type: Boolean,
//       value: false
//     }
//   },
//   data: {
//     color: "#bcbcbc",
//     meSelected: 0,
//     selectedColor: "#256cfa",
//     //安全高度
//     appHeaderHeight: 0,
//     // 底部栏
//     list: {
//       "a": {
//         "pagePath": "/pages/tabBar/index",
//         "text": "首页",
//         // "iconPath": "/assets/tabBar/message.png",
//         // "selectedIconPath": "/assets/tabBar/message-select.png",
//         "iconPath": "/assets/tabBar/index.png",
//         "selectedIconPath": "/assets/tabBar/index-select.png",
//         isShow: true
//       },
//       // [wx.$UX.WeMinProClient]: {
//       //     "pagePath": "/pages/tabBar/client",
//       //     "text": "客户",
//       //     "iconPath": "/assets/tabBar/client.png",
//       //     "selectedIconPath": "/assets/tabBar/client-select.png",
//       //     isShow: false
//       // },
//       [wx.$UX.WeMinProWork]: {
//         "pagePath": "/pages/tabBar/work",
//         "text": "工作",
//         "iconPath": "/assets/tabBar/work.png",
//         "selectedIconPath": "/assets/tabBar/work-select.png",
//         isShow: true
//       },
//       'app': {
//         isApp: true,
//         isShow: true
//       },
//       [wx.$UX.WeMinProMessage]: {
//         "pagePath": "/pages/tabBar/message",
//         "text": "客户",
//         // "iconPath": "/assets/tabBar/message.png",
//         // "selectedIconPath": "/assets/tabBar/message-select.png",
//         "iconPath": "/assets/tabBar/client.png",
//         "selectedIconPath": "/assets/tabBar/client-select.png",
//         isShow: true
//       },
//       [wx.$UX.WeMinProCooReport]: {
//         "pagePath": "/pages/tabBar/cooReport",
//         "text": "报告",
//         "iconPath": "/assets/tabBar/report.png",
//         "selectedIconPath": "/assets/tabBar/report-select.png",
//         isShow: false
//       },
//       [wx.$UX.WeMinProUser]: {
//         "pagePath": "/pages/tabBar/user",
//         "text": "我的",
//         "iconPath": "/assets/tabBar/user.png",
//         "selectedIconPath": "/assets/tabBar/user-select.png",
//         isShow: true
//       },
//     },
//     //业务功能
//     appList: undefined,
//     //应用功能
//     funAppList:undefined,
//     //app的抽屉现在是否在出来的状态
//     isAppShow: false
//   },
//   /**
//    * 组件生命周期函数-在组件布局完成后执行)
//    */
//   ready() {
//     let systemInfo = getApp().privateData.systemInfo;
//     let boundInfo = getApp().privateData.boundInfo;
//     // console.log(boundInfo)
//     this.setData({
//       appHeaderHeight: boundInfo.bottom
//     })

//   },
//   methods: {
//     // app抽屉展示
//     appShow() {
//       if (!this.data.funAppList) {
//         //表示还没有获取应用功能
//         getApp().loadInfo(() => {
//           this.setData({
//             funAppList: FunApps
//           })
//         })
//       }
//       if (!this.data.appList) {
//         //表示还没有获取抽屉列表,这个时候需要获取app权限
//         getApp().loadInfo(() => {
//           this.setData({
//             appList: Apps
//           })
//         })
//       }
//       this.setData({
//         isAppShow: true
//       })
//     },
//     //关闭app抽屉
//     closeApp() {
//       this.setData({
//         isAppShow: false
//       })
//     },
//     // 页面跳转
//     switchTab(e) {
//       const data = e.currentTarget.dataset
//       const url = data.path
//       console.log();
//       if (this.data.selected == data.index) {
//         //表示为当前页面
//         return
//       }
//       // redirectTo
//       wx.redirectTo({
//         url
//       })
//       // this.setData({
//       //     selected: data.index
//       // })
//     }
//   }
// })