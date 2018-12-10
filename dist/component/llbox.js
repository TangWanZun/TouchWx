// component/llbox.js
import $request from '../library/sdk/request.js'
var $ = {
  start: 0,
  limit: 10,
  requestUrl: '',
  requestPro: {}
}
Component({
  /**s
   * 设置
   */
  // options: {
  //   multipleSlots: true // 在组件定义时的选项中启用多slot支持
  // },
  /**
   * 组件的属性列表
   */
  properties: {
  },
  /**
   * 组件的初始数据
   */
  data: {
    //是否全部查询完成
    pageOver: false,
    //是否为第一次加载数据,
    firstLoad:true,
    //是否为空数据
    isNoneData:false
  },
  created(){
    // console.log($)
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //初始化数据查询
    init(pro){
      //全部信息重置
      $.start = 0;
      this.setData({
        pageOver: false,
        firstLoad:true,
        isNoneData:false
      });
      //判断是否存在参数url,不存在这直接报错
      if(!pro.url){console.error('llbox:错误,必须传入参数url');return}
      $.requestUrl = pro.url;
      //将传入的数据存储起来,以便下次使用
      //如果传入数据中有分页使用的数据,则使用用户提供的分页数据
      $.requestPro = pro;
      if (pro.data){
        //当存在data时，需要进行判断
        $.start = pro.data.start || 0;
        $.limit = pro.data.limit || $.limit;
      }
      //运行init初始化的时候,将自动调用一次request方法
      this.request();
    },
    //使用获取信息
    request() {
      //当全部数据获取完成的时候,将不再运行此方法
      if (this.data.pageOver){return}
      let _this = this;
      //拼装传递的data值
      $.requestPro.data;
      let data = [];
      for (let x in $.requestPro.data ){
        data[x] = $.requestPro.data[x];
      }
      data.start = $.start;
      data.limit = $.limit;
      wx.$request({
        url: $.requestUrl,
        data: data,
        success(res){
          //当获取的参数的个数少于limit也就是需要获取参数个数的时候,即判断全部数据已经获取完成
          if (res.length < $.limit){
            if (_this.data.firstLoad && res.length==0){
              //当为第一次加载数据且数据为空时,表示数据为空
              _this.setData({
                //改变为当前数据为空
                isNoneData:true
              })
            }
            //改变获取数据状态
            _this.setData({
              pageOver:true
            })
          }
          //改变状态
          _this.setData({
            //改变为不是第一次加载数据
            firstLoad:false,
          })
          //start增加,并将数据传递出去
          $.start += $.limit;
          $.requestPro.success(res);
        },
        fail(error){
          $.requestPro.fail(res);
        },
        complete(res){
          $.requestPro.complete(res)
        }
      })
    }
  }
})