/**
 * objArror对象数组第一个出现属性等于prname的对象索引
 */
function find(objArror, prNamn, value) {
    for (let i = objArror.length - 1; i >= 0; i--) {
        if (objArror[i][prNamn] == value) {
            return i
        }
    }
    return -1;
}

/*
 *	位数不足用0补足
 *   例子:  pad(100,4) = 0100
 */
function pad(num, n) {
    var len = num.toString().length;
    while (len < n) {
        num = "0" + num;
        len++;
    }
    return num;
}
/**
 * 服务器时间转为js Date对象实例
 */
function dateTo(dateString) {
    var regEx = new RegExp("\\-", "gi");
    dateString = dateString.replace(regEx, "/");
    //去掉最后的毫秒值,用于兼容苹果手机
    return new Date(dateString.split('.')[0]);
}

/**
 * 服务器时间转为js时间 保留日期与时间
 */
function toDateTime(value) {
    if (!value) {
        return
    }
    let date = dateTo(value);
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${pad(date.getHours(), 2)}:${pad(date.getMinutes(), 2)}`;
}
/**
 * 服务器时间转为js时间 仅保留时间
 */
function toTime(value) {
    // console.log(value);
    if (!value) {
        return
    }
    let date = dateTo(value);
    return `${pad(date.getHours(), 2)}:${pad(date.getMinutes(), 2)}`;
}
/**
 * 服务器时间转为js时间 仅保留日期
 */
function toDate(value) {
    // console.log(value);
    if (!value) {
        return
    }
    let date = dateTo(value);
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
}
/**
 * js时间格式转服务器时间
 */
function jsToDateTime(value) {
    if (!value) {
        return
    }
    let date = new Date(value);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.000`;
}
/**
 * 服务器时间转本地时间,只包括时间段
 */
function dateParseTime(dateString) {
    let date = dateString;
    //这里对服务器时间进行转换
    if (typeof dateString == 'string') {
        date = dateTo(dateString);
    }
    //获取当前时间
    let newDate = new Date();
    //当分钟为个位数的时候,在前面添加一个0
    let minu = date.getMinutes();
    if (minu < 10) {
        minu = `0${minu}`;
    }
    //判断是上午还是下午
    let sxS = '上午';
    let hours = date.getHours();
    if (hours >= 0 && hours <= 5) {
        sxS = '凌晨';
    } else if (hours > 5 && hours <= 7) {
        sxS = '早上';
    } else if (hours > 7 && hours <= 11) {
        sxS = '上午';
    } else if (hours > 11 && hours <= 17) {
        sxS = '下午';
        if (hours > 12) {
            hours -= 12;
        }
    } else if (hours > 17 && hours <= 21) {
        sxS = '晚上';
        hours -= 12;
    } else if (hours > 21 && hours <= 23) {
        sxS = '午夜';
        hours -= 12;
    }
    return `${sxS}${hours}:${minu}`;
}
/**
 * 服务器时间解析为本地时间   只包括日期格式
 */
export const dateParseDate = function(dateString) {
    let date = dateString;
    //这里对服务器时间进行转换
    if (typeof dateString == 'string') {
        date = dateTo(dateString);
    }
    //获取当前时间
    let newDate = new Date();
    //获取传入时间的日期字符串
    let dateDateString = date.toDateString();
    //一天24小时的毫秒值
    let DAY_TIME = 86400000;
    let dateParseDateStr = '';
    if (newDate.toDateString() === dateDateString) {
        //表示为今天
        dateParseDateStr = '今天';
    } else if (new Date(newDate.getTime() - DAY_TIME).toDateString() == dateDateString) {
        //表示为昨天
        dateParseDateStr = '昨天';
    } else if (new Date(newDate.getTime() + DAY_TIME).toDateString() == dateDateString) {
        //表示为明天
        dateParseDateStr = '明天';
    } else if (new Date(newDate.getTime() + DAY_TIME * 2).toDateString() == dateDateString) {
        //表示为后天
        dateParseDateStr = '后天';
    } else if (new Date(newDate.getTime() - DAY_TIME * 2).toDateString() == dateDateString) {
        //表示为前天
        dateParseDateStr = '前天';
    } else {
        dateParseDateStr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    }
    return dateParseDateStr;
}
/**
 * 服务器时间转本地时间
 */
function dateParse(dateString) {
    //获取当前时间
    let newDate = new Date();
    let date = dateString;
    //这里对服务器时间进行转换
    if (typeof dateString == 'string') {
        date = dateTo(dateString);
    }
    //获取时间 解析值
    let dateParseTimeData = dateParseTime(date);
    //获取日期 解析值
    let dateParseDateData =  dateParseDate(date)
    return `${dateParseDateData} ${dateParseTimeData}`;
    // let timeParseData = timeParse(date);
    // var returnDate;
    // if (newDate.toDateString() === date.toDateString()) {
    //     //表示为今天
    //     returnDate = `今天 ${timeParseData}`;
    // } else {
    //     let timeC = newDate.getTime() - date.getTime();
    //     //判断是不是昨天消息
    //     if (timeC < 172800000) {
    //         //为昨天消息
    //         //不为昨天也非今天
    //         returnDate = `昨天 ${timeParseData}`;
    //     } else if (timeC < 604800000) {
    //         let newDay = date.getDay();
    //         let newDayString = '';
    //         switch (newDay) {
    //             case 1:
    //                 newDayString = '周一';
    //                 break;
    //             case 2:
    //                 newDayString = '周二';
    //                 break;
    //             case 3:
    //                 newDayString = '周三';
    //                 break;
    //             case 4:
    //                 newDayString = '周四';
    //                 break;
    //             case 5:
    //                 newDayString = '周五';
    //                 break;
    //             case 6:
    //                 newDayString = '周六';
    //                 break;
    //             case 0:
    //                 newDayString = '周日';
    //                 break;
    //         }
    //         //为最近七天
    //         returnDate = `${newDayString} ${timeParseData}`;
    //     } else {
    //         returnDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${timeParseData}`;
    //     }
    // }
    // return returnDate;
}
/**
 * GUID生成器
 */
function GUID() {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}
export {
    find,
    GUID,
    dateParse,
    dateTo,
    toDateTime,
    toTime,
    dateParseTime,
    toDate,
    jsToDateTime
}