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

        }
})
