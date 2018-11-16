// component/queryBox.js
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
    //是否显示input框
    isShowInput:false,
    inputValue:"",
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 当搜索框在收起的状态下被点击
    */
    bindtap(){
      this.setData({
        isShowInput:true
      })
    },
    /**
     * 当input失去焦点触发
    */
    bindblur(){
      //只有当input里面没有内容时,搜索框才会收起
      if(this.data.inputValue.length===0){
        this.setData({
          isShowInput: false
        })
      }
    },
    /**
     * 键盘在input上输入触发
    */
    bindinput(e){
      //获取input上输入内容
      this.data.inputValue = e.detail.value;
      //将信息传递出去
      this.triggerEvent("input", { value: e.detail.value });
    }
  }
})
