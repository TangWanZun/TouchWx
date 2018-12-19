// component/tuiInput.js
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    /**
     * 当前input的类型
     * 1. input 输入框(默认值)
     * 2. data  时间选择器()
     * 3. select 普通选择器
     */
    type:{
      type: String,
      value:'input'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * input 数值改变时候的回调参数
     */
    bindInput(e){
      console.log(e);
      this.triggerEvent('myevent', myEventDetail, myEventOption)
    }
  }
})
