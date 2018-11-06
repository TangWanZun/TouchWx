// component/headImg.js
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
    imgUrl: getApp().privateData.configUrl.imgUrl
  },

  /**
   * 组件实例化
  */
  attached(){
    this.setData({
      loginInfo: getApp().privateData.loginInfo
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
