import {find} from "../library/sdk/util.js"
Component({
    properties: {
        selected: {
            type: String,
            value:'',
        }
    },
    data: {
        color: "#bcbcbc",
        meSelected: 0,
        selectedColor: "#256cfa",
        list:{
            "WeMinProMessage": {
                "pagePath": "/pages/tabBar/message",
                "text": "消息",
                "iconPath": "/assets/tabBar/message.png",
                "selectedIconPath": "/assets/tabBar/message-select.png",
                isShow: false
            },
            "WeMinProClient": {
                "pagePath": "/pages/tabBar/client",
                "text": "客户",
                "iconPath": "/assets/tabBar/client.png",
                "selectedIconPath": "/assets/tabBar/client-select.png",
                isShow: false
            },
            "WeMinProWork": {
                "pagePath": "/pages/tabBar/work",
                "text": "工作",
                "iconPath": "/assets/tabBar/work.png",
                "selectedIconPath": "/assets/tabBar/work-select.png",
                isShow: false
            },
            "WeMinProUser": {
                "pagePath": "/pages/tabBar/user",
                "text": "我的",
                "iconPath": "/assets/tabBar/user.png",
                "selectedIconPath": "/assets/tabBar/user-select.png",
                isShow: false
            },
        },
        // list: [{
        //         "MenuId":"WeMinProMessage",
        //         "pagePath": "/pages/tabBar/message",
        //         "text": "消息",
        //         "iconPath": "/assets/tabBar/message.png",
        //         "selectedIconPath": "/assets/tabBar/message-select.png",
        //         isShow: false
        //     },{
        //         "MenuId": "WeMinProClient",
        //         "pagePath": "/pages/tabBar/client",
        //         "text": "客户",
        //         "iconPath": "/assets/tabBar/client.png",
        //         "selectedIconPath": "/assets/tabBar/client-select.png",
        //         isShow: false
        //     },{
        //         "MenuId": "WeMinProWork",
        //         "pagePath": "/pages/tabBar/work",
        //         "text": "工作",
        //         "iconPath": "/assets/tabBar/work.png",
        //         "selectedIconPath": "/assets/tabBar/work-select.png",
        //         isShow: false
        //     },{
        //         "MenuId": "WeMinProUser",
        //         "pagePath": "/pages/tabBar/user",
        //         "text": "我的",
        //         "iconPath": "/assets/tabBar/user.png",
        //         "selectedIconPath": "/assets/tabBar/user-select.png",
        //         isShow: false
        //     },
        // ],
    },
    /**
     * 组件生命周期函数-在组件布局完成后执行)
     */
    ready() {
        let appPrivateData = getApp().privateData;
        getApp().loadInfo(()=> {
            let tabList = this.data.list;
            //根据权限来获取底部tabBar值
            for (let i = 0; i < appPrivateData.UXList.length;i++){
                tabList[appPrivateData.UXList[i].MenuId].isShow = true;
                // let index = find(tabList, "MenuId", appPrivateData.UXList[i].MenuId);
                // tabList[index].isShow = true;
            }
            this.setData({
                list:tabList
            });
        })
    },
    methods: {
        switchTab(e) {
            const data = e.currentTarget.dataset
            const url = data.path
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