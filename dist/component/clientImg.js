import { configUrl } from '../library/sdk.js'
Component({
        /**
         * 组件的属性列表
         */
        properties: {
                /**
                 * 传进的用户头像图片
                */
                src:{
                        type:String
                },
                /**
                 * 图片mode类型
                 */
                mode:{
                        type:String
                }
        },

        /**
         * 组件的初始数据
         */
        data: {
                imgUrl: configUrl.imgUrl,
        },

        /**
         * 组件的方法列表
         */
        methods: {
                /**
                 * 图片加载出现错误
                 */
                binderror(e){
                        // console.log(e);
                        //加载出现错误就使用默认头像
                        this.setData({
                                src:''
                        })
                }
        }
})
