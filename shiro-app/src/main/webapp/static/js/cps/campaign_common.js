$(document).ready(function () {
    //图片上传
    var uploader = new plupload.Uploader({
        runtimes: 'html5,flash,html4',
        browse_button: 'pickfiles',
        container: document.getElementById('container'),
        url: '/delivery/cps/upload',
        flash_swf_url: '/static/plupload/Moxie.swf',
        chunk_size: '1mb',
        unique_names: true,
        multipart: true,
        filters: [
            {title: "图片类型", extensions: "jpg,jpeg,gif,png"}
        ],
        init: {
            PostInit: function () {
                //document.getElementById('filelist').innerHTML = '';
                //点某个按钮是开始上传
                $("#uploadfiles").click(function () {
                    uploader.start();
                    return false;
                });
            },
            //当文件添加到上传队列时触发
            FilesAdded: function (up, files) {
                /*plupload.each(files, function (file) {
                 document.getElementById('filelist').innerHTML += '<div id="' + file.id + '">' + file.name + ' (' + plupload.formatSize(file.size) + ') <b></b></div>';
                 });*/
                $.blockUI({message: '<h5>图片上传中……</h5>'});
                uploader.start();//开始上传文件
            },
            //文件正在上传是触发
            UploadProgress: function (up, file) {
                //document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
            },
            //文件上传成功是触发
            FileUploaded: function (up, file, _response) {
                var responseStr = _response.response;
                callbackImg(responseStr);
                $.unblockUI();
            },
            //错误信息
            Error: function (up, err) {
                alert("图片上传失败,请稍后重试");
                $.unblockUI();
            }
        }
    });
    uploader.init();
});

function callbackImg(data) {
    if (typeof (data) != 'undefined') {
        var result = JSON.parse(data);
        var img = result.address;
        var domHtml = '<tr>' +
            '<td>' + img[0].name + '</td>' +
            '<td><a target="_blank" href="' + img[0].img + '">' + img[0].img + '</a></td>' +
            '<td>' + img[0].width + '*' + img[0].height + '</td>' +
            '<td><a onclick="deleteImgUrl(this)" href="javascript:void(0);">删除</a></td>' +
            '</tr>';
        $("#cps_picture_list").append(domHtml);
    }
}

function deleteImgUrl(obj) {
    $(obj).parent().parent().remove();
}

function findAllImgUrl() {
    var images = [];
    var tab = document.getElementById("cps_picture_list");
    for (var i = 0; i < tab.rows.length; i++) {
        var name = tab.rows[i].cells[0].innerText;
        var url = tab.rows[i].cells[1].innerText;

        var reg = /(https|http):/g;
        url = url.replace(/(^\s*)|(\s*$)/g, "");
        if (url != 'undefined' && url != "") {
            url = url.replace(reg, '');
        }

        var sizeStr = tab.rows[i].cells[2].innerText;
        var sizes = sizeStr.split('*');
        var img = {
            name: name,
            img: url,
            width: sizes[0],
            height: sizes[1]
        }
        images.push(img);
    }
    return images;
}

//sku设置
function settingCpsSku() {
    var sku = $.trim($('#sku').val());
    var skuBizType = $.trim($("#skuBizType option:selected").val());
    var skuBizProduct = $.trim($("#skuBizProduct option:selected").val());
    var cmsType = $.trim($('#cmsType option:selected').val());
    var projectType = $.trim($('#skuProjectType option:selected').val());
    var skuRule = {
        sku: sku,
        bizType: skuBizType,
        bizProduct: skuBizProduct,
        cmsType: cmsType,
        projectType: projectType
    };
    return skuRule;
}


//产品链接
function settingLink() {
    var reg = /(https|http):/g;
    var pcUrl = $.trim($('#pcUrl').val());
    if (pcUrl != 'undefined') {
        pcUrl = pcUrl.replace(reg, '');
    }
    var mUrl = $.trim($('#mUrl').val());
    if (mUrl != 'undefined') {
        mUrl = mUrl.replace(reg, '');
    }
    var campaignList = {
        pcUrl: pcUrl,
        mUrl: mUrl
    };
    return campaignList;
}


/**
 * 比较两个日期大小
 * startDate 开始日期格式:2014-02-11
 * endDate 结束日期格式:2014-06-11
 */
function dateCompare(startDate, endDate) {
    var start = new Date(startDate).getTime();
    var end = new Date(endDate).getTime();
    if (end >= start) {
        return true;
    }
    return false;
}


//将当前时间格式化为yyyy-MM-dd
function getNowFormatDate() {
    var date = new Date();
    var year = date.getFullYear(); //获取完整的年份(1970开始)
    var month = date.getMonth() + 1;//获取当月(0-11)
    var day = date.getDate();  //获取当天(1-31)

    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (day >= 0 && day <= 9) {
        day = "0" + day;
    }
    return year + "-" + month + "-" + day;
}

/**
 * 校验梯度详情
 */
function validateDividedDetails(divideds) {
    var length = divideds.length;
    for (var i = 0; i < length; i++) {
        //最后一个梯度单独校验【终结金额必须为空】
        if (i == length - 1 && !_validateLastDividedDetail(divideds[i]))
            return false;
        //校验其余梯度【终结金额必须为空】
        if (i < length - 1 && !_validateDividedDetail(divideds[i]))
            return false;
        //校验当前梯度起始值是否是上一个梯度的结束值
        if (i > 0 && parseFloat(divideds[i].priceStart) != parseFloat(divideds[i - 1].priceEnd)) {
            alert("梯度起始值必须等于上一个梯度的结束值！");
            return false;
        }
    }
    return true;
}

function _validateDividedDetail(divided) {
    if (!isPositive($.trim(divided.priceStart), "10")) {
        alert("请设置恰当的起始金额！");
        return false;
    }
    if (!isPositive($.trim(divided.priceEnd), "11")) {
        alert("请设置恰当的结束金额！");
        return false;
    }
    if (parseFloat(divided.priceEnd) <= parseFloat(divided.priceStart)) {
        alert("结束金额不能小于开始金额！");
        return false;
    }
    if (!isPositive(divided.price, $.trim(divided.type)) || divided.price < 0) {
        alert("请设置恰当的分成比列和额度！");
        return false;
    }
    return true;
}

function _validateLastDividedDetail(divided) {
    if (!isPositive($.trim(divided.priceStart), "10")) {
        alert("请设置恰当的起始金额！");
        return false;
    }
    if (hasText(divided.priceEnd)) {
        alert('终结金额必须为空！');
        return false;
    }
    if (!isPositive(divided.price, $.trim(divided.type)) || divided.price < 0) {
        //if (!isPositive(divided.price, $.trim(divided.type))) {
        alert("请设置恰当的分成比列(两位小数)和额度！");
        return false;
    }
    return true;
}

var basicTemplete = $('tr[name=basicTemplete]');

/**
 * 增加渠道共同梯度(divided.vm)
 */
function addDividedDetail(e) {
    var tbody = $(e).parents('tbody');
    var lastTr = tbody.children('tr:last');
    var prevPriceEnd = lastTr.find('input[name=priceEnd]').val();
    if (!hasText(prevPriceEnd)) {
        alert('请设置金额梯度结束值！');
        return;
    }
    var prevPrice = lastTr.find('input[name=price]').val();
    if (!hasText(prevPrice)) {
        alert('请设置分成比例或者额度！');
        return;
    }
    //隐藏上一个梯度的删除操作按钮
    lastTr.find('span:last').hide();
    var newLastTr = basicTemplete.clone(true).show();
    //下一个梯度的起始值总是等于上一个梯度的结束值
    newLastTr.find('input[name=priceStart]').val(prevPriceEnd);
    //总是添加到最后一行
    tbody.append(newLastTr);
}

/**
 * 删除渠道共同梯度(divided.vm)
 */
function delDividedDetail(e) {

    //共同渠道必須保存一個
    if ($(e).parents('tbody[name=pageBasicDivided]').find('tr').size() == 1) {
        alert('该设置不能删除，至少得保存一个梯度设置！')
        return;
    }

    //刪除特殊渠道
    if ($(e).parents('tbody[name=basicChannelTbody]').find('tr').size() == 1) {
        $("div[name=basicChannelTemplete]").css("display", "none");
        var tr = $(e).parents('tbody[name=basicChannelTbody]').find('tr');
        tr.find("input[name=priceEnd]").val("");
        tr.find("input[name=price]").val("");
        return;
    }

    var currTr = $(e).parents('tr');
    var dividedDetailId = currTr.attr('data-id');
    //如果是新增的，可直接删除
    if (!hasText(dividedDetailId)) {
        currTr.prev().find('input[name=priceEnd]').val(null);
        currTr.prev().find('span').show();
        currTr.remove();
        return;
    }
    if (window.confirm('确认删除？')) {
        currTr.prev().find('input[name=priceEnd]').val(null);
        currTr.prev().find('span').show();
        currTr.remove();
        /*var detail = {id: currTr.attr('data-id')}
         deletedDetails.push(detail);*/
    }
}


/**
 * 页面--定额、百分比框设置
 */
function percent(obj) {
    var value = $(obj).val();
    var parent = $(obj).parent().parent(".group-inline-1x");
    var text = parent.children("#pageInput").children("span").text();
    if (2 == value) {
        parent.children("#pageInput").children("span").text("%");
    } else {
        parent.children("#pageInput").children("span").text("元");
    }
}

/**
 * 模板--定额、百分比框设置
 */
function basicChange(obj) {
    var value = $(obj).val();
    var parent = $(obj).parent().parent(".group-inline-1x");
    var text = parent.children("#basicInputSpan").children("span").text();
    if (2 == value) {
        parent.children("#basicInputSpan").children("span").text("%");
    } else {
        parent.children("#basicInputSpan").children("span").text("元");
    }
}


/**
 * 判断该对象是否是正的数组成
 * 要么是正整数，要么是小数
 */
function isPositive(number, type) {
    var result = false;
    var reg = /^\d+\.\d{0,2}$|^\d+$/;
    if (reg.test(number)) {
        result = true;
        if (parseInt(type) == 2 && parseFloat(number) > 100) {
            result = false;
        }
    }
    return result;
}


/**
 * 判断是否有文本
 */
function hasText(text) {
    var result = true;
    if (typeof text == "undefined" || text == null || $.trim(text) == '') {
        result = false;
    }
    return result;
}