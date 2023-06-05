require.config({
    baseUrl: '/static/js',
    paths: {
        css: 'css.min',
        jquery: 'tools/jquery.min',
        underscore: 'tools/underscore',
        html5shiv: 'tools/html5shiv',
        respond: 'tools/respond.min',
        page: 'page/page'
    },
    shim: {
        underscore: {
            exports: '_'
        }
    }
});


function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    //var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    /*var currentDate = date.getFullYear() + seperator1 + month + seperator1 + strDate
     + " " + date.getHours() + seperator2 + date.getMinutes()
     + seperator2 + date.getSeconds();*/
    var currentDate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
    return currentDate;
}


function fmoney(s, n) {
    n = n > 0 && n <= 20 ? n : 2;
    s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
    var l = s.split(".")[0].split("").reverse(),
        r = s.split(".")[1];
    t = "";
    for (i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
    }
    return t.split("").reverse().join("") + "." + r;
}

