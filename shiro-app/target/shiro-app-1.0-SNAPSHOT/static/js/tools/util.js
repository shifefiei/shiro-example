//将整数日期1355131810000格式化为2012-01-01格式
function formateIntDateToString(intDate) {
    var d = new Date(intDate);
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    if (month >= 10) {
        month = month + "";
    } else {
        month = "0" + month;
    }
    var date = d.getDate();
    if (date < 10) {
        date = "0" + date;
    }
    return year + "-" + month + "-" + date;
}

function dateFormat(date, fmt) {
    var o = {
        "M+": date.getMonth() + 1,                 //月份
        "d+": date.getDate(),                    //日
        "h+": date.getHours(),                   //小时
        "m+": date.getMinutes(),                 //分
        "s+": date.getSeconds(),                 //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

//提示弹出

//ele 为目标如  this '.ele' '#ele';
function setAlertBox(ele, str) {
    var l = $(ele).position().left + 40;
    var t = $(ele).position().top + 20;
    var temp = $('<span class="alert-box alert-float" style="left:' + l + 'px; top:' + t + 'px;"><a class="alert-ico"></a><em class="alert-content">' + str + '</em></span>');
    $(ele).after(temp);
    setTimeout(function () {
        temp.animate({"opacity": 0}, 200, function () {
            temp.remove();
        });
    }, 3000);
}

//判断是否有文本
function hasText(text) {
    var result = true;
    if (typeof text == "undefined" || text == null || $.trim(text) == '') {
        result = false;
    }
    return result;
}

//判断该对象是否是正的整数组成
function isPositiveInteger(number) {
    var result = false;
    var reg = /^[0-9]*[1-9][0-9]*$/;
    if (reg.test(number)) {
        result = true;
    }
    return result;
}

/**
 * <p>
 * 判断该对象是否是正的数组成
 * 要么是正整数，要么是小数
 */
function isPositive(number) {
    var result = false;
    var reg = /^\d+\.\d{0,2}$|^\d+$/;
    if (reg.test(number)) {
        result = true;
    }
    return result;
}

/**
 * json对象向String转化
 * author 黎巍
 */
function jsonToString(obj) {
    var THIS = this;
    switch (typeof(obj)) {
        case 'string':
            return '"' + obj.replace(/(["\\])/g, '\\$1') + '"';
        case 'array':
            return '[' + obj.map(THIS.jsonToString).join(',') + ']';
        case 'object':
            if (obj instanceof Array) {
                var strArr = [];
                var len = obj.length;
                for (var i = 0; i < len; i++) {
                    strArr.push(THIS.jsonToString(obj[i]));
                }
                return '[' + strArr.join(',') + ']';
            } else if (obj == null) {
                return 'null';

            } else {
                var string = [];
                for (var property in obj) string.push(THIS.jsonToString(property) + ':' + THIS.jsonToString(obj[property]));
                return '{' + string.join(',') + '}';
            }
        case 'number':
            return obj;
        case 'false':
            return obj;
    }
}

/**
 * String向json对象转化
 * author 黎巍
 */
function stringToJSON(obj) {
    return eval('(' + obj + ')');
}

/**
 * js对象拷贝
 * author:huangdong
 */
function oClone(obj) {
    var re;
    if (obj.constructor == Array) {
        re = [];
        for (var i = 0; i < obj.length; i++) {
            if (obj[i] != null && (obj[i].constructor == Object || obj[i].constructor == Array))
                re[i] = oClone(obj[i]);
            else
                re[i] = obj[i];
        }
    }
    else {
        re = {};
        for (var i in obj) {

            if (obj[i] != null && (obj[i].constructor == Object || obj[i].constructor == Array))
                re[i] = oClone(obj[i]);
            else
                re[i] = obj[i];
        }

    }

    return re;
}

/**
 * 排序并格式化日期，格式化20120301为2012-03-01
 * author:huangdong
 */
function sortFormatDate(dateArray) {
    var days = dateArray;
    days.sort();

    var splitArray = new Array();
    var rangeArray = new Array();
    rangeArray.push(formatDate(days[0]));
    for (var i = 0; i < days.length; i++) {
        var cstr = days[i];
        var cday = new Date();
        cday.setFullYear(parseInt((cstr + '').substring(0, 4), 10));
        cday.setMonth(parseInt((cstr + '').substring(4, 6), 10) - 1);
        cday.setDate(parseInt((cstr + '').substring(6, 8), 10));

        if (i < days.length - 1) {
            var nstr = days[i + 1];
            var nday = new Date();
            nday.setFullYear(parseInt((nstr + '').substring(0, 4), 10));
            nday.setMonth(parseInt((nstr + '').substring(4, 6), 10) - 1);
            nday.setDate(parseInt((nstr + '').substring(6, 8), 10));
            if ((cday.getTime() + 86400000) == nday.getTime()) {
                rangeArray.push(formatDate(days[i + 1]));
            } else {
                splitArray.push(rangeArray);
                rangeArray = new Array();
                rangeArray.push(formatDate(days[i + 1]));
            }
        } else {
            splitArray.push(rangeArray);
        }
    }

    var strArray = new Array();
    for (var i = 0; i < splitArray.length; i++) {
        var dateStr = "";
        var item = splitArray[i];
        if (item.length > 1) {
            dateStr = item[0] + "至" + item[item.length - 1];
            strArray.push(dateStr);
        } else {
            strArray.push(item[0]);
        }
    }

    return strArray.join(",");
}

//将日期"20120101"格式化为"2012-01-01"
function formatDate(dstr) {
    return (dstr + '').substring(0, 4) + "-" + (dstr + '').substring(4, 6) + "-" + (dstr + '').substring(6, 8);
}

//将日期对象格式化为"20120101"
function formateDateObj(dateObj) {
    var month = dateObj.getMonth() + 1;
    if (month >= 10) {
        month = month + "";
    } else {
        month = "0" + month;
    }

    var day = dateObj.getDate();
    if (day < 10) {
        day = "0" + day;
    }

    return dateObj.getFullYear() + month + day;
}

//将格式为"20120101"日期字符串转换为js日期对象
function toDateObj(dateStr) {
    var cday = new Date();
    cday.setFullYear(parseInt((dateStr + '').substring(0, 4), 10));
    cday.setMonth(parseInt((dateStr + '').substring(4, 6), 10) - 1);
    cday.setDate(parseInt((dateStr + '').substring(6, 8), 10));

    return cday;
}
/**
 * js 验证非法字符
 * @param pattern
 */
function checkInput(str) {
    var patrn = /[`~!@#$%^&*_+<>?:"{}'[\]]/im;
    if (patrn.test(str)) {
        return false;
    }
    return true;
}

/**
 * 将对象转换为数组
 * @param obj 对象
 * @param array 数组
 */
function convertObj2Array(obj, array) {
    // 开始遍历
    for (var p in obj) {
        // 方法
        if (typeof (obj[p]) != "function") {
            array.push(obj[p]);
        }
    }
}
/**
 * 校验url合法
 * @param str_url
 * @returns {Boolean}
 */
function IsURL(str_url) {

    var urlreg = /^((https|http|ftp|rtsp|mms)?:\/\/)+[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/;
    var re = new RegExp(urlreg);
    //re.test()
    if (re.test(str_url)) {
        return true;
    } else {
        return false;
    }
}

/**
 * <p>比较两个日期
 * @param startDate 开始日期 格式:2014-02-11
 * @param endDate 结束日期 格式:2014-06-11
 * @returns {Boolean}
 */
function dateCompare(startDate, endDate) {
    if (!hasText(startDate)) {
        alert('请输入起始日期');
        return false;
    }
    if (!hasText(endDate)) {
        alert('请输入结束日期');
        return false;
    }
    var startArr = startDate.split("-");
    var endArr = endDate.split("-");
    var d1 = new Date(startArr[0], parseInt(startArr[1], 10) - 1, parseInt(startArr[2], 10) + 1);
    var d2 = new Date(endArr[0], parseInt(endArr[1], 10) - 1, parseInt(endArr[2], 10) + 1);
    if (d1 >= d2) {
        alert('结束日期不能小于起始日期!');
        return false;
    }
    return true;
}

function nextDay(date) {
    var nextDate = null;
    if (hasText(date)) {
        var d = date.split("-");
        nextDate = new Date(d[0], parseInt(d[1], 10) - 1, d[2]);
    }
    else {
        nextDate = new Date();
    }
    nextDate.setTime(nextDate.getTime() + 24 * 60 * 60 * 1000)
    return nextDate;

}


function _successFun(data) {
    // 执行失败
    if (data.code == 0) {
        alert(data.msg);
    }
    // 执行成功
    else {
        if (data.msg == null) {
            alert('执行成功！');
        }
        else {
            alert(data.msg);
        }
    }
}

function _errorFun() {
    alert('执行失败，请联系系统管理员!');
}

/**
 * 去除空格，is_global参数为g，则去除所有空格（包含中间的）
 * @param str
 * @param is_global
 * @returns
 */
function toTrim(str, is_global) {
    var result;
    result = str.replace(/(^\s+)|(\s+$)/g, "");
    if (is_global.toLowerCase() == "g") {
        result = result.replace(/\s/g, "");
    }
    return result;
}

/**
 * 日期格式化函数
 * 蔡江松
 *
 */
Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(), //day
        "h+": this.getHours(), //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
        "S": this.getMilliseconds()
        //millisecond
    }
    if (/(y+)/.test(format))
        format = format.replace(RegExp.$1, (this.getFullYear() + "")
            .substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(format))
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]
                : ("00" + o[k]).substr(("" + o[k]).length));
    return format;
}

/**
 * 判断数字
 */
function IsInt(dec_data) {
    var intReg = new RegExp(/^[0-9]+$/);
    if (intReg.test(dec_data)) {
        return true;
    } else {
        return false;
    }
}