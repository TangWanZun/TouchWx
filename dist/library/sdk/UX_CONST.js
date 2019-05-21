export const UX_CONST = {
    //信息权限
    "WeMinProMessage": "WeMinProChat",
    //客户页面
    "WeMinProClient": "WeMinProOcrd",
    //工作权限
    "WeMinProWork": "WeMinProWorker",
    //我的权限
    "WeMinProUser": "WeMinProUserMain",
    //运营报告
    "WeMinProCooReport": "WeMinProCooReport",
    //核销权限
    "ConsumeRelease":"WeMinProOcrd.ConsumeRelease",
    //业务权限范围
    "CmpScopeFilter": "WeMinProUserMain.CmpScopeFilter"
}
/**
 * 获取权限信息
 */
export const getUX = function(UX){
    let privateData = getApp().privateData;
    return new Promise((resolve,reject)=>{
        let dataList = UX.split('.');
        //等待获取运营权限
        getApp().loadInfo(function () {
            let res = privateData.UXList;
            for(let i=0;i<dataList.length;i++){
                let item = res[dataList[i]];
                if (item){
                    //表示还有下一层
                    res = item;
                } else if (typeof item =="undefined"){
                    //表示传递的权限中没有UX这一项 ，那么默认就是true
                    res = true;
                }else {
                    //表示权限为 false
                    res = false;
                }
            }
            resolve(res?true:false);
        })
    })
}