// pages/user/indexData.js
import {
    arrToTree
} from "../../library/sdk/util.js"
import {
    CMP_CAR,
    CMP_REGION
} from "../../library/sdk/config.js"

Page({

    /**
     * 页面的初始数据
     */
    data: {
        //当前是否为区域模式
        // isQY:false
        formData: {},
        CMP_CAR,
        CMP_REGION,
        //是否显示暂无数据
        isOver:false
    },
    id: '',
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.id = options.id;
        this.getData();
        wx.setNavigationBarTitle({
            title: "指标-"+options.name
        })
    },
    /**
     * 获取数据
     */
    getData() {
        wx.showLoading({
            title: '数据加载中',
        })
        this.setData({
            isOver:false
        })
        wx.$request({
            url: "/WeMinProPlatJson/GetList",
            data: {
                docType: 'Main',
                actionType: 'IndexDataInfo',
                docId: this.id,
                needTotal: false,
            },
            success:res=>{
                let formData = arrToTree({
                    objArr:res,
                    attrArr: ['BrandType', 'RegionType'],
                    nullName: 'A00'
                });
                // console.log(formData);
                if (JSON.stringify(formData)=="{}"){
                    //空数据
                    this.setData({
                        isOver: true
                    })
                }else{
                    this.setData({
                        isOver: false
                    })
                }
                this.setData({
                    formData
                })
                
            },
            fail:()=>{
                this.setData({
                    isOver: true
                })
            },
            complete:()=> {
                wx.stopPullDownRefresh();
                wx.hideLoading()
            }
        })
        // let arr = [{ "CmpCode": "G00001", "CmpName": "北京鹏龙星徽汽车销售服务有限公司", "IsAuth": 0, "GroupCode": "G0", "BrandType": "A01", "RegionType": "A04" }, { "CmpCode": "G00002", "CmpName": "浙江鹏龙之奔汽车销售服务有限公司", "IsAuth": 0, "GroupCode": "G0", "BrandType": "A01", "RegionType": "A03" }, { "CmpCode": "G00003", "CmpName": "潍坊鹏龙金阳光汽车销售服务有限公司", "IsAuth": 0, "GroupCode": "G0", "BrandType": "A01", "RegionType": null }, { "CmpCode": "G00004", "CmpName": "宜兴市鹏龙汽车销售服务有限公司", "IsAuth": 0, "GroupCode": "G0", "BrandType": "A01", "RegionType": "A03" }, { "CmpCode": "G00005", "CmpName": "贵州鹏龙晨羲汽车销售服务有限公司", "IsAuth": 0, "GroupCode": "G0", "BrandType": "A01", "RegionType": null }, { "CmpCode": "G00006", "CmpName": "烟台鹏龙伟东汽车销售服务有限公司", "IsAuth": 1, "GroupCode": "G0", "BrandType": "A01", "RegionType": "A01" }, { "CmpCode": "G00007", "CmpName": "甘肃鹏龙金城汽车销售服务有限责任公司", "IsAuth": 0, "GroupCode": "G0", "BrandType": "A01", "RegionType": "A02" }, { "CmpCode": "G00010", "CmpName": "焦作鹏龙得佳汽车销售有限公司", "IsAuth": 0, "GroupCode": "G0", "BrandType": "A01", "RegionType": null }, { "CmpCode": "G00011", "CmpName": "十堰鹏贤奔驰汽车销售服务有限公司", "IsAuth": 0, "GroupCode": "G0", "BrandType": "A01", "RegionType": null }, { "CmpCode": "G00012", "CmpName": "郴州鹏龙驰峰汽车销售服务有限公司", "IsAuth": 0, "GroupCode": "G0", "BrandType": "A01", "RegionType": null }, { "CmpCode": "G00013", "CmpName": "佛山市鹏龙利泰汽车销售服务有限公司", "IsAuth": 0, "GroupCode": "G0", "BrandType": "A01", "RegionType": null }, { "CmpCode": "G00014", "CmpName": "苏州鹏龙东昌汽车销售服务有限公司", "IsAuth": 0, "GroupCode": "G0", "BrandType": "A01", "RegionType": null }, { "CmpCode": "G00015", "CmpName": "大连鹏龙腾川汽车销售服务有限公司", "IsAuth": 0, "GroupCode": "G0", "BrandType": "A01", "RegionType": null }, { "CmpCode": "G00016", "CmpName": "商丘市鹏东汽车销售服务有限公司", "IsAuth": 0, "GroupCode": "G0", "BrandType": "A01", "RegionType": null }, { "CmpCode": "G00017", "CmpName": "安徽鹏龙融富汽车销售服务有限公司", "IsAuth": 0, "GroupCode": "G0", "BrandType": "A01", "RegionType": null }, { "CmpCode": "G00018", "CmpName": "福州鹏龙国戎汽车销售服务有限公司", "IsAuth": 0, "GroupCode": "G0", "BrandType": "A01", "RegionType": null }, { "CmpCode": "G00019", "CmpName": "武汉鹏龙华通汽车贸易有限公司", "IsAuth": 0, "GroupCode": "G0", "BrandType": "A01", "RegionType": null }, { "CmpCode": "G00020", "CmpName": "陕西汉中鹏龙中联之星汽车贸易有限公司", "IsAuth": 0, "GroupCode": "G0", "BrandType": "A01", "RegionType": null }, { "CmpCode": "G00021", "CmpName": "庆阳鹏龙中联之星汽车贸易有限公司", "IsAuth": 0, "GroupCode": "G0", "BrandType": "A01", "RegionType": null }, { "CmpCode": "G00025", "CmpName": "盐城鹏龙森风奔驰汽车销售有限公司", "IsAuth": 0, "GroupCode": "G0", "BrandType": "A01", "RegionType": null }, { "CmpCode": "G00026", "CmpName": "镇江鹏龙星徽汽车销售服务有限公司", "IsAuth": 0, "GroupCode": "G0", "BrandType": "A01", "RegionType": null }, { "CmpCode": "G00027", "CmpName": "天津市鹏龙九州汽车销售服务有限公司", "IsAuth": 0, "GroupCode": "G0", "BrandType": "A01", "RegionType": null }, { "CmpCode": "G00028", "CmpName": "湖南鹏龙瑞丰汽车销售服务有限公司", "IsAuth": 0, "GroupCode": "G0", "BrandType": "A01", "RegionType": null }, { "CmpCode": "G00029", "CmpName": "驻马店鹏龙得佳汽车销售服务有限公司", "IsAuth": 0, "GroupCode": "G0", "BrandType": "A01", "RegionType": null }, { "CmpCode": "G00030", "CmpName": "太原鹏龙星徽汽车销售服务有限公司", "IsAuth": 0, "GroupCode": "G0", "BrandType": "A01", "RegionType": null }, { "CmpCode": "G00031", "CmpName": "东莞市鹏龙永奥汽车销售服务有限公司", "IsAuth": 0, "GroupCode": "G0", "BrandType": "A01", "RegionType": null }, { "CmpCode": "G00032", "CmpName": "重庆鹏龙祥瑞奔驰汽车销售服务有限公司", "IsAuth": 0, "GroupCode": "G0", "BrandType": "A01", "RegionType": null }, { "CmpCode": "G00033", "CmpName": "北京鹏龙海依捷汽车销售服务有限公司", "IsAuth": 0, "GroupCode": "G0", "BrandType": "A01", "RegionType": null }, { "CmpCode": "G00035", "CmpName": "青岛鹏龙金阳光汽车销售服务有限公司", "IsAuth": 0, "GroupCode": "G0", "BrandType": "A01", "RegionType": null }, { "CmpCode": "G00036", "CmpName": "上海鹏龙大众星徽汽车销售服务有限公司", "IsAuth": 0, "GroupCode": "G0", "BrandType": "A01", "RegionType": null }, { "CmpCode": "G00037", "CmpName": "芜湖鹏龙伟恒汽车销售服务有限公司", "IsAuth": 0, "GroupCode": "G0", "BrandType": "A01", "RegionType": null }, { "CmpCode": "G00038", "CmpName": "济宁鹏龙吉星奔驰汽车销售服务有限公司", "IsAuth": 0, "GroupCode": "G0", "BrandType": "A01", "RegionType": null }, { "CmpCode": "G00039", "CmpName": "广西鹏龙天合汽车销售服务有限公司", "IsAuth": 0, "GroupCode": "G0", "BrandType": "A01", "RegionType": null }, { "CmpCode": "G00040", "CmpName": "成都鹏龙怡帆汽车销售服务有限公司", "IsAuth": 0, "GroupCode": "G0", "BrandType": "A01", "RegionType": null }, { "CmpCode": "G10003", "CmpName": "北京燕盛隆汽车维修有限公司", "IsAuth": 0, "GroupCode": "G0", "BrandType": "A02", "RegionType": null }]

    },
    /**
     * switch改变
     */
    switchChange(e) {
        this.setData({
            isQY: e.detail.value
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

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