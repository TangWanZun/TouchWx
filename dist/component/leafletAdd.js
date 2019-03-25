// component/leafletAdd.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        uploadType: {
            type: String,
            observer(val){
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
                    title, doctype
                })
            }
        },
    },
    /**
     * 组件的初始数据
     */
    data: {
        title: '',
        doctype:'',
        //用于展示在页面上的图片
        idImg:'',
        //是否上传图片中
        isLoad:false
        // 图片的大图
        //图片的缩略图
    },

    /**
     * 组件的方法列表
     */
    methods: {
        /**
         * 点击上传图片
         */
        uploadImg() {
            wx.chooseImage({
                count:1,
                success: res=>{
                    this.setData({ idImg: res.tempFilePaths[0]});
                    this.setData({
                        isLoad:true
                    })
                    wx.uploadFile({
                        url: 'https://example.weixin.qq.com/upload', // 仅为示例，非真实的接口地址
                        filePath: res.tempFilePaths[0],
                        name: 'file',
                        formData: {
                            user: 'test'
                        },
                        success:res=> {
                            console.log(res);
                            // const data = res.data
                            this.setData({
                                isLoad: false
                            })
                        }
                    })
                },
            })
        },
        /**
         * 查看图片大图
         */
        previewImage(){
            wx.previewImage({
                urls: [this.data.idImg]
            })
        },
        /**
         * 删除当前图片
         */
        delItem(){
            wx.showModal({
                content:'确定要删除当前证件照么',
                success:(res)=>{
                    if (res.confirm) {
                        this.setData({ idImg: '' })
                    }
                }
            })
        }
    }
})