var getMsgList = function(callback) {
    //将获取的数据传递到回调函数
    callback(msgList);
}
var msgBroadcast = {
    //创建时间
    createDate: undefined,
    //收听者列表
    listenList: {},
    //为消息项目添加一个红点,此方法只运行一次,运行之后删除方法
    //广播初始化
    init() {
        if (wx.$msgBroadcast) {
            return;
        } else {
            wx.$msgBroadcast = msgBroadcast;
        }

        function fun() {
            wx.$request({
                //取消顶部的loading加载
                loading: false,
                url: "/WeMinProChatMessage/GetLastMsg",
                data: {
                    Date: msgBroadcast.createDate,
                },
                success(res) {
                    // console.log(res);
                    //当存在返回值的时候,说明有信息池中存在数据
                    if (res) {
                        //更新时间
                        msgBroadcast.createDate = res.CreateDate;
                        //将获取的消息分发给全部收听者
                        for (let x in msgBroadcast.listenList) {
                            msgBroadcast.listenList[x](res.List);
                        }
                    }
                    //轮询运行
                    fun()
                },
                fail(res) {
                    console.log(12312, res);
                    //出现错误后重新启动
                    //这里如果手机小程序切换进入后台，会出现访问错误的现象
                    //这里清口广播站  
                    wx.$msgBroadcast = undefined;
                },
                complete(res) {

                }
            })
        }
        fun();
    },
    //添加一个收听者
    add(name, callback) {
        //如果收听者名字重复,则报错,并退出添加
        if (msgBroadcast.listenList.name) {
            console.error(`msgBroadcast:收听者${name}已经存在`);
            return;
        }
        //添加一个新的收听者
        msgBroadcast.listenList[name] = callback
    },
    //删除一个收听者
    remove(name) {
        //如果收听者名字不存在,则警告,并退出删除
        if (!msgBroadcast.listenList[name]) {
            console.warn(`msgBroadcast:收听者${name}不存在`);
            return;
        }
        //删除收听者
        delete msgBroadcast.listenList[name];
    }
}
export default msgBroadcast