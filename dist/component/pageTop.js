// component/pageTop.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title:{
      type:String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    //页面的安全高度
    pageHeight: 0,
    pageTop: 0,
  },
  /**
   * 在组件实例进入也买你节点树的时候的更新
   */
  attached() {
    // let systemInfo = getApp().privateData.systemInfo;
    let boundInfo = getApp().privateData.boundInfo;
    this.setData({
      pageHeight: boundInfo.bottom + 10,
      pageTop: boundInfo.top - 10
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {

  }
})
