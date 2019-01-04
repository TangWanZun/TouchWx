// component/dialog.js
Component({
        /**
         * 组件的属性列表
         */
        properties: {
                select: {
                        type: Boolean,
                        value: false,
                },
                /**
                 * 显示标题
                 */
                title:{
                        type: String,
                        value: '',
                }
        },

        /**
         * 组件的初始数据
         */
        data: {
                value: "",
                //用于置空textarea的内容
                valueHidden: "",
        },

        /**
         * 组件的方法列表
         */
        methods: {
                hidden() {
                        this.setData({
                                select: false
                        })
                },
                //获取模板消息内容
                textareaConfirm(e) {
                        this.setData({
                                value: e.detail.value
                        })
                },
                //确定
                confirm() {
                        //判断消息是否为空
                        if (this.data.value.length === 0) {
                                wx.showToast({
                                        title: '模板消息不能为空',
                                        icon: 'none'
                                })
                                return;
                        }
                        //将信息传递出去
                        this.triggerEvent("confirm", {
                                value: this.data.value
                        });
                        //隐藏
                        this.hidden();
                        //清空消息
                        //用于置空textarea的内容
                        this.setData({
                                value: "",
                                valueHidden: ""
                        })
                }
        }
})