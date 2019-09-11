import login from '../../library/sdk/login.js'
// component/dialog.js
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
    loginInfo: {},
    formData: [],
    //运营报告权限
    // ux_cooReport:false,
    //核销权限
    ux_consumeRelease: false,
    //页面的安全高度
    pageHeight: 0,
  },
  /**
   * 组件开始挂载的时候
   */
  attached() {
    var _this = this;
    let appPrivateData = getApp().privateData;
    getApp().loadInfo(function() {
      _this.setData({
        loginInfo: appPrivateData.loginInfo,
      })
    })
    let boundInfo = appPrivateData.boundInfo;
    this.setData({
      pageHeight: boundInfo.bottom + 5,
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 下拉刷新
     */
    onPullDownRefresh() {
      wx.stopPullDownRefresh();
    },
  }
})
// Page({
//     /**
//      * 页面的初始数据
//      */
//     data: {
//         UX_CONST:wx.$UX,
//         loginInfo: {},
//         formData: [],
//         //运营报告权限
//         // ux_cooReport:false,
//         //核销权限
//         ux_consumeRelease:false
//     },
//     /**
//      * 打开手机扫码
//      */
//     scanCode() {
//         let _this = this;
//         wx.scanCode({
//             scanType: ['qrCode'],
//             success(res) {
//                 // 扫码返回成功跳转会员消费页面
//                 wx.navigateTo({
//                     url: '/pages/user/work/cardCustomer?openId=' + res.result
//                 });
//             },
//             fail() {

//             }
//         })
//     },
//     /**
//      * 加载数据
//      */
//     getData() {
//         let _this = this;
//         wx.showLoading({
//             title: '数据加载中',
//             mask: true
//         })
//         wx.$request({
//             url: "/WeMinProPlatJson/GetList",
//             data: {
//                 docType: 'Main',
//                 actionType: 'ReportList',
//                 needTotal: false,
//             },
//             success(res) {
//                 _this.setData({
//                     formData: res
//                 })
//             },
//             complete() {
//                 wx.stopPullDownRefresh();
//                 wx.hideLoading()
//             }
//         })
//     },
//     /**
//      * 生命周期函数--监听页面加载
//      */
//     onLoad: function(options) {
//         let app =  getApp();
//         //查看是否存在data缓存
//         if (app.tabBarPageCache.user){
//             this.setData(Object.assign(this.data, app.tabBarPageCache.user))
//         }else{
//             // this.getData();
//         }
//         //这里会出现抢线程的问题，比如app的跳转早于这个页面
//         // let privateData = getApp().privateData;
//         // if (typeof privateData.loginInfo === 'undefined') {
//         //     //运行
//         //     login.init();
//         // }
//     },

//     /**
//      * 生命周期函数--监听页面初次渲染完成
//      */
//     onReady: function() {
//         var _this = this;
//         let appPrivateData = getApp().privateData;
//         getApp().loadInfo(function() {
//             _this.setData({
//                 loginInfo: appPrivateData.loginInfo,
//             })
//         })
//         //获取相关权限
//         Promise.all([wx.$getUX(wx.$UX.ConsumeRelease), wx.$getUX(wx.$UX.CmpScopeFilter)])
//             .then(res => {
//                 this.setData({
//                     ux_consumeRelease: res[0],
//                     ux_cmpScopeFilter:res[1]
//                 })
//             })
//     },

//     /**
//      * 生命周期函数--监听页面显示
//      */
//     onShow: function() {

//     },

//     /**
//      * 生命周期函数--监听页面隐藏
//      */
//     onHide: function() {

//     },

//     /**
//      * 生命周期函数--监听页面卸载
//      */
//     onUnload: function() {
//         let app = getApp();
//         app.setTabBarPageCache('user', this.data);
//     },

//     /**
//      * 页面相关事件处理函数--监听用户下拉动作
//      */
//     onPullDownRefresh: function() {
//         // this.getData()
//     },

//     /**
//      * 页面上拉触底事件的处理函数
//      */
//     onReachBottom: function() {

//     },

//     /**
//      * 用户点击右上角分享
//      */
//     onShareAppMessage: function() {

//     }
// })