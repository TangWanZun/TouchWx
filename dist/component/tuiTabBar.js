// component/tuiTabBar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    newIndex:{
      type:"Number"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    itemList:[
      {
        title:"消息",
        icon:"/assets/tabBar/message.png",
        iconSelect:"/assets/tabBar/message-select.png",
        url:"/pages/tabBar/message"
      },
      {
        title: "客户",
        icon: "/assets/tabBar/client.png",
        iconSelect: "/assets/tabBar/client-select.png",
        url: "/pages/tabBar/client"
      },
      {
        title: "工作",
        icon: "/assets/tabBar/work.png",
        iconSelect: "/assets/tabBar/work-select.png",
        url: "/pages/tabBar/work"
      },
      {
        title: "我的",
        icon: "/assets/tabBar/user.png",
        iconSelect: "/assets/tabBar/user-select.png",
        url: "/pages/tabBar/user"
      }
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
