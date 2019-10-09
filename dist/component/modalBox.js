// component/modalBox.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    modalShow:{
      type:Boolean,
      value:false,
      observer(newVal, oldVal, changedPath){
        this.setData({
          myValue: newVal
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    myValue:false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 关闭当前页面
     */
    close(){
      this.triggerEvent("close");
    }
  }
})
