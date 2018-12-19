// pages/user/cardCustomer.js
Page({
        /**
         * 页面的初始数据
         */
        data: {
                //openId
                openId:'',
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
                userInfor: {
                        //会员编号
                        CardCode: {
                                value: 0,
                                list: []
                        },
                        //会员名称
                        CardName: "",
                        //会员OpenId
                        OpenId: '',
                        WxId: '',
                        //车牌号
                        CarNum: "",
                        //VIN
                        VIN: "",
                        //业务类型
                        DocType: {
                                value: -1,
                                list: [{
                                        key: 'A01',
                                        value: '售后'
                                }, {
                                        key: 'A02',
                                        value: '保险'
                                }, {
                                        key: 'A03',
                                        value: '其他'
                                }]
                        },
                        //储值金额
                        StoredTotal: 0,
                },
                //已选择的电子券
                formData: [],
                //电子券抵扣数额
                dedTotal: 0,
                //消费总额
                consumeTotal: 0,
                //储值抵扣
                dedStored: 0,
                //实收现款
                cashTotal: 0,
                //选择电子券列表
                echatList: [],
                //控制电子券选择是否出现
                selectEchatList: false,


                //会员卡内容
                vipCardRange:[],
                //当前选择会员卡
                vipCardIndex:0,
                //数据
                formData:{
                        //会员卡
                        VipCode:'',
                        CardName:'',
                        VIN:'',
                        CarNum:""
                }
        },
        /**
         * 自定义事件回调
         */
        input(e) {
                console.log(e);
        },
        /**
         * 双向绑定事件回调
         */
        inputCall(e) {
                let selectDomKey = e.target.dataset.key;
                //用来判断是点击的那个下拉框的
                let selectDomName = e.target.dataset.name;
                this.setData({
                        [selectDomKey]: e.detail.value
                })
                //当点击下拉框为会员编号时
                if (selectDomName == 'CardCode') {
                        let dataList = this.data.userInfor.CardCode.list[e.detail.value];
                        //添加车牌号，VIN ，可用储值
                        this.setData({
                                'userInfor.CarNum': dataList.CarNum,
                                'userInfor.VIN': dataList.VIN,
                                'userInfor.StoredTotal': dataList.AvailableBalance,
                                //将储值抵扣数量与选择的电子券 消费总计与卡券抵扣 进行清空
                                'consumeTotal': 0,
                                'dedStored': 0,
                                'dedTotal': 0,
                                formData: []
                        })
                        //更新电子券数据
                        this.getEchatList();
                }
        },
        /**
         *  点击选择电子券 
         */
        selectEcard() {
                //这里是测试,点击选择电子券之后,将给与默认回调
                //这里的抵扣类型是先自定的
                //A01:数额
                //A02:数量
                selectEcardShow();
                // this.ecardBackCall([
                //   { Total: 500, Name: '500元保养券', DocType: 'A01', Id: 1 },
                //   { Total:300,Name:'300元一次性抵扣券',DocType:'A02',Id:2}
                // ])
        },
        /**
         * 选择电子券回调
         */
        ecardBackCall(data) {
                //计算抵扣数额
                let meDedTotal = 0
                //这里进行对数据处理,然后回调给前面
                for (let i = 0; i < data.length; i++) {
                        let item = data[i];
                        if (item.DocType == 'A01') {
                                //表示为数额的时候,给予属性NewTotal 默认值为0 表示当前使用
                                item.NewTotal = 0;
                                item.DocTypeName = '数额';
                        } else if (item.DocType == 'A02') {
                                //表示为数量的时候,给予属性NewTotal 默认值为当前券的金额
                                item.NewTotal = item.Total * 1;
                                item.DocTypeName = '数量';
                        }
                        //这里进行计算,计算全部电子券的抵扣数额,并且赋值到相应为抵扣位置上去
                        meDedTotal += item.NewTotal;
                }
                //将数据进行赋值到页面
                this.setData({
                        formData: data || [],
                        dedTotal: meDedTotal
                })
        },
        /**
         *  电子券获得焦点的时候 
         */
        EcardTotalFocus(e) {
                let index = e.currentTarget.dataset.index;
                //这里是为了输入方便,当为0的时候,点击就直接可以输入了,不用删掉0 了
                if (e.detail.value == 0) {
                        this.setData({
                                [`formData[${index}].NewTotal`]: ''
                        })
                }
        },
        /**
         * 修改电子券
         */
        EcardTotal(e) {
                let index = e.currentTarget.dataset.index;
                let value = e.detail.value;
                let item = this.data.formData[index];
                //选取出未修改的金额来,用于之后的计算抵扣数额
                let oldTotal = item.NewTotal;
                //这里是修改后的金额,用于之后的计算抵扣数额
                let newTotal = 0;
                //这里的input是number类型
                if (!value || value < 0) {
                        //判断当没有value时,赋值为0 
                        this.setData({
                                [`formData[${index}].NewTotal`]: 0
                        })
                        newTotal = 0;
                } else if (value > item.Total) {
                        //若是当前输入的金额大于电子券金额,则默认为电子券金额
                        this.setData({
                                [`formData[${index}].NewTotal`]: item.Total
                        })
                        newTotal = item.Total;
                } else {
                        //否则需要更新对应formData的NewTotal，这里不需要使用setData,因为不需要更新到视图上
                        item.NewTotal = value;
                        newTotal = value;
                }
                //这里需要进行计算抵扣数额
                //计算方法是用当前抵扣总额减去修改前金额,加上修改后金额
                //*1 是为了让字符串变成数字
                this.setData({
                        dedTotal: this.data.dedTotal * 1 - oldTotal * 1 + newTotal * 1
                })
        },
        /**
         * 储值与实收
         */
        totalBlur(e) {
                let key = e.currentTarget.dataset.key;
                let value = e.detail.value * 1;
                //不存在则默认为0
                if (!key) {
                        value = 0;
                }
                if (key == 'dedStored') {
                        //当为储值抵扣且输入金额大于可用储值的时候,默认为可用储值
                        if (value > this.data.userInfor.StoredTotal * 1) {
                                this.setData({
                                        dedStored: this.data.userInfor.StoredTotal
                                })
                                value = this.data.userInfor.StoredTotal;
                        }
                }
                //更新数据但是不用使用setData
                this.data[key] = value;
                //并且计算消费总计
                this.setData({
                        'consumeTotal': this.data.dedStored * 1 + this.data.cashTotal * 1
                })
        },
        /**
         * 电子券选择确定按钮
         */
        selectEcardConfirm() {
                let selectList = [];
                let meCheckList = this.checkList;
                let dataList = this.data.echatList;
                for (let i = 0; i < meCheckList.length; i++) {
                        selectList.push(dataList[meCheckList[i]]);
                }
                //调用回调事件
                this.ecardBackCall(selectList);
                //电子券关闭
                this.selectEcardHidden();
        },
        /**
         * 选择电子券打开
         */
        selectEcardShow() {
                //获取电子券信息
                this.setData({
                        selectEchatList: true
                })
        },
        /**
         * 选择电子券关闭
         */
        selectEcardHidden() {
                this.setData({
                        selectEchatList: false
                })
        },
        /**
         * 卡券选框回调
         */
        //当前的选框选择情况
        checkList: [],
        checkChange(e) {
                // let valueList = e.detail.value;
                // console.log(e)
                // // 这里触发这个方法的时候,新的选择框数量只有两种可能,大于,小于
                // //当新的选择框数量大于上一次选择框数量,表示需要将相应的false变成true
                // if (valueList.length>this.checkList.length){
                //   //而且新数据的最后一个就是添加数据的索引
                //   this.data.echatList[valueList[valueList.length-1]].check = true;
                // }else{
                //   //当新的选择框数量小于上一次选择框数量,表示需要将相应的true变成false
                //   for (let i = 0; i < this.checkList.length;i++){
                //     if(valueList.indexOf(this.checkList[i])<0){
                //       //不存在的那个就是需要从true变成false的那个

                //     }
                //   }
                // }
                //回调内容为全部为对勾的索引
                this.checkList = e.detail.value;
        },
        /**
         * 获取卡券信息
         */
        getEchatList() {
                var _this = this;
                _this.data.echatList.length = 0;
                _this.checkList.length = 0;
                this.myLlbox.init({
                        url: "/WeMinProPlatJson/GetList",
                        data: {
                                docType: 'cardCustomer',
                                actionType: 'EchatList',
                                docid: this.data.userInfor.CardCode.list[this.data.userInfor.CardCode.value].VIPCardNum,
                                p1: 'A01',
                        },
                        success(res) {
                                //对卡券信息进行处理
                                res.forEach(function (item) {
                                        item.check = false;
                                        if (item.DocType == 'A01') {
                                                item.DocTypeName = '数额';
                                        } else if (item.DocType == 'A02') {
                                                item.DocTypeName = '数量';
                                        }
                                })
                                //合并需要保留之前选择框选择情况
                                _this.data.echatList.forEach(function (item, index) {
                                        if (_this.checkList.indexOf(index + '') >= 0) {
                                                item.check = true;
                                        } else {
                                                item.check = false;
                                        };
                                })
                                _this.setData({
                                        echatList: _this.data.echatList.concat(res)
                                })
                        }
                });
        },
        /**
         * 卡券选择滚动加载
         */
        scrolltolower() {
                this.myLlbox.request();
        },
        /**
         * 选择会员卡回调
         */
        vipCardCall(e){
                //获取会员卡组的索引
                let index = e.detail.value;
                //更新持卡人  车牌号  VIN的状态
                this.vipCardUpData(index);
        },
        /**
         * 更新持卡人  车牌号  VIN的状态
         */
        vipCardUpData(index){
                let dataList = this.data.vipCardRange[index];
                this.setData({
                        'formData.VipCode': dataList.VipCode,
                        'formData.CardName': dataList.CardName,
                        'formData.VIN': dataList.VIN,
                        'formData.CarNum': dataList.CarNum,
                })
        },
        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function(options) {
                let _this = this;
                //
                this.setData({
                        openId: options.openId
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
                                for (let x of rangeList){
                                        x.Name = `${x.CarNum} - ${x.CardName} - ${x.VipCode}`
                                }
                                _this.setData({
                                        vipCardRange: rangeList,
                                })
                                //持卡人等信息复制
                                _this.vipCardUpData(0)
                        },
                        failCall(){
                                //出现问题,则跳到首页
                                wx.switchTab({
                                        url:'/pages/tabBar/user'
                                })
                        }
                })    
                // //获取自定义组件
                // this.myLlbox = this.selectComponent('#myLlbox');
                // wx.showLoading({
                //         title: '加载中',
                //         mask: true
                // })
                // wx.$request({
                //         url: "/WeMinProPlatJson/GetDataSet",
                //         data: {
                //                 docType: 'cardCustomer',
                //                 actionType: 'Create',
                //                 docid: options.id,
                //                 needTotal: false,
                //         },
                //         success(res) {
                //                 //基础信息
                //                 let baseData = res.Table[0];
                //                 _this.setData({
                //                         'userInfor.CardName': baseData.CardName,
                //                         'userInfor.OpenId': baseData.OpenId,
                //                         'userInfor.WxId': baseData.WxId,
                //                         'userInfor.CardCode.list': res.Table1,
                //                         //为其赋值一个默认值,默认为第一个会员卡信息
                //                         'userInfor.CarNum': res.Table1[0].CarNum,
                //                         'userInfor.VIN': res.Table1[0].VIN,
                //                         'userInfor.StoredTotal': res.Table1[0].AvailableBalance,
                //                 })
                //                 //更新电子券数据
                //                 _this.getEchatList();
                //         },
                //         complete() {
                //                 wx.hideLoading()
                //         }
                // })
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