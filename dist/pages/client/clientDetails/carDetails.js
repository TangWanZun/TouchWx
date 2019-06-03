// pages/client/clientDetails/carDetails.js.js
import {
    util
} from '../../../library/sdk.js'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        //图片数据
        imgUrl: getApp().privateData.configUrl.imgUrl,
        formData: {},
        dataList: {},
        //履历信息
        carRecord: [],
        carImgList: [],
        //行驶证信息（后台维护）
        xsCardImg: {
            orig: '',
            thum: ''
        },
        //行驶证信息（客户维护）
        xsCardImgUser: {
            orig: '',
            thum: ''
        },
       //车辆履历是否正在加载中
        carRecordListOnLoad:false
    },
    /**
     * 加载组件
     */
    myLlbox: {},
    /**
     *页面加载数据
     */
    optionsCookie: {},
    /**
     * 用户上传证件回调
     */
    //是否为刚刚生成页面
    isLoadNew:true,
    leafletAddInput(e) {
        if (this.isLoadNew){
            this.isLoadNew = false;
            return;
        }
        //这个不需要进行展示了，所以不使用setdata
        this.data[e.target.dataset.key] = e.detail;
        //这里调用上传数据
        //加载绑定车辆数据
        wx.$request({
            url: "/WeMinProPlatJson/Submit",
            data: {
                docType: 'Ocrd',
                actionType: 'SubmitOCar',
                docId: this.optionsCookie.carId,
                docJson:JSON.stringify({
                    'VehicleLicOrigImg1': e.detail.orig,
                    'VehicleLicThumImg1': e.detail.thum
                })
            },
            success(res) {
                wx.showToast({
                    title: '修改成功',
                })
            }
        })
    },
    
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        //缓存页面加载数据
        this.optionsCookie = options;
        //获取自定义组件
        this.myLlbox = this.selectComponent('#myLlbox');
        var _this = this;
        //加载绑定车辆数据
        wx.$request({
            url: "/WeMinProPlatJson/GetDataSet",
            data: {
                docType: 'Ocrd',
                actionType: 'CarDetails',
                needTotal: false,
                docid: options.openId,
                p1: options.carId
            },
            success(res) {
                let resItem = res.Table[0]||{};
                //数据修改
                resItem.MaintainDate = resItem.MaintainDate ? util.toDate(resItem.MaintainDate) : '暂无信息';
                resItem.InsuranceDate = resItem.InsuranceDate ? util.toDate(resItem.InsuranceDate) : '暂无信息';
                _this.setData({
                    dataList: resItem,
                    carImgList: res.Table1 || [],
                    //获取行驶证图片（客户上传）
                    xsCardImgUser:{
                        orig: resItem.VehicleLicOrigImg||'',
                        thum: resItem.VehicleLicThumImg || ''
                    },
                    //获取行驶证图片（后台维护）
                    xsCardImg: {
                        orig: resItem.VehicleLicOrigImg1 || '',
                        thum: resItem.VehicleLicThumImg1 || ''
                    }
                })
            },
            complete() {
                wx.stopPullDownRefresh();
            }
        })
        //加载爱车履历
        this.setData({
            carRecordListOnLoad:true
        })
        // this.myLlbox.init({
        wx.$request({
            url: "/WeMinProPlatJson/GetDataSet",
            // url: "/WeMinProPlatJson/GetList",
            data: {
                docType: 'Ocrd',
                actionType: 'CarRecordList',
            },
            success(res) {
                // res = { "Table": [{ "Rown": 5, "DocEntry": "17805", "WIP": "21540", "PayType": "正常维修", "SlpName": "张致彬", "DocDate": "2019.05.01", "DocTotal": 1042.0 }], "Table1": [{ "DocEntry": "17805", "ItemName": "保养菜单-基础B保养", "Qty": 1.00, "GSTotal": 1210.02 }, { "DocEntry": "17805", "ItemName": "进行带附加组件的 B 类保养范围", "Qty": 1.00, "GSTotal": 0.00 }, { "DocEntry": "17805", "ItemName": "保养菜单-空调滤芯", "Qty": 1.00, "GSTotal": 838.33 }, { "DocEntry": "17805", "ItemName": "进行保养的附加工作， 更换粉尘", "Qty": 1.00, "GSTotal": 0.00 }, { "DocEntry": "17805", "ItemName": "保养A的附加工作 更换组合滤清器", "Qty": 1.00, "GSTotal": 0.00 }], "Table2": [{ "DocEntry": "17805", "ItemName": "空调滤清器", "Qty": 1.00, "PJTotal": 0.00 }, { "DocEntry": "17805", "ItemName": "空调滤清器", "Qty": 1.00, "PJTotal": 0.00 }, { "DocEntry": "17805", "ItemName": "[022] 火花塞", "Qty": 4.00, "PJTotal": 0.00 }, { "DocEntry": "17805", "ItemName": "[022] 原厂机油 5W-40 1L", "Qty": 7.00, "PJTotal": 0.00 }, { "DocEntry": "17805", "ItemName": "TS 机油滤清器滤芯", "Qty": 1.00, "PJTotal": 0.00 }] }
                // console.log(res);
                // // 这里需要对数据进行处理
                // let arr = res[0] ? [res[0]] : [];
                // for (let i = 1; i < res.length; i++) {
                //     if (arr[arr.length - 1].PeriodYear == res[i].PeriodYear) {
                //         arr[arr.length - 1].L1ItemName += `,${res[i].L1ItemName}`;
                //     } else {
                //         arr.push(res[i])
                //     }
                // }
                let list = res.Table||[];
                //为父列表  添加  自定义属性
                for(let item of list){
                    item._list_1 = [];
                    item._list_2 = [];
                    //是否展开全部的项目
                    item._show = false;
                }
                if (list.length>0){
                    // 添加 工项明细
                    let list_1 = res.Table1||[];
                    for(let i in list_1){
                        let item = list_1[i];
                        //获取在父级上条目索引
                        let index = util.find(list, 'DocEntry', item.DocEntry);
                        if (index>=0){
                            list[index]._list_1.push(item)
                        }
                    }
                    // 添加 配件明细
                    let list_2 = res.Table2 || [];
                    for (let i in list_2) {
                        let item = list_2[i];
                        //获取在父级上条目索引
                        let index = util.find(list, 'DocEntry', item.DocEntry);
                        if (index >= 0) {
                            list[index]._list_2.push(item)
                        }
                    }
                }
                _this.setData({
                    carRecord: list
                })
            },
            complete(){
                _this.setData({
                    carRecordListOnLoad: false
                })
            }
        });
    },
    /**
     * 控制车辆履历是否展开详情
     */
    recordShow(e){
        let index = e.currentTarget.dataset.index;
        this.setData({
            [`carRecord[${index}]._show`]: !this.data.carRecord[index]._show
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
        this.isLoadNew = true;
        this.onLoad(this.optionsCookie);
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        // this.myLlbox.request();
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})