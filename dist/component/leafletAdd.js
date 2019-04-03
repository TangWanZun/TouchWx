// component/leafletAdd.js
import {
    configUrl
} from '../library/sdk.js'
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        /**
         * 上传类型
         */
        uploadType: {
            type: String,
            observer(val) {
                let title = '';
                let doctype = '';
                switch (val) {
                    //驾驶证
                    case "jsCard":
                        {
                            title = "驾驶证上传";
                            doctype = "DriverLicense";
                            break;
                        }
                        //身份证
                    case "sfCard":
                        {
                            title = "身份证上传";
                            doctype = "IdCard";
                            break;
                        }
                        //行驶证
                    case "xsCard":
                        {
                            title = "行驶证上传";
                            doctype = "VehicleLicense";
                            break;
                        }
                }
                this.setData({
                    title,
                    doctype
                })
            }
        },
        /**
         * 真实图片
         */
        imgUrl: {
            type: Object,
            value: {
                //原图
                orig: '',
                //缩略图,
                thum: ''
            },
            observer(val) {
                let orig = configUrl.imgUrl + val.orig;
                let thum = configUrl.imgUrl + val.thum;
                //判断，防止循环
                if (orig == this.data.imgShowUrl.orig && thum == this.data.imgShowUrl.thum) {
                    return;
                }
                //当传递值为空的时候
                if (val.orig == '' || val.thum == '') {
                    orig = '';
                    thum = '';
                }
                //当真实图片地址改变的时候,同步更改展示图片，并将图片信息事件传出
                this.setData({
                    imgShowUrl: {
                        orig: orig,
                        thum: thum,
                    }
                })
                this.triggerEvent('input', val)
            }
        },
        /**
         * Orig  表示原图的Key值
         */
        orig: {
            type: String,
            value: "Orig"
        },
        /**
         * Thum	表示缩略图的Key值
         */
        thum: {
            type: String,
            value: "Thum"
        },
        /**
         * 启动禁止上传和修改
         */
        disabled:{
            type:Boolean,
            value:false
        }
    },
    /**
     * 组件的初始数据
     */
    data: {
        //图片根目录
        imgRoot: configUrl.imgUrl,
        title: '',
        doctype: '',
        //是否上传图片中
        isLoad: false,
        // 用于展示的图片
        imgShowUrl: {
            //原图
            orig: '',
            //缩略图,
            thum: ''
        },
    },
    /**
     * 组件的方法列表
     */
    methods: {
        /**
         * 点击上传图片
         */
        uploadImg() {
            if (this.data.disabled)return;
            wx.chooseImage({
                count: 1,
                success: res => {
                    this.setData({
                        imgShowUrl: {
                            orig: res.tempFilePaths[0],
                            thum: res.tempFilePaths[0]
                        }
                    });
                    this.setData({
                        isLoad: true
                    })
                    // setTimeout(() => {
                    //     this.setData({
                    //         isLoad: false,
                    //         imgUrl: {
                    //             orig: '/wxapp/img/bjxdysld.jpg',
                    //             thum: '/wxapp/img/bjxdysld.jpg'
                    //         }
                    //     })
                    // }, 300)
                    let privateData = getApp().privateData;
                    wx.uploadFile({
                        url: `${configUrl.url}/WeMinProIntegrated/UploadFile`,
                        filePath: res.tempFilePaths[0],
                        header: {
                            // 'content-type': 'application/json', // 默认值
                            // 'Content-type': 'multipart/form-data',
                            // 'Content-type': 'application/x-www-form-urlencoded',
                            'Cookie': privateData.Token
                        },
                        name: 'file',
                        formData: {
                            docType: this.data.doctype
                        },
                        success: res => {
                            console.log(res.data);
                            let data = JSON.parse(res.data)
                            // const data = res.data
                            this.setData({
                                isLoad: false,
                                imgUrl: {
                                    orig: data.data.orig,
                                    thum: data.data.thum
                                }
                            })
                        }
                    })
                },
            })
        },
        /**
         * 查看图片大图
         */
        previewImage() {
            wx.previewImage({
                urls: [this.data.imgShowUrl.orig]
            })
        },
        /**
         * 删除当前图片
         */
        delItem() {
            wx.showModal({
                content: '确定要删除当前证件照么',
                success: (res) => {
                    if (res.confirm) {
                        this.setData({
                            imgUrl: {
                                orig: '',
                                thum: ''
                            }
                        })
                    }
                }
            })
        }
    }
})