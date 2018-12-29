import { DEDUCTION_TYPE } from '../../../library/sdk/config.js'
import {util} from '../../../library/sdk.js'
Page({
        /**
         * 页面的初始数据
         */
        data: {
                //当前电子券选择类型
                //A01 全部      A02 已选择       A03 未选择
                selectEchatType:'A01',
                //openId
                openId: '',
                //电子券抵扣类型
                DEDUCTION_TYPE: DEDUCTION_TYPE,
                //性别
                sexRange: [{
                                Code: 'A01',
                                Name: '男'
                        },
                        {
                                Code: 'A02',
                                Name: '女'
                        }
                ],
                //会员卡内容
                vipCardRange: [],
                //当前选择会员卡
                vipCardIndex: 0,
                //业务类型
                docTypeRange: [{
                                Code: 'A01',
                                Name: '售后'
                        },
                        {
                                Code: 'A02',
                                Name: '保险'
                        },
                        {
                                Code: 'A03',
                                Name: '其他'
                        },
                ],
                //当前用户数据
                vipUser: {},
                //数据
                formData: {
                        //会员卡
                        VipCode: '',
                        CardName: '',
                        VIN: '',
                        CarNum: "",
                        //业务类型
                        DocType: '',
                        //可用储值
                        AvailableBalance: '',
                        //储值抵扣
                        UseBalance: 0,
                        //实收现款
                        UseCash: 0,
                        //消费总计
                        RctTotal: 0,
                        //电子券抵扣
                        UseECard: 0
                },
                //电子券数量
                ecardList:[],
                //当前电子券类型选择是否吸顶
                menuFixed:false
        },
        /**
         * form回调
         */
        inputSelect(e) {
                let key = e.target.dataset.key;
                let value = e.detail.value;
                //部分需要处理的值
                if (key == 'formData.UseBalance') {
                        let data = this.data.formData;
                        //调整的是储值抵扣
                        //当储值抵扣输入金额大于可用储值的时候,默认为可用储值
                        if (value * 1 > data.AvailableBalance * 1) {
                                value = data.AvailableBalance;
                        }
                        //计算消费总计
                        this.setData({
                                'formData.RctTotal': value * 1 + data.UseCash * 1 + this.data.formData.UseECard*1
                        })
                } else if (key == 'formData.UseCash') {
                        //调整的为是实收现款
                        //计算消费总计
                        this.setData({
                                'formData.RctTotal': value * 1 + this.data.formData.UseBalance * 1 + this.data.formData.UseECard*1
                        })
                }
                this.setData({
                        [key]: value
                })
                console.log(this.data.formData);
        },
        /**
         * 电子券类型选择
         */
        ecardTypeSelect(e){
                this.setData({
                        selectEchatType: e.currentTarget.dataset.key
                })
        },
        /**
         * 获取电子券信息
         */
        getecardList(vipCode) {
                var _this = this;
                wx.$request({
                        url: "/WeMinProVip/GetUseECard",
                        data: {
                                vipCode
                        },
                        success(res) {
                                console.log(res);
                                //对电子券信息进行处理
                                res.forEach(function(item) {
                                        //添加当前是否被选中
                                        //默认为没有选中
                                        item.L1Used = false;
                                        //给相应的类型命名
                                        if (item.L1ECardType == DEDUCTION_TYPE.NUMBER){
                                                item._eCardTypeName = '数量'
                                        }
                                        else if (item.L1ECardType == DEDUCTION_TYPE.AMOUNT){
                                                item._eCardTypeName = '金额'
                                        }
                                })
                                _this.setData({
                                        ecardList: res
                                })
                        }
                })
        },
        /**
         * 点击单个电子券回调
         * 用来控制是否选择当前电子券
         */
        selectEcard(e) {
                let index = e.currentTarget.dataset.index;
                this.setEcardSelect(index);
        },
        /**
         * 更改电子券选择情况
         */
        setEcardSelect(index) {
                let item = this.data.ecardList[index];
                //获取当前电子券抵扣
                // let toal = this.data.formData.UseECard;
                if (item.L1Used){
                        //当选择情况变成false的时候
                        //判断当前类型
                        if (item.L1ECardType == DEDUCTION_TYPE.NUMBER) {
                                if (item.L1LineQty == 1) {
                                        //类型为数量
                                        this.setData({
                                                [`ecardList[${index}].L1LineQty`]: 0
                                        })
                                }
                        }
                        else if (item.L1ECardType == DEDUCTION_TYPE.AMOUNT) {
                                //类型为金额
                        }
                }else{
                        //当选择情况变成true的时候
                        //判断当前类型
                        if (item.L1ECardType == DEDUCTION_TYPE.NUMBER) {
                                if (item.L1LineQty==0){
                                        //类型为数量
                                        this.setData({
                                                [`ecardList[${index}].L1LineQty`]: 1
                                        })
                                }
                        }
                        else if (item.L1ECardType == DEDUCTION_TYPE.AMOUNT) {
                                //类型为金额
                        }
                }
                this.setData({
                        [`ecardList[${index}].L1Used`]:!this.data.ecardList[index].L1Used
                })
                //计算电子券抵扣
                this.calculate();
        },
        /**
         *  点击更改电子券回调 
         */
        ecardTotalFocus(e) {
                //获取当前索引值
                let index = e.currentTarget.dataset.index;
                //这里是为了输入方便,当为0的时候,点击就直接可以输入了,不用删掉0 了
                if (e.detail.value == 0) {
                        //判断当前类型
                        if (this.data.ecardList[index].L1ECardType == DEDUCTION_TYPE.NUMBER){
                                //类型为数量
                                this.setData({
                                        [`ecardList[${index}].L1LineQty`]: ''
                                })
                        }
                        else if (this.data.ecardList[index].L1ECardType == DEDUCTION_TYPE.AMOUNT){
                                //类型为金额
                                this.setData({
                                        [`ecardList[${index}].L1LineTotal`]: ''
                                })
                        }
                }
        },
        /**
         * 更改电子券使用回调
         */
        ecardTotalBlur(e) {
                let data = this.data.formData;
                let index = e.currentTarget.dataset.index;
                let value = e.detail.value*1;
                let item = this.data.ecardList[index];
                let key = '';
                let keyLine = '';
                //判断当前类型   这个函数用来处理编写数据符合规定的
                if (this.data.ecardList[index].L1ECardType == DEDUCTION_TYPE.NUMBER) {
                        //类型为数量
                        key = 'L1Qty';
                        keyLine = 'L1LineQty';
                }
                else if (this.data.ecardList[index].L1ECardType == DEDUCTION_TYPE.AMOUNT) {
                        //类型为金额
                        key = 'L1Total';
                        keyLine = 'L1LineTotal';
                }
                //判断当前电子券是否需要被选取  默认为不选择,    
                let isSelect = false;
                //这里的input是number类型
                if (!value || value < 0) {
                        //判断当没有value时,赋值为0 
                        value = 0;
                } else if (value > item[key]*1) {
                        //若是当前输入的金额大于电子券金额,则默认为电子券金额
                        value = item[key];
                        //当输入的值最终大于0的时候,表示默认选择这个电子券
                        isSelect = true;
                } else {
                        //当正好符合输入要求
                        //否则需要更新对应formData的NewTotal，这里不需要使用setData,因为不需要更新到视图上
                        //当输入的值最终大于0的时候,表示默认选择这个电子券
                        isSelect = true;
                }
                //*1 是为了让字符串变成数字
                this.setData({
                        [`ecardList[${index}].${keyLine}`]: value,
                        [`ecardList[${index}].L1Used`]: isSelect,
                })
                //计算电子券抵扣
                this.calculate();
        },
        /**
         * 选择会员卡回调
         */
        vipCardCall(e) {
                //获取会员卡组的索引
                let index = e.detail.value;
                //更新持卡人  车牌号  VIN ,以及电子券的状态
                this.vipCardUpData(index);
        },
        /**
         * 计算电子券抵扣
         */
        calculate(){
                let list = this.data.ecardList;
                let total = 0;
                for(let x of list){
                        if (x.L1Used){
                                total += x.L1LineTotal * x.L1LineQty;
                        }
                }
                //同时添加到消费总计中
                this.setData({
                        'formData.RctTotal': this.data.formData.RctTotal+total-this.data.formData.UseECard,
                        'formData.UseECard': total
                })
        },
        /**
         * 更新持卡人  车牌号  VIN的状态
         */
        vipCardUpData(index) {
                let dataList = this.data.vipCardRange[index];
                this.setData({
                        'formData.VipCode': dataList.VipCode,
                        'formData.CardName': dataList.CardName,
                        'formData.VIN': dataList.VIN,
                        'formData.CarNum': dataList.CarNum,
                        'formData.AvailableBalance': dataList.AvailableBalance,
                        'formData.CarId': dataList.CarId,
                        //消费总计      清空
                        'formData.RctTotal': 0,
                        //电子券抵扣      清空
                        'formData.UseECard': 0,
                        //储值抵扣
                        'formData.UseBalance': 0,
                        //实收现款
                        'formData.UseCash': 0,
                });
                //更新电子券数据
                this.getecardList(dataList.VipCode);
        },
        /**
         * 数据提交
         */
        sendData(){
                wx.showLoading({
                        title: '数据获取中',
                        mask: true
                })
                let data = this.data.formData;
                data.List =JSON.stringify(this.data.ecardList);
                data.UnionGuidTemp = util.GUID();
                data.UnionGuid = util.GUID();
                console.log(data)
                ///根据扫码信息获得会员信息
                wx.$request({
                        url: "/WeMinProVip/ConsumeRelease",
                        data,
                        success(res) {
                                console.log(res)
                        },
                        complete() {
                                wx.hideLoading()
                        }
                })
        },
        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function(options) {
                let _this = this;
                //获取绑定 的openid
                this.setData({
                        openId: options.openId
                })
                wx.showLoading({
                        title: '加载中',
                        mask: true
                })
                //根据扫码信息获得会员信息
                wx.$request({
                        url: "/WeMinProVip/GetSingleVip",
                        data: {
                                scanCode: options.openId
                        },
                        success(res) {
                                console.log(res)
                                let rangeList = res.VipCard;
                                //这里需要处理一下数据,将数据整理成Code Name类型的
                                for (let x of rangeList) {
                                        x.Name = `${x.CarNum} - ${x.CardName} - ${x.VipCode}`
                                }

                                _this.setData({
                                        vipCardRange: rangeList,
                                        vipUser: res.VipUser
                                })
                                //持卡人等信息赋值
                                _this.vipCardUpData(0);

                        },
                        failCall() {
                                //出现问题,则跳到首页
                                wx.switchTab({
                                        url: '/pages/tabBar/user'
                                })
                        },
                        complete() {
                                wx.hideLoading()
                        }
                })

        },
        //判断当前电子券选择类型距离页面顶端的高度
        menuTop:0,
        //页面滚动触发
        onPageScroll(e){
                if (this.data.menuFixed == (e.scrollTop*1 > this.menuTop*1)) {return;}
                // 3.当页面滚动距离scrollTop > menuTop菜单栏距离文档顶部的距离时，菜单栏固定定位
                this.setData({
                        menuFixed: (e.scrollTop*1 > this.menuTop*1)
                })
        },
        /**
         * 生命周期函数--监听页面初次渲染完成
         */
        onReady: function() {
                var _this = this;
                var query = wx.createSelectorQuery()
                query.select('#page-Ecard-tap').boundingClientRect()
                query.exec(function (res) {
                        console.log(res[0].top);
                        _this.menuTop = res[0].top;
                })
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