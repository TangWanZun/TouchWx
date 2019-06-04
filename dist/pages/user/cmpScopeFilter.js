// pages/user/cmpScopeFilter.js
import { CMP_CAR} from "../../library/sdk/config.js"
Page({

    /**
     * 页面的初始数据
     */
    data: {
        //获取的数据
        formList: [],
        CMP_CAR: CMP_CAR
    },

    /*
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.getData(true)
    },
    //这个是用于提交的数据，是不需要放置到data中的
    // submitList:[],
    /**
     * 数据加载
     */
    getData(refresh = false) {
        if (refresh) {
            this.setData({
                formList: []
            })
            wx.showLoading({
                title: '数据加载中',
            })
        }
        //是否强制刷新refresh
        wx.$request({
            url: '/WeMinProPlatJson/GetList',
            data: {
                docType: 'Main',
                actionType: 'CmpScopeFilter',
                needTotal: false
            },
            success: (res) => {

                //将上传数据的默认的不选中
                //因为  微信小程序中 只会返回选中的值
                // for(let item of res){
                //     let pushItem =Object.assign({},item,{
                //         IsAuth: false
                //     })
                //     this.submitList.push(pushItem)
                // }

                let dataList = {};
                for (let i in res){
                    let item = res[i];
                    //不存在父节点的为根节点
                    if (!item.GroupCode){
                        dataList[item.CmpCode] = Object.assign(dataList[item.CmpCode]||{},{
                            CmpCode: item.CmpCode,
                            CmpName: item.CmpName,
                            IsAuth: item.IsAuth,
                            list: {}
                        })
                        continue
                    }
                    //表示存在父节点的公司
                    if (!dataList[item.GroupCode]){
                        //没有当前公司的父公司的时候创建一个父公司
                        dataList[item.GroupCode] = {
                            CmpCode: item.GroupCode,
                            list:{}
                        };
                    }
                    let childList = dataList[item.GroupCode].list;
                    //对系列进行分类
                    if (!childList[item.BrandType]){
                        //当不存在这个系列的时候
                        childList[item.BrandType] = {
                            //默认为选中状态
                            IsAuth:1,
                            //是否已经收起来了
                            _isShow:true,
                            list:[]
                        };
                    }
                    if (!item.IsAuth){
                        //当有一个子项为不存在的时候
                        childList[item.BrandType].IsAuth = 0;
                    }
                    childList[item.BrandType].list.push(item);
                }
                // console.log(dataList)
                this.setData({
                    formList: dataList
                })
            },
            complete() {
                if (refresh) {
                    wx.hideLoading();
                } else {
                    wx.stopPullDownRefresh();
                }

            }
        })
    },
    /**
     * 重置
     */
    reset() {
        wx.showModal({
            title: '提示',
            content: "确定重置数据",
            success: res => {
                if (res.confirm) {
                    //需要对上传数据进行处理
                    wx.$request({
                        url: '/WeMinProPlatJson/Submit',
                        data: {
                            docType: 'Main',
                            actionType: 'ResetCsf',
                        },
                        success: (res) => {
                            console.log(res)
                            //重新获取数据
                            this.getData(true);
                        },
                        complete() {
                            wx.stopPullDownRefresh();
                        }
                    })
                }
            }
        })
    },
    /**
     * 点击父公司的钩子
     */
    changeRootCheck(e){
        //公司根
        let root = e.currentTarget.dataset.root;
        //当前类型
        let rootObj = this.data.formList[root];
        //改变当前的钩子的点击
        let check = rootObj.IsAuth = !(rootObj.IsAuth);
        let checkList = rootObj.list;
        //当前为点击选中了  
        //将子模块全选
        for (let i in checkList) {
            this.changeCarTypeCheck({
                currentTarget:{
                    dataset:{
                        root: root,
                        cartype: i
                    }
                }
            })
            checkList[i].IsAuth = 1;
        }
        
    },
    /**
     * 点击汽车类型的钩子
     */
    changeCarTypeCheck(e){
        //公司根
        let root = e.currentTarget.dataset.root;
        //汽车类型
        let cartype = e.currentTarget.dataset.cartype;
        //当前类型
        let carTypeObj = this.data.formList[root].list[cartype];
        //改变当前的钩子的点击
        let check = carTypeObj.IsAuth = !(carTypeObj.IsAuth);
        let checkList = carTypeObj.list;
        for (let i in checkList){
            checkList[i].IsAuth = check;
        }
        // 更新数据
        this.setData({
            [`formList.${root}.list.${cartype}`]: carTypeObj
        })
    },
    /**
     * 点击汽车类型右侧的打开
     */
    tapRightImage(e){
        //公司根
        let root = e.currentTarget.dataset.root;
        //汽车类型
        let cartype = e.currentTarget.dataset.cartype;
        //当前类型
        let carTypeObj = this.data.formList[root].list[cartype];


        this.setData({
            [`formList.${root}.list.${cartype}._isShow`]: !carTypeObj._isShow
        })
    },
    /**
     * 用来监控每个车类型下下面的全部打勾的
     */
    cartypeBindChange(e){
        //获取全部打勾的公司
        let valueList = e.detail.value;
        //公司根
        let root = e.currentTarget.dataset.root;
        //汽车类型
        let cartype = e.currentTarget.dataset.cartype;
        //获取当前汽车类型下的全部数据
        let list = this.data.formList[root].list[cartype].list;
        if (valueList.length == list.length){
            //表示该汽车类型下的全部公司都已经打勾了
            //则该类型也是需要打勾的
            this.setData({
                [`formList.${root}.list.${cartype}.IsAuth`]:1
            })
        }else{
            this.setData({
                [`formList.${root}.list.${cartype}.IsAuth`]: 0
            })
        }
    },
    /**
     * 点击cmp
     */
    cmpBindChange(e){
        //公司根
        let root = e.currentTarget.dataset.root;
        //汽车类型
        let cartype = e.currentTarget.dataset.cartype;
        // 公司索引
        let index = e.currentTarget.dataset.index;
        this.setData({
            [`formList.${root}.list.${cartype}.list[${index}].IsAuth`]: !this.data.formList[root].list[cartype].list[index].IsAuth
        })
    },
    /**
     * 保存
     */
    submit() {
        // console.log(this.data.formList);
        let formList = this.data.formList;
        let list = []
        //root
        for (let i in formList){
            list.push({
                CmpCode: formList[i].CmpCode,
                CmpName: formList[i].CmpName,
                IsAuth: 1
            })
            //汽车类型
            for (let j in formList[i].list){
                //公司
                for(let item of formList[i].list[j].list){
                    list.push(item)
                }
            }
        }
        // console.log(list)
        //需要对上传数据进行处理
        wx.$request({
            url: '/WeMinProPlatJson/Submit',
            data: {
                docType: 'Main',
                actionType: 'SubmitCsf',
                docJson: JSON.stringify({
                    'List': list
                })
            },
            success: (res) => {
                //重新获取数据
                this.getData(true);
            },
            complete() {
                wx.stopPullDownRefresh();
            }
        })
    },
    /**
     * 多选单项改变
     */
    changeCheck(e) {
        this.setData({
            [`formList[${e.currentcurrentTarget.dataset.index}].IsAuth`]: !e.currentcurrentTarget.dataset.isauth
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
        //控制首页页面刷新
        var pages = getCurrentPages();
        if (pages.length > 1) {
            //上一个页面实例对象 
            var prePage = pages[pages.length - 2];
            //关键在这里,这里面是触发上个界面的方法 
            prePage.getData()
        }
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