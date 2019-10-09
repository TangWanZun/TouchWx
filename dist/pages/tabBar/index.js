// pages/tabBar/index.js
// import login from '../../library/sdk/login.js'
// component/dialog.js
import {
  FunApps,
  Apps,
  AppsList
} from "../../library/sdk/UX_CONST.js";
import {STORAGE_KEY} from "../../library/sdk/config.js"

let AllApps = Object.assign({}, FunApps, Apps);


Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    formData: [],
    loginWidth: 0,
    loginHeight: 0,
    loginTop: 0,
    headerTop: 0,
    //首页快捷入口应用
    appsList: AppsList,
    //全部应用
    allApps: AllApps
  },
  /**
   * 在组件实例进入也买你节点树的时候的更新
   */
  attached() {
    let app = getApp();
    //查看是否存在data缓存
    if (app.tabBarPageCache.index) {
      //独取缓存信息
      this.setData(Object.assign(this.data, app.tabBarPageCache.index))
    } else {
      //使用原信息
      let systemInfo = getApp().privateData.systemInfo;
      let boundInfo = getApp().privateData.boundInfo;
      // console.log(systemInfo,boundInfo)
      let width = boundInfo.left - 30;
      this.setData({
        loginWidth: width,
        loginHeight: width * 0.128,
        loginTop: boundInfo.top + 2,
        headerTop: boundInfo.bottom + 10
      })
      // this.getData(true);
      //这里是因为，首页的指标信息 加载速度太慢 ， 所以也会进行持久化
      try {
        var value = wx.getStorageSync('indexData')
        if (value) {
          this.setData({
            formData: value
          });
        } else {
          this.getData(true);
        }
      } catch (e) {
        console.log(`获取首页指标信息错误：${e}`)
        this.getData(true);
      }
    }
    //获取首页的app快捷入口
    this.getApps();
  },
  /**
   * 组件被移除的时候
   */
  detached() {
    let app = getApp();
    //将当前页面的信息记录到缓存中去
    app.setTabBarPageCache('index', this.data);
  },
  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 获取快捷入口的app应用
     */
    getApps() {
      //这里是获取首页的自定义应用的
      let appList = wx.getStorageSync(STORAGE_KEY.INDEX_APP);
      // console.log(appList)
      if (appList) {
        this.setData({
          appsList: appList
        })
      }
    },
    /**
     * 点击搜索按钮
     */
    toQuery() {
      wx.navigateTo({
        url: '/pages/client/query'
      });
    },
    /**
     * 点击扫码按钮
     */
    scanCode() {
      let _this = this;
      wx.scanCode({
        scanType: ['qrCode'],
        success(res) {
          // 扫码返回成功跳转到扫码入口页面
          wx.navigateTo({
            url: '/pages/client/clientDetails?openId=' + res.result
          });
        },
        fail() {

        }
      })
    },
    /**
     * 加载数据
     */
    getData(isLoad = false) {
      let _this = this;
      if (isLoad) {
        wx.showLoading({
          title: '数据加载中',
          mask: true
        })
      }
      wx.$request({
        url: "/WeMinProPlatJson/GetList",
        data: {
          docType: 'Main',
          actionType: 'ReportList',
          needTotal: false,
        },
        success(res) {
          _this.setData({
            formData: res
          });
          wx.setStorage({
            key: "indexData",
            data: res
          })
        },
        complete() {
          wx.stopPullDownRefresh();
          isLoad && wx.hideLoading()
        }
      })
    },
    /**
     * 下拉刷新
     */
    onPullDownRefresh() {
      this.getData(true)
    }
  }
})
// Page({

//   /**
//    * 页面的初始数据
//    */
//   data: {
//     formData: [],
//     loginWidth: 0,
//     loginHeight:0,
//     loginTop:0,
//     headerTop:0,
//   },

//   /**
//    * 生命周期函数--监听页面加载
//    */
//   onLoad: function(options) {
//     let systemInfo = getApp().privateData.systemInfo;
//     let boundInfo = getApp().privateData.boundInfo;
//     // console.log(systemInfo,boundInfo)
//     let width = boundInfo.left - 30;
//     this.setData({
//       loginWidth: width,
//       loginHeight: width*0.128,
//       loginTop: boundInfo.top+2,
//       headerTop: boundInfo.bottom+10
//     })
//     //这里会出现抢线程的问题，比如app的跳转早于这个页面
//     let privateData = getApp().privateData;
//     if (typeof privateData.loginInfo === 'undefined') {
//       //运行
//       login.init();
//     }
//     try {
//       var value = wx.getStorageSync('indexData')
//       if (value) {
//         this.setData({
//           formData: value
//         });
//       } else {
//         this.getData(true);
//       }
//     } catch (e) {
//       console.log(`获取首页指标信息错误：${e}`)
//       this.getData(true);
//     }
//   },
//   /**
//    * 点击搜索按钮
//    */
//   toQuery() {
//     wx.navigateTo({
//       url: '/pages/client/query'
//     });
//   },
//   /**
//    * 点击扫码按钮
//    */
//   scanCode() {
//     let _this = this;
//     wx.scanCode({
//       scanType: ['qrCode'],
//       success(res) {
//         // 扫码返回成功跳转到扫码入口页面
//         wx.navigateTo({
//           url: '/pages/user/sweepCode?openId=' + res.result
//         });
//       },
//       fail() {

//       }
//     })
//   },
//   /**
//    * 加载数据
//    */
//   getData(isLoad = false) {
//     let _this = this;
//     if (isLoad) {
//       wx.showLoading({
//         title: '数据加载中',
//         mask: true
//       })
//     }
//     wx.$request({
//       url: "/WeMinProPlatJson/GetList",
//       data: {
//         docType: 'Main',
//         actionType: 'ReportList',
//         needTotal: false,
//       },
//       success(res) {
//         _this.setData({
//           formData: res
//         });
//         wx.setStorage({
//           key: "indexData",
//           data: res
//         })
//       },
//       complete() {
//         wx.stopPullDownRefresh();
//         isLoad && wx.hideLoading()
//       }
//     })
//   },
//   /**
//    * 生命周期函数--监听页面初次渲染完成
//    */
//   onReady: function() {

//   },

//   /**
//    * 生命周期函数--监听页面显示
//    */
//   onShow: function() {

//   },

//   /**
//    * 生命周期函数--监听页面隐藏
//    */
//   onHide: function() {

//   },

//   /**
//    * 生命周期函数--监听页面卸载
//    */
//   onUnload: function() {

//   },

//   /**
//    * 页面相关事件处理函数--监听用户下拉动作
//    */
//   onPullDownRefresh: function() {
//     this.getData();
//   },

//   /**
//    * 页面上拉触底事件的处理函数
//    */
//   onReachBottom: function() {

//   },

//   /**
//    * 用户点击右上角分享
//    */
//   onShareAppMessage: function() {

//   }
// })