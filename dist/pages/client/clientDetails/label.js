// pages/client/clientDetails/label.js
import { find} from './../../../library/sdk/util.js'
Page({
        /**
         * 页面的初始数据
         */
        data: {
                formList:[],
                openId:'',
                topInputValue:'',
                //当前删除的个数
                delCount: 0,
                //标签库是否出现
                labelLibShow:false,
                //标签库左侧列表
                labelLeftList:[],
                //选择的标签库左侧列表的index  默认为第一个
                labelLeftIndex:0,
                //标签库右侧列表
                labelRightList: [],
                //当前添加个数
                addCount:0
        },
        /**
         * input信息同步
         */
        inputSelect(e){
                //当数据获取的时候,是不需要更新的
                this.data.topInputValue = e.detail.value;
        },
        /**
         * 添加标签
         */
        addLabel(e){
                let value = this.data.topInputValue;
                //字符串拆分，比如输入A,B,C 或 A B C 或 A，B，C 则都为3个标签。js正则表达式后面/g是多匹配的意思
                var re = /([^ \f\n\r\t\v`~!@#$%^&*()=\+\\\|{}\[\]'";:,<.>//?·！￥……（）——、【】｛｝‘’“”；：、？。》，《]|\d)+/g;//排除空格换行以及各种特殊字符
                var textTagValueArray = value.match(re);
                //当添加标签的数据为空的时候,提示不能为空
                if (!textTagValueArray||textTagValueArray.length==0){
                        wx.showToast({
                                title:"标签不能为空",
                                icon:'none'
                        })
                        return;
                }
                //添加标签到标签栏
                let sendArr = []
                for (let x of textTagValueArray){
                        //添加标签
                        this.labelFind(x);
                }
                this.setData({
                        //清空标题栏
                        topInputValue:''
                })
        },
        /**
         * 删除标签
         */
        delLabel(){
                let dataList = this.data.formList;
                let newDataList = [];
                for(let x of dataList){
                        //将不删除的添加到新的数组中
                        if(!x._del){
                                newDataList.push(x)
                        }
                }
                this.setData({
                        //更新数组
                        formList:newDataList,
                        //重置当前删除次数
                        delCount:0
                })
        },
        /**
         * 点击单个标签
         */
        itemClick(e){
                let index = e.currentTarget.dataset.index;
                let delState = this.data.formList[index]._del;
                this.setData({
                        delCount: delState ? this.data.delCount - 1 : this.data.delCount + 1,
                        [`formList[${index}]._del`]: !delState
                })
        },
        /**
         * 保存按钮
         */
        sendClick(){
                //加载相应数据
                wx.$request({
                        url: "/WeMinProPlatJson/Submit",
                        data: {
                                docType: 'Ocrd',
                                actionType: 'SubmitLabel',
                                docid: this.data.openId,
                                docjson: JSON.stringify({ List: this.data.formList})
                        },
                        success(res) {
                                wx.showToast({
                                        title: '保存修改成功'
                                })
                        }
                })
        },
        /**
         * 点击标签库按钮
         */
        labelLibClick(){
                //加载标签内容
                if (!this.data.labelLibShow){
                        this.loadTagData();
                }
                this.setData({
                        labelLibShow: !this.data.labelLibShow
                })
        },
        /**
         * 点击标签库左侧标签
         */
        labelLeftClick(e){
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
        labelRightClick(e){
                let index = e.currentTarget.dataset.index;
                let addState = this.data.labelRightList[index]._add;
                this.setData({
                        addCount: addState ? this.data.addCount - 1 : this.data.addCount + 1,
                        [`labelRightList[${index}]._add`]: !addState
                })
        },
        /**
         * 点击标签库的添加按钮
         */
        libToAdd(){
                let list = this.data.labelRightList;
                for(let x of list){
                        if (x._add){
                                x._add = false;
                                this.labelFind(x.LabelTag)
                        }
                }
                this.setData({
                        //更新列表
                        labelRightList:list,
                        //重置个数
                        addCount:0
                })
        },
        /**
         * 判断当前标签是否重复，不重复的将添加到页面中
         */
        labelFind(labelName){
                let list = this.data.formList;
                let index = find(list, 'Name', labelName);
                if(index>=0){
                        wx.showToast({
                                title:"重复标签已被自动过滤",
                                icon:"none"
                        })
                }else{
                        this.setData({
                                formList: this.data.formList.concat({
                                        Name: labelName,
                                        Count:0,
                                        _del:false
                                })
                        })
                }
        },
        /**
         * 加载标签库详情
         */
        loadTagData(){
                //标签清空
                this.setData({
                        labelRightList: []
                })
                this.myLlbox.init({
                        url: "/WeMinProLabelTag/GetLabelTagList",
                        data: {
                                Group: this.data.labelLeftList[this.data.labelLeftIndex].Code,
                                limit:50
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
        bindscrolltolower(){
                this.myLlbox.request();
        },
        /**
         * 加载组件
         */
        myLlbox: {},
        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function (options) {
                this.setData({
                        openId: options.openId
                })
                //获取自定义组件
                this.myLlbox = this.selectComponent('#myLlbox');
                //获取用户标签
                wx.$request({
                        url: "/WeMinProPlatJson/GetList",
                        data:{
                                docType: 'Ocrd',
                                actionType: 'LabelList',
                                needTotal: false,
                                docid: options.openId
                        },
                        success:(res)=>{
                                //对数据进行处理
                                for(let x of res){
                                        x._del =false;
                                }
                                this.setData({
                                        formList:res||[]
                                })
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
                                        labelLeftList:res
                                })
                        }
                })
        },

        /**
         * 生命周期函数--监听页面初次渲染完成
         */
        onReady: function () {
        },

        /**
         * 生命周期函数--监听页面显示
         */
        onShow: function () {

        },

        /**
         * 生命周期函数--监听页面隐藏
         */
        onHide: function () {

        },

        /**
         * 生命周期函数--监听页面卸载
         */
        onUnload: function () {

        },

        /**
         * 页面相关事件处理函数--监听用户下拉动作
         */
        onPullDownRefresh: function () {

        },

        /**
         * 页面上拉触底事件的处理函数
         */
        onReachBottom: function () {

        },

        /**
         * 用户点击右上角分享
         */
        onShareAppMessage: function () {

        },
})