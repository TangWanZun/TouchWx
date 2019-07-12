import {
    util,
    configUrl,
    toDate,
    WORK_TYPE
} from '../../library/sdk.js'
Page({
    /**
     * 页面的初始数据
     */
    data: {
        ux:{
            //预约单权限
            "ux_weiXinReserve": false,
            //救援单权限
            "ux_weiXinRescue": false,
            //活动报名权限
            "ux_weiXinActivitySignUp": false,
            //到期提醒权限
            "ux_timedReport": false,
        },
        UX_CONST: wx.$UX,
        imgUrl: configUrl.imgUrl,
        //是否加载完毕
        isOver: false,
        workTypeData: [{
                title: "救援",
                iconUrl: "/assets/workType/WORK_JY.svg",
                url: "/pages/work/workRescue",
                uxName:"ux_weiXinRescue"
            },
            //       {
            //         title: "投诉",
            //         iconUrl: "/assets/workType/WORK_TS.svg",
            //         url: "/pages/work/workComplain"
            //       },
            {
                title: "预约",
                iconUrl: "/assets/workType/WORK_YY.svg",
                url: "/pages/work/workMake",
                uxName: "ux_weiXinReserve"
            },
            {
                title: "活动",
                iconUrl: "/assets/workType/WORK_HD.svg",
                url: "/pages/work/workActivity",
                uxName: "ux_weiXinActivitySignUp"
            },
            {
                title: "到期",
                iconUrl: "/assets/workType/WORK_DQ.svg",
                url: "/pages/work/workExpire",
                uxName: "ux_timedReport"
            }
        ],
        workType: {},
        //数据列表
        dataList: [],
        //工作报表
        reportList:[]
    },
    /**
     * 加载数据
     */
    getData() {
        let _this = this;
        _this.setData({
            isOver: false
        })
        wx.$request({
            url: "/WeMinProPlatJson/GetList",
            data: {
                docType: 'WorkData',
                actionType: 'WorkList',
                needTotal: false,
            },
            success(res) {
                //这里需要处理数据
                for (let i = 0; i < res.length; i++) {
                    //这里是预约,预约的时间使用的是end 和 start的时间
                    if (res[i].CreateDate) {
                        res[i].CreateDate = util.toDate(res[i].CreateDate) + ' ' + util.dateParseTime(res[i].CreateDate)
                    }
                    if (res[i].ReserveStartDate) {
                        res[i].ReserveStartDate = util.toTime(res[i].ReserveStartDate)
                    }
                    if (res[i].ReserveEndDate) {
                        res[i].ReserveEndDate = util.toTime(res[i].ReserveEndDate)
                    }
                }
                _this.setData({
                    dataList: res,
                    isOver: true
                })

            },
            complete() {
                wx.stopPullDownRefresh();
            }
        })
        wx.$request({
            url: "/WeMinProPlatJson/GetDataSet",
            data: {
                docType: 'WorkData',
                actionType: 'ReportList',
                needTotal: false,
            },
            success(res) {
                _this.setData({
                    reportList:res.Table||[]
                })
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            workType: WORK_TYPE
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        //获取相关权限
        Promise.all([wx.$getUX(wx.$UX.WeiXinReserve), wx.$getUX(wx.$UX.WeiXinRescue), wx.$getUX(wx.$UX.WeiXinActivitySignUp), wx.$getUX(wx.$UX.TimedReport)])
            .then(res => {
                this.setData({
                    //预约单权限
                    "ux.ux_weiXinReserve": res[0],
                    //救援单权限
                    "ux.ux_weiXinRescue": res[1],
                    //活动报名权限
                    "ux.ux_weiXinActivitySignUp": res[2],
                    //到期提醒权限
                    "ux.ux_timedReport": res[3],
                })
            })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        let app = getApp();
        //查看是否存在data缓存
        if (app.tabBarPageCache.work) {
            this.setData(Object.assign(this.data, app.tabBarPageCache.work))
        } else {
            this.getData();
        }
        // this.getData();
        // console.log(this.getTabBar())
        // if (typeof this.getTabBar === 'function' &&
        //     this.getTabBar()) {
        //     this.getTabBar().setData({
        //         selected: 2
        //     })
        // }
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {
        let app = getApp();
        app.setTabBarPageCache('work',this.data);
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {
        this.getData();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})