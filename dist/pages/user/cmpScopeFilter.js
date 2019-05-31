// pages/user/cmpScopeFilter.js
import { CMP_CAR} from "../../library/sdk/config.js"
Page({

    /**
     * 页面的初始数据
     */
    data: {
        //获取的数据
        formList: []
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
                    if (!childList[item.BrandType]){
                        //当不存在这个系列的时候
                        childList[item.BrandType] = [];
                    }
                    childList[item.BrandType].push(item);
                }
                console.log(dataList)
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
     * 保存
     */
    submit() {
        console.log(this.data.formList);
        //需要对上传数据进行处理
        wx.$request({
            url: '/WeMinProPlatJson/Submit',
            data: {
                docType: 'Main',
                actionType: 'SubmitCsf',
                docJson: JSON.stringify({
                    'List': this.data.formList,
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
            [`formList[${e.currentTarget.dataset.index}].IsAuth`]: !e.currentTarget.dataset.isauth
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