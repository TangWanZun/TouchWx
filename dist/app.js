import $request from 'library/sdk/request.js'
import * as $config from 'library/sdk/config.js'
import login from 'library/sdk/login.js'
import { UX_CONST,getUX} from './library/sdk/UX_CONST.js'
App({

    /**
     * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
     */
    onLaunch: function() {
        //挂载$request接口
        wx.$request = $request;
        //挂载权限系统
        wx.$UX = UX_CONST;
        wx.$getUX = getUX;
        //挂载configUrl
        this.privateData.configUrl = $config.configUrl;

        //在程序加载时,先展示消息红点,等到点击到消息页签的时候弹出来具体消息的条数
        wx.showTabBarRedDot({
            index: 0
        });
        setTimeout(()=>{

        },500)
    },
    /**
     * 当小程序启动，或从后台进入前台显示，会触发 onShow
     */
    onShow: function(options) {
        //运行
        login.init();
        // console.log(wx.getSystemInfoSync());
        // 每次登陆系统都需要对小程序进行检测，查看是否需要更新
        const updateManager = wx.getUpdateManager()
        updateManager.onCheckForUpdate(function(res) {
            // 请求完新版本信息的回调
            if (res.hasUpdate) {
                wx.showToast({
                    title: '正在下载最新版本',
                    icon: 'none'
                })
            }
        })

        updateManager.onUpdateReady(function() {
            wx.showModal({
                title: '更新提示',
                content: '新版本已经准备好，点击确定重新启动',
                showCancel: false,
                success(res) {
                    if (res.confirm) {
                        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                        updateManager.applyUpdate()
                    }
                }
            })
        })

        updateManager.onUpdateFailed(function() {
            wx.showModal({
                title: '更新提示',
                content: '新版本下载失败，请重新登陆小程序',
                success(res) {
                    if (res.confirm) {
                        updateManager.applyUpdate()
                    }
                }
            })
        })
    },

    /**
     * 当小程序从前台进入后台，会触发 onHide
     */
    onHide: function() {

    },

    /**
     * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
     */
    onError: function(msg) {

    },
    /**
     * 初始化当程序加载完成运行
     */
    onLoading() {

    },
    /**
     * 系统初始化
     * 用于退出登录的时候，全部数据都要清空
     */
    clearApp(blackCall){
        let _this = this;
        //清空全部缓存   同步版本
        wx.clearStorage({
            complete(){
                //清空登录凭证
                // _this.privateData.Token = "";
                //清空用户信息
                // _this.privateData.loginInfo = undefined;
                 _this.privateData.UXList = [];
                //清空tabBar页面缓存
                _this.tabBarPageCache = {}
                //调用回调函数
                blackCall()
            }
        })
    },
    /**
     * 自定义加载完成运行
     * 有些页面会用到info信息，但是通常当我们调用info时 info暂未加载成功,
     * 此方法就是用来解决这个问题的
     * 仅仅需要传递一个回调函数，当信息全部获取的时候,就会调用回调函数
     */
    loadInfo(callback) {
        //判断当前用户信息是否存在
        if (typeof this.privateData.loginInfo === 'undefined') {
            //当用户信息不存在的时候，将函数存入滞留池中
            this.privateData.loadRetention.push(callback);
        } else {
            //当用户信息存在的时候
            //调用方法
            callback();
        }
    },
    /**
     * 私有数据,
     * 用于存放全局变量的
     */
    privateData: {
        //登陆凭证
        Token: "",
        //用户信息
        loginInfo: undefined,
        //请求滞留池
        requestRetention: [],
        //加载滞留池
        loadRetention: [],
        // url配置
        configUrl: {},
        //当前用户权限
        UXList: [],
    },
    /**
     * 这里放置的是，已经打开过的tabBar页面的data数据缓存
     * 防止tabBar页面跳转的时候，需要重新加载数据
     */
    tabBarPageCache:{

    },
    /**
     * 设置缓存
     */
    setTabBarPageCache(tabBarName,data){
        this.tabBarPageCache[tabBarName] = data;
    }
})