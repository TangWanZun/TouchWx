// component/imgList.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        /**
         * 图片列表数据
         */
        list: {
            type: Array,
            value: [],
            observer(newVal, oldVal, changedPath) {
                let _imgList = [];
                let imgHtmlList = [];
                let _imgHeadUrl = this.data.imgHeadUrl;
                for (let x of newVal) {
                    //将原图分离出来,用于处理大图显示
                    _imgList.push(_imgHeadUrl + x[this.data.orig])
                    //添加图片删除选框
                    x._del = false;
                    imgHtmlList.push(x);
                }
                this.setData({
                    imgList: _imgList,
                    imgHtmlList
                })
            }
        },
        /**
         * 图片头部路径
         */
        imgHeadUrl: {
            type: String,
            value: ''
        },
        /**
         * 缩略图 名称
         */
        thum: {
            type: String,
            value: 'Thum'
        },
        /**
         * 原图 名称
         */
        orig: {
            type: String,
            value: 'Orig'
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        //用于查看大图的数据组
        imgList: [],
        //打开删除模式
        imgDelete: false,
        //带有删除选框的数据组
        imgHtmlList: [],
        //当前是否触发了长按
        imgLong: false,
        //时间数，用于中断时间
        imgTime: 0,
    },
    /**
     * 组件的方法列表
     */
    methods: {
        /**
         * 图片开始触摸
         */
        imgTouchStart(e) {
            //删除模式下将直接退出
            if (this.data.imgDelete) {
                return
            }
            let imgTime = setTimeout(() => {
                let index = e.currentTarget.dataset.index;
                console.log(index);
                //把长按的那个图片画框，并且开启删除模式
                this.setData({
                    [`imgHtmlList[${index}]._del`]: true,
                    imgDelete: true,
                    //更改当前状态为长按
                    imgLong: true
                })
                //震动
                wx.vibrateShort();
            }, 500);
            this.setData({
                imgTime
            })
        },
        /**
         * 图片结束触摸
         */
        imgTouchEnd() {
            if (!this.data.imgLong) {
                //当前不是长按状态下,取消长按事件
                clearTimeout(this.data.imgTime);
            }
        },
        /**
         *      图片删除
         */
        deleteImg(e) {
            //原数组
            let dataList = this.data.imgHtmlList;
            //新的图片数组
            let newDataList = [];
            //原用于展示数组
            let imgList = this.data.imgList;
            //l新用于展示数组
            let newImgList = [];
            for (let x in dataList) {
                if (!dataList[x]._del) {
                    newDataList.push(dataList[x])
                    //删除对应的图片放大数组
                    newImgList.push(imgList[x])
                }
            }
            this.setData({
                imgHtmlList: newDataList,
                imgList: newImgList,
                //退出删除模式
                imgDelete: false
            })
        },
        /**
         * 取消删除模式
         */
        noneDeleteImg() {
            let dataList = this.data.imgHtmlList;
            for (let x of dataList) {
                if (x._del) {
                    x._del = false;
                }
            }
            this.setData({
                imgHtmlList: dataList,
                //退出删除模式
                imgDelete: false
            })
        },
        /**
         * 点击单张图片 
         */
        showImg(e) {
            //如果当前已经触发了长按,则当前事件失效,并且取消当前单击事件
            if (this.data.imgLong) {
                this.setData({
                    imgLong: false
                })
                return
            }
            let index = e.currentTarget.dataset.index;
            //判断当前是否为删除模式
            if (this.data.imgDelete) {
                //当前为删除模式下,单机图  片为选择图片
                this.setData({
                    [`imgHtmlList[${index}]._del`]: !this.data.imgHtmlList[index]._del
                })
            } else {
                //非删除模式下,单击图片为查看图片大图
                wx.previewImage({
                    urls: this.data.imgList,
                    current: this.data.imgList[index]
                })
            }
        },
    }
})