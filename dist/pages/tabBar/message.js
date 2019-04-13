import msgBroadcast from '../../library/sdk/msgBroadcast.js'
import {
    CHAT_CONST,
    util,
    configUrl
} from '../../library/sdk.js'
Page({
    /**
     * 页面的初始数据
     */
    data: {
        dataList: [],
        //图片数据
        imgUrl: getApp().privateData.configUrl.imgUrl,
        //获取聊天常量
        CHAT_CONST: CHAT_CONST,
        //分页功能
        pageOver: false,
        //出现删除标志的index
        delIndex: -1
    },
    /**
     * 本地虚拟缓存
     */
    storageData: [],
    /**
     * 页面点击事件
     */
    bodyTap() {
        //当点击任意一个地方的时候，是需要将删除模式取消的
        if (this.data.delIndex != -1) {
            this.setData({
                delIndex: -1
            })
        }
    },
    /**
     * 长按事件属性
     */
    //当前是否触发了长按
    itemLong: false,
    //时间数，用于中断时间
    itemTime: [],
    /**
     * 点击信息触摸开始
     */
    itemTouchStart(e) {
        // console.log(e);
        //这里是表示，只允许首个手指进入会触发事件
        // if (e.changedTouches[0].identifier!=0){return}
        //在安卓机上，如果在长按状态下下拉刷新，会导致触摸结束事件未触发，itemLong未被重置
        if (this.itemTime.length != 0) {
            this.itemLong = false
        }
        let tiem = setTimeout(() => {
            //更改状态
            this.itemLong = true;
            // console.log('长按触发');
            this.setData({
                delIndex: e.currentTarget.dataset.index
            })
            //震动
            wx.vibrateShort();
        }, 500);
        this.itemTime.push(tiem);
    },
    /**
     * 点击信息触摸结束
     */
    itemTouchEnd(e) {
        // console.log(e);
        //保证只有在触发了touchStart的情况下才可以触发此事件
        if (this.itemTime.length == 0) {
            return
        }
        if (this.itemLong) {
            //当前是长按状态
            //重置状态
            this.itemLong = false
        } else {
            //当前不是长按状态下,取消长按事件
            this.itemTime.forEach(function(item) {
                clearTimeout(item);
            })
            //运行事件
            wx.navigateTo({
                url: e.currentTarget.dataset.url
            })
        }
        //清空延时缓存
        this.itemTime.length = 0;
    },
    /**
     *点击信息
     */
    itemTouchTap(e) {
        //如果当前已经触发了长按,则当前事件失效,并且取消当前单击事件
        // if (this.itemLong) {
        //         this.itemLong=false
        //         return
        // }
        // wx.navigateTo({
        //         url: e.currentTarget.dataset.url
        // })
    },
    /**
     *删除当前信息
     */
    delItem(e) {
        let index = e.currentTarget.dataset.index;
        // console.log(index);
        this.data.dataList.splice(index, 1)
        this.setData({
            dataList: this.data.dataList,
            //重置删除标记
            delIndex: -1
        })
        //更新虚拟缓存
        this.storageData = this.data.dataList;
        //更新真实缓存
        this.dataSetStorage()
    },
    /**
     * 获取数据(聊天列表)
     */
    page: {
        start: 0,
        limit: 25
    },
    /**
     *  更新红点 
     */
    refreshBadge() {
        //当未读消息大于0为消息的右上角添加未读消息数量
        if (this.pendCount > 0) {
            wx.setTabBarBadge({
                index: 0,
                text: `${this.pendCount}`
            })
        }
    },
    /**
     * 信息广播接收者
     */
    //个人标识ID
    onMeId: undefined,
    //全部红点数量
    pendCount: 0,
    getData(dataReset = false, callback) {
        //消息红点为0的消息列表
        var PendCountList = [];
        //数据重置
        if (dataReset) {
            //红点清空
            this.pendCount = 0;
            let meDataList = this.data.dataList;
            //获取当前信息红点为0的信息
            for (let i = 0; i < meDataList.length; i++) {
                if (meDataList[i].PendCount == 0) {
                    PendCountList.push(meDataList[i]);
                }
            }
            //如果当前存在为红点为0的数据,则将这些数据添加到列表的前面
            this.setData({
                pageOver: false,
                dataList: PendCountList,
            })
            this.page.start = 0;
        }
        //数据全部加载后阻止
        if (this.data.pageOver) {
            return;
        }
        let _this = this;

        wx.$request({
            url: "/WeMinProChatMessage/GetNeedReplyList",
            data: {
                start: this.page.start,
                limit: this.page.limit,
            },
            success(res) {
                if (res.length < _this.page.limit) {
                    //数据以全部拉取完成
                    _this.setData({
                        pageOver: true
                    })
                }
                /**
                 * 这里需要整理数据
                 */
                let meData = res;
                for (let i = 0; i < meData.length; i++) {
                    //转化时间为小程序时间
                    meData[i].MsgDate = util.dateParse(meData[i].MsgDate);
                    //计算全部未读消息数量
                    _this.pendCount += meData[i].PendCount;
                }
                //当未读消息大于0为消息的右上角添加未读消息数量
                _this.refreshBadge()
                //数据更新但不更新视图 用来解决页面更新抖动问题
                _this.data.dataList = _this.data.dataList.concat(res)
                // _this.setData({
                //         dataList: _this.data.dataList.concat(res)
                // })
                // 与数据池中进行合并
                _this.dataMerge()
                _this.page.start += _this.page.limit;
                //启动轮询获取数据
                callback && callback();
            },
            complete() {
                wx.stopPullDownRefresh();
            }
        })
    },
    /**
     * 获取数据
     */
    // isDestroy: false,
    getMsgList() {
        var _this = this;
        wx.$msgBroadcast.add('message', function(msgList) {
            //获取本地带回消息列表
            let dataDataList = _this.data.dataList;
            //遍历返回的消息池
            var forList = msgList;
            //将最新的数据赋值到待回复的消息列表中
            for (let i = 0; i < forList.length; i++) {
                let item = forList[i];
                var index = util.find(dataDataList, "OpenId", item.OpenId)
                //只有当获取数据的时间大于当前消息列表(获取的时间是最新的时候)上的时间的时候，才将消息赋值上去
                if (index >= 0 && util.dateTo(item.CreateDate) > util.dateTo(dataDataList[index].CreateDate)) {
                    //判断如果当前信息是客服发送
                    if (item.FromType === CHAT_CONST.CHAT_RIGHT) {
                        //减去消息右上角相应的数量
                        _this.pendCount -= dataDataList[index].PendCount;
                        //为客服消息则去掉红点
                        dataDataList[index].PendCount = 0;
                    } else {
                        //客户信息添加一个红点
                        dataDataList[index].PendCount++;
                        //加上消息右上角相应的数量
                        _this.pendCount++;
                        //更新消息红点
                        _this.refreshBadge()
                    }
                    //如果最新消息池中与本地带回消息列表中存在同一个用户,则将直接赋值到用户上
                    dataDataList[index].MsgDate = util.dateParse(item.MsgDate);
                    dataDataList[index].MsgType = item.MsgType;
                    dataDataList[index].MsgData = item.MsgData;
                } else {
                    //如果本地待会消息中没有最新消息池中的数据,则需要调用获取客户消息方法获取客户头像等,然后添加入本地带回消息中
                    // GetNewNeedReplyList需要接受一个参数是openid
                    wx.$request({
                        url: "/WeMinProChatMessage/GetNewNeedReplyList",
                        data: {
                            bean: item.OpenId
                        },
                        success(res) {
                            //转化时间
                            for (let i = 0; i < res.length; i++) {
                                //转化时间
                                res[i].MsgDate = util.dateParse(res[i].MsgDate);
                                //更新红点个数
                                //只有在登录的用户才会计入红点中
                                // if (res[i].Online){}
                                _this.pendCount += res[i].PendCount;
                            }
                            //更新红点
                            _this.refreshBadge();
                            //成功则将返回的信息添加一个新的本地带回消息
                            dataDataList = dataDataList.concat(res);
                            //数据更新 
                            // _this.data.dataList = dataDataList;
                            _this.setData({
                                dataList: dataDataList
                            })
                            //将数据缓存
                            _this.dataSetStorage();
                        }
                    })
                }
                //数据更新 
                // _this.data.dataList = dataDataList;
                _this.setData({
                    dataList: dataDataList
                })
                //将数据缓存
                _this.dataSetStorage();
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var _this = this;
        //初始化消息广播
        msgBroadcast.init();
        this.getData(true, function() {
            //运行数据轮询获取
            _this.getMsgList()
        });
        //加载个人信息
        getApp().loadInfo(function() {
            _this.onMeId = getApp().privateData.loginInfo.DeptCode
        })
        //读取缓存信息
        _this.dataGetStorage();
    },
    /**
     * 将信息列表缓存到物理硬盘上
     */
    dataSetStorage() {
        let privateData = getApp().privateData;
        wx.setStorage({
            key: `${privateData.loginInfo.CmpCode}-${privateData.loginInfo.DeptCode}-msgList`,
            data: this.data.dataList,
        })
        //并将数据暂时更新到变量中,用于之后的与数据池合并
        //因为，为了保证性能,从物理硬盘中读取数据只是在启动的时候，加载一次
        //接下来就会用storageData替代
        this.storageData = this.data.dataList
    },
    /**
     * 读取存储的信息列表
     */
    dataGetStorage() {
        var _this = this;
        let privateData = getApp().privateData;
        wx.getStorage({
            key: `${privateData.loginInfo.CmpCode}-${privateData.loginInfo.DeptCode}-msgList`,
            success: function(res) {
                let data = res.data;
                _this.storageData = data
                // 与数据池中进行合并
                _this.dataMerge()
            },
            //无论因为什么原因读取失败都将忽略
            fail(res) {
                console.log(res)
            }
        })
    },
    /**
     * 进行数据合并(数据池与缓存进行合并)
     */
    dataMerge() {
        let dataList = this.data.dataList;
        let storageData = this.storageData;
        //循环读取数据池函数
        for (let item of dataList) {
            let index = util.find(storageData, "OpenId", item.OpenId);
            if (index >= 0) {
                //当数据池中存在的OpendId的也在缓存中存在时,以数据池为主
                storageData[index] = item;
            } else {
                storageData.push(item)
            }
        }
        this.storageData = storageData;
        this.setData({
            dataList: storageData
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
        // this.getData();
        //更新消息红点
        this.refreshBadge()
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {},

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {
        this.getData(true)
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        this.getData()
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },
})