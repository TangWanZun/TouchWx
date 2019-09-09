
import {
  find
} from "../library/sdk/util.js"
Component({
  properties: {
    //当前的选择项目
    selected: {
      type: String,
      value: '',
    },
    //当前页面是否自定义顶部栏
    isTitle:{
      type:Boolean,
      value:false
    }
  },
  data: {
    color: "#bcbcbc",
    meSelected: 0,
    selectedColor: "#256cfa",
    //安全高度
    appHeaderHeight: 0,
    list: {
      "a": {
        "pagePath": "/pages/tabBar/index",
        "text": "首页",
        // "iconPath": "/assets/tabBar/message.png",
        // "selectedIconPath": "/assets/tabBar/message-select.png",
        "iconPath": "/assets/tabBar/index.png",
        "selectedIconPath": "/assets/tabBar/index-select.png",
        isShow: true
      },
      // [wx.$UX.WeMinProClient]: {
      //     "pagePath": "/pages/tabBar/client",
      //     "text": "客户",
      //     "iconPath": "/assets/tabBar/client.png",
      //     "selectedIconPath": "/assets/tabBar/client-select.png",
      //     isShow: false
      // },
      [wx.$UX.WeMinProWork]: {
        "pagePath": "/pages/tabBar/work",
        "text": "工作",
        "iconPath": "/assets/tabBar/work.png",
        "selectedIconPath": "/assets/tabBar/work-select.png",
        isShow: true
      },
      'app':{
        isApp:true,
        isShow: true
      },
      [wx.$UX.WeMinProMessage]: {
        "pagePath": "/pages/tabBar/message",
        "text": "客户",
        // "iconPath": "/assets/tabBar/message.png",
        // "selectedIconPath": "/assets/tabBar/message-select.png",
        "iconPath": "/assets/tabBar/client.png",
        "selectedIconPath": "/assets/tabBar/client-select.png",
        isShow: true
      },
      [wx.$UX.WeMinProCooReport]: {
        "pagePath": "/pages/tabBar/cooReport",
        "text": "报告",
        "iconPath": "/assets/tabBar/report.png",
        "selectedIconPath": "/assets/tabBar/report-select.png",
        isShow: false
      },
      [wx.$UX.WeMinProUser]: {
        "pagePath": "/pages/tabBar/user",
        "text": "我的",
        "iconPath": "/assets/tabBar/user.png",
        "selectedIconPath": "/assets/tabBar/user-select.png",
        isShow: true
      },
    },
    //app的抽屉现在是否在出来的状态
    isAppShow:false
  },
  /**
   * 组件生命周期函数-在组件布局完成后执行)
   */
  ready() {
    let systemInfo = getApp().privateData.systemInfo;
    let boundInfo = getApp().privateData.boundInfo;
    // console.log(boundInfo)
    this.setData({
      appHeaderHeight:boundInfo.bottom
    })
    // let appPrivateData = getApp().privateData;
    // getApp().loadInfo(() => {
    //   let tabList = this.data.list;
    //   //根据权限来获取底部tabBar值
    //   for (let x in appPrivateData.UXList) {
    //     let item = tabList[x];
    //     if (item) {
    //       tabList[x].isShow = true
    //     }
    //   }
    //   this.setData({
    //     list: tabList
    //   });
    // })
  },
  methods: {
    // app抽屉展示
    appShow(){
      this.setData({
        isAppShow:true
      })
    },
    //关闭app抽屉
    closeApp(){
      this.setData({
        isAppShow: false
      })
    },
    // 页面跳转
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      console.log();
      if (this.data.selected==data.index){
        //表示为当前页面
        return
      }
      // redirectTo
      wx.redirectTo({
        url
      })
      // this.setData({
      //     selected: data.index
      // })
    }
  }
})