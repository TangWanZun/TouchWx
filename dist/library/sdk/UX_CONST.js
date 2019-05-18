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
    "ConsumeRelease":"WeMinProOcrd.ConsumeRelease"
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
                    res = item;
                }else{
                    res = false;
                }
            }
            resolve(res?true:false)
        })
    })
}