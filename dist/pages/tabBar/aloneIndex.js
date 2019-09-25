// pages/tabBar/aloneIndex.js
import {
  UX_MAP,
  ALONE_FUN
} from "../../library/sdk/UX_CONST.js"
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
    //是否需要启动弹框
    showModal: false,
    //当前查询出来的用户信息
    fromData: {},
    //独立功能组件权限
    ALONE_FUN,
    //权限对照
    UX_MAP
  },
  /**
   * 在组件实例进入也买你节点树的时候的更新
   */
  attached() {
    let app = getApp();
    //更新底部数据
    app.loadInfo(() => {
      //更新用户独立功能权限
      this.setData({
        ALONE_FUN: ALONE_FUN,
      })
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 进入新的页面进行核销操作
     */
    showCode(e) {
      let _this = this;
      console.log(e)
      //获取核销类型
      let echartType = e.currentTarget.dataset.type;
      wx.scanCode({
        onlyFromCamera: true,
        success(res) {
          //保存openid
          _this.openId = res.result;
          wx.showModal({
            title: '',
            content: res.result ,
          })
        },
        fail(e) {
          wx.showModal({
            title: '错误',
            content: e,
          })
        }
      })
    },
    /**
     * 下拉刷新
     */
    onPullDownRefresh() {
      wx.stopPullDownRefresh();
    }
  }
})