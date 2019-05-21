// pages/client/clientDetails/label.js
import {
    find
} from './../../../library/sdk/util.js'
Page({
    /**
     * 页面的初始数据
     */
    data: {
        labelMap: {},
        formList: [],
        openId: '',
        topInputValue: '',
        //当前删除的个数
        delCount: 0,
        //标签库是否出现
        labelLibShow: false,
        //标签库左侧列表
        labelLeftList: [],
        //选择的标签库左侧列表的index  默认为第一个
        labelLeftIndex: 0,
        //标签库右侧列表
        labelRightList: [],
        //当前添加个数
        addCount: 0
    },
    //手动点击保存的时间戳
    sendTime:0,
    /**
     * input信息同步
     */
    inputSelect(e) {
        //当数据获取的时候,是不需要更新的
        this.data.topInputValue = e.detail.value;
    },
    /**
     * 添加标签
     */
    addLabel(e) {
        let value = this.data.topInputValue;
        //字符串拆分，比如输入A,B,C 或 A B C 或 A，B，C 则都为3个标签。js正则表达式后面/g是多匹配的意思
        var re = /([^ \f\n\r\t\v`~!@#$%^&*()=\+\\\|{}\[\]'";:,<.>//?·！￥……（）——、【】｛｝‘’“”；：、？。》，《]|\d)+/g; //排除空格换行以及各种特殊字符
        var textTagValueArray = value.match(re);
        //当添加标签的数据为空的时候,提示不能为空
        if (!textTagValueArray || textTagValueArray.length == 0) {
            wx.showToast({
                title: "标签不能为空",
                icon: 'none'
            })
            return;
        }
        //添加标签到标签栏
        let sendArr = []
        for (let x of textTagValueArray) {
            //添加标签
            this.labelFind({
                LabelTag: x,
                LabelTagGroupCode: null,
                LabelTagGroupName: null
            });
        }
        this.setData({
            //清空标题栏
            topInputValue: ''
        })
    },
    /**
     * 删除标签
     */
    delLabel() {
        let labelMap = this.data.labelMap;
        let newDataMap = {};
        for (let tabCode in labelMap){
            let tab = labelMap[tabCode];
            let list = []
            for(let x of tab.list){
                //将不删除的添加到新的数组中
                if (!x._del) {
                    list.push(x)
                }
            }
            if(list.length>0){
                //只有删除标签后  这里类别还又剩余的 tab的时候才保留这个tab
                newDataMap[tabCode] = {
                    tabName: tab.tabName,
                    list: list
                }
            }
        }
        this.setData({
            //更新列表
            labelMap: newDataMap,
            //重置当前删除次数
            delCount: 0
        })
    },
    /**
     * 点击单个标签
     */
    itemClick(e) {
        let index = e.currentTarget.dataset.index;
        let tabCode = e.currentTarget.dataset.tab;
        let labelMap = this.data.labelMap;
        let delState = labelMap[tabCode].list[index]._del;
        labelMap[tabCode].list[index]._del = !delState
        this.setData({
            delCount: delState ? this.data.delCount - 1 : this.data.delCount + 1,
            labelMap
        })
    },
    /**
     * 保存按钮
     */
    sendClick() {
        //将列表信息转化成为后台可识别信息
        let formList = [];
        let labelMap = this.data.labelMap;
        for (let x in labelMap){
            formList = formList.concat(labelMap[x].list);
        }
        //加载相应数据
        wx.$request({
            url: "/WeMinProPlatJson/Submit",
            data: {
                docType: 'Ocrd',
                actionType: 'SubmitLabel',
                docid: this.data.openId,
                docjson: JSON.stringify({
                    List: formList
                })
            },
            success:res=> {
                this.sendTime = (new Date()).getTime();
                wx.showToast({
                    title: '保存修改成功'
                })
            }
        })
    },
    /**
     * 点击标签库按钮
     */
    labelLibClick() {
        //加载标签内容
        if (!this.data.labelLibShow) {
            this.loadTagData();
        }
        this.setData({
            labelLibShow: !this.data.labelLibShow
        })
    },
    /**
     * 点击标签库左侧标签
     */
    labelLeftClick(e) {
        let index = e.currentTarget.dataset.index;
        this.setData({
            labelLeftIndex: index
        })
        //这里需要刷新右侧数据
        this.loadTagData();
    },
    /**
     * 点击标签库右侧标签
     */
    labelRightClick(e) {
        //获取标签的index
        let index = e.currentTarget.dataset.index;
        //这里更改一下操作  ， 当点击标签的时候，将自动把标签贴上
        this.labelFind(this.data.labelRightList[index]);
        return
        //这里表示  每当点击一个标签时候，是不加载标签的  而是将标签高亮  通过点击一个添加按钮 统一添加
        let addState = this.data.labelRightList[index]._add;
        this.setData({
            addCount: addState ? this.data.addCount - 1 : this.data.addCount + 1,
            [`labelRightList[${index}]._add`]: !addState
        })
    },
    /**
     * 点击标签库的添加按钮
     */
    libToAdd() {
        let list = this.data.labelRightList;
        for (let x of list) {
            if (x._add) {
                x._add = false;
                this.labelFind(x.LabelTag)
            }
        }
        this.setData({
            //更新列表
            labelRightList: list,
            //重置个数
            addCount: 0
        })
    },
    /**
     * 将标签进行分类  ,并添加到页面
     * itemList： 传入的数据组
     * item:{
     *  Name
     * LabelTagGroupCode
     * LabelTagGroupName
     * Count
     * _del
     * }
     */
    labelClassAdd(itemList) {
        let labelMap = this.data.labelMap;
        for (let item of itemList) {
            let labelTabList = labelMap[item.LabelTagGroupCode];
            if (!labelTabList) {
                //当不存在这个类别的时候
                //创建这个类别
                labelTabList = labelMap[item.LabelTagGroupCode] = {
                    tabName: item.LabelTagGroupName || '未分组',
                    list: []
                }
            }
            //将这个标签添加进类别中
            labelTabList.list.push(item)
        }
        //更新数据
        this.setData({
            labelMap: labelMap
        })
    },
    /**
     * 判断当前标签是否重复，不重复的将添加到页面中
     */
    labelFind(item) {
        let list = this.data.labelMap;
        let listItem = list[item.LabelTagGroupCode]
        if (listItem) {
            //如果存在此类别的时候
            //判断重复
            let index = find(listItem.list, 'Name', item.LabelTag);
            if (index >= 0) {
                wx.showToast({
                    title: "重复标签已被自动过滤",
                    icon: "none"
                })
                return
            }
        }
        //将标签分类并加入的页面中
        this.labelClassAdd([{
            Name: item.LabelTag,
            LabelTagGroupCode: item.LabelTagGroupCode,
            LabelTagGroupName: item.LabelTagGroupName,
            Count: null,
            _del: false
        }])
    },
    /**
     * 加载标签库详情
     */
    loadTagData() {
        //标签清空
        this.setData({
            labelRightList: []
        })
        this.myLlbox.init({
            url: "/WeMinProLabelTag/GetLabelTagList",
            data: {
                Group: this.data.labelLeftList[this.data.labelLeftIndex].Code,
                limit: 50
            },
            success: (res) => {
                //数据加工
                for (let x of res) {
                    x._add = false
                }
                this.setData({
                    labelRightList: this.data.labelRightList.concat(res)
                })
            },
            complete(res) {
                wx.stopPullDownRefresh();
            }
        });
    },
    /**
     * 标签库数据更新
     */
    bindscrolltolower() {
        this.myLlbox.request();
    },
    /**
     * 加载组件
     */
    myLlbox: {},
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            openId: options.openId
        })
        //获取自定义组件
        this.myLlbox = this.selectComponent('#myLlbox');
        //获取用户标签
        wx.$request({
            url: "/WeMinProPlatJson/GetList",
            data: {
                docType: 'Ocrd',
                actionType: 'LabelList',
                needTotal: false,
                docid: options.openId
            },
            success: (res) => {
                //对数据进行处理
                for (let x of res) {
                    x._del = false;
                }
                this.labelClassAdd(res);
            }
        })
        //获取标签组
        wx.$request({
            url: "/WeMinProPlatJson/GetList",
            data: {
                docType: 'Combobx',
                actionType: 'LabelTagGroup',
                needTotal: false,
            },
            success: (res) => {
                this.setData({
                    labelLeftList: res
                })
            }
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {},

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
        //当距离上次手动超过3秒   或者未手动保存的时候   在退出页面的时候 会自动保存
        let time = (new Date()).getTime();
        if (this.sendTime == 0 || time-this.sendTime>3000){
            this.sendClick();
        }
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

    },
})