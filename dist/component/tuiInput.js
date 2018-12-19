// component/tuiInput.js
import {util} from '../library/sdk.js'
Component({
        options: {
                multipleSlots: true // 在组件定义时的选项中启用多slot支持
        },
        /**
         * 组件的属性列表
         */
        properties: {
                /**
                 * 当前input的类型
                 * 1. input 输入框(默认值)
                 * 2. date  时间选择器()
                 * 3. select 普通选择器
                 */
                type: {
                        type: String,
                        value: 'input'
                },
                /**
                 * 当type为input是时候 用来表示input的类型的
                 */
                inputType:{
                        type:String,
                        value:'text'
                },
                /**
                 * 默认输入的内容
                 */
                value:{
                        type:String,
                        value:'',
                        observer(newVal,oldVal,changedPath){
                                //当type为select的时候,value将是Code值,我们要根据Code值把Name值渲染出来
                                if (this.data.type=='select'){
                                        let range = this.data.range;
                                        let code = this.data.rangeCode;
                                        for(let x in range){
                                                if (range[x][code] == newVal){
                                                        this.setData({
                                                                selectIndex:x
                                                        })
                                                        break
                                                }
                                        }
                                } else if (this.data.type == 'date'){
                                        //当type为date的时候,自动将服务器时间转化为当前插件使用时间
                                        let date =  util.dateTo(newVal);
                                        this.setData({
                                                dateValue: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
                                        })
                                }
                        }
                },
                /**
                 *     是否禁用
                 */
                disabled:{
                        type:Boolean,
                        value:false
                },
                /**
                 * 当type为select的时候 对应 picker 中的 range-key
                 * 默认是根据服务器自定义表的一贯使用方式编写
                 */
                rangeName:{
                        type:String,
                        value:'Name'
                },
                /**
                 * 当type为select的时候 返回值中range的name对应的code值
                 * 默认是根据服务器自定义表的一贯使用方式编写
                 */
                rangeCode: {
                        type: String,
                        value: 'Code'
                },
                /**
                 * 当type为select的时候 对应 picker 中的 range
                 */
                range:{
                        type: Array,
                        value:[],
                        observer(newVal, oldVal, changedPath) {
                                //如果说这里range是异步加载的,会出现range加载慢与value的时候,这种情况下是需要调用使用下面方法
                                if (this.data.type == 'select') {
                                        let range = newVal;
                                        let code = this.data.rangeCode;
                                        let value = this.data.value;
                                        for (let x in range) {
                                                if (range[x][code] == value) {
                                                        this.setData({
                                                                selectIndex: x
                                                        })
                                                        break
                                                }
                                        }
                                }
                        }
                }
        },

        /**
         * 组件的初始数据
         */
        data: {
                //当type为select时, 当前的展示的索引值
                selectIndex:-1,
                dateValue:'',
        },

        /**
         * 组件的方法列表
         */
        methods: {
                /**
                 * input 数值改变时候的回调参数
                 */
                bindInput(e) {
                        let data = {
                                value: e.detail.value
                        }
                        this.triggerEvent('input', data)
                },
                /**
                 * 当type为select的时候回调参数
                 */
                selectChange(e){
                        let index = e.detail.value;
                        let data = {
                                //name对应的code值
                                value: this.data.range[index][this.data.rangeCode],
                                //name值
                                name: this.data.range[index][this.data.rangeName],
                                //选取内容的索引值
                                index
                        }
                        //改变当前显示的索引值
                        this.setData({
                                selectIndex:index
                        })
                        //将信息传递出去
                        this.triggerEvent('input', data)
                },
                /**
                 * 当type为date的时候回调参数
                 */
                dateChange(e){
                        let value = e.detail.value;
                        //改变显示当前时间
                        this.setData({
                                dateValue: value
                        })
                        let data = {
                                value:`${value} 00:00.000`
                        }
                        //将信息传递出去
                        this.triggerEvent('input', data)
                }
        }
})