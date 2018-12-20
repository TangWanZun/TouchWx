// pages/client/clientDetails.js
import {
        util
} from '../../library/sdk.js'
Page({

        /**
         * 页面的初始数据
         */
        data: {
                //图片数据
                imgUrl: getApp().privateData.configUrl.imgUrl,
                formData: {},
                carList: [],
                labelList: [],
                //是否在线
                online:false,
                openId:'',
                //学历
                educationRange: [],
                //性别
                sexRange: [
                        {
                                Code:'男',
                                Name:'男'
                        },
                        {
                                Code: '女',
                                Name: '女'
                        }
                ],
                //可修改的用户信息
                userInfor: {
                        //生日
                        BirthDate: '1997-12-13',
                        // 性别
                        sex: {
                                value: 0,
                                list: ['男', '女']
                        },
                        //学历
                        education: '',
                        //身份证件
                        IDCard: '',
                        //职业
                        Profession: '',
                        //住址
                        AddressDetails: '',
                        //婚姻状况
                        marriage: {
                                value: 0,
                                list: ['已婚', '未婚']
                        },
                        //子女描述
                        childDes: '',
                        //子女数量
                        childCount: '',
                        //常去商圈
                        CBD: ''
                },
        },
        /**
         * from表达input组件回调
         */
        fromInput(e){
                this.setData({
                        [e.target.dataset.key]: e.detail.value
                })
                console.log(this.data.formData)
        },
        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function(options) {
                var _this = this;
                //加载是否在线
                this.setData({
                        online: options.online,
                        openId: options.openId
                })
                //GetNewNeedReplyList需要接受一个参数是openid
                wx.showLoading({
                        title: '正在加载数据',
                        mask: true,
                })
                //加载学历自定义表
                wx.$request({
                        url: "/WeMinProPlatJson/GetList",
                        data: {
                                docType: 'combox',
                                actionType: 'Education',
                                needTotal: false,
                        },
                        success(res) {
                                _this.setData({
                                        'educationRange': res,
                                })
                        },
                        complete() { }
                })
                //加载相应数据
                wx.$request({
                        url: "/WeMinProPlatJson/GetDataSet",
                        data: {
                                docType: 'client',
                                actionType: 'Info',
                                needTotal: false,
                                docid: options.openId
                        },
                        success(res) {
                                _this.setData({
                                        formData: res.Table[0],
                                        carList: res.Table1 || [],
                                        labelList: res.Table2 || [],
                                })
                                //更改名称
                                wx.setNavigationBarTitle({
                                        title: `${res.Table[0].CardName ? res.Table[0].CardName : res.Table[0].NickName}`,
                                })
                        },
                        complete() {
                                wx.hideLoading();
                                wx.stopPullDownRefresh();
                        }
                })

        },
        /**
         * 拨打电话
         */
        makePhoneCall(e) {
                wx.makePhoneCall({
                        phoneNumber: e.currentTarget.dataset.panel,
                })
        },
        /**
         * 用户信息保存
         */
        GUID:'',
        sendData: function () {
                let data = this.data.formData;
                //创建一个GUID 这个是用来进行签名保存的
                if(!this.GUID){
                        this.GUID = util.GUID();
                }
                data.UnionGuidTemp = this.GUID;
                //加载相应数据
                wx.$request({
                        url: "/WeMinProRegisterUser/Submit",
                        data,
                        success(res) {
                                wx.showToast({
                                        title: '保存修改成功'
                                })
                        }
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
        onShow: function() {},

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
                this.onLoad({
                        openId: this.data.openId,
                        online: this.data.online,
                })
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