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
            [wx.$UX. WeMinProMessage]: {
                "pagePath": "/pages/tabBar/message",
                "text": "消息",
                "iconPath": "/assets/tabBar/message.png",
                "selectedIconPath": "/assets/tabBar/message-select.png",
                isShow: false
            },
            [wx.$UX.WeMinProClient]: {
                "pagePath": "/pages/tabBar/client",
                "text": "客户",
                "iconPath": "/assets/tabBar/client.png",
                "selectedIconPath": "/assets/tabBar/client-select.png",
                isShow: false
            },
            [wx.$UX.WeMinProWork]: {
                "pagePath": "/pages/tabBar/work",
                "text": "工作",
                "iconPath": "/assets/tabBar/work.png",
                "selectedIconPath": "/assets/tabBar/work-select.png",
                isShow: false
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
            for (let x in appPrivateData.UXList){
                let item = tabList[x];
                if(item){
                    tabList[x].isShow = true
                }
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