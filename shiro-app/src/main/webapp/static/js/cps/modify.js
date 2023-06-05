function checkName() {
    var name = $.trim($("#campaignName").val());
    if ('undefined' == name || "" == name) {
        alert("请填写推广名称");
        return false;
    }
    return true;
}

//cpa 行为明细
function checkAction() {
    var action = $.trim($("#price").val());
    if ('undefined' == action || "" == action) {
        alert("请填写有效行为数");
        return false;
    } else {
        if (isPositive(action)) {
            return true;
        }
        alert("请填写有效行为数");
        return false;
    }
    return true;
}

$(document).ready(function () {

    //单品修改保存
    $('#singleCampaign').click(function () {

        var campaignName = $.trim($('#campaignName').val());
        var pageType = $.trim($('#pageType option:selected').val());
        var campaignSummary = $.trim($("#campaignSummary").val());
        var startTime = $.trim($('#startTime').val());
        var endTime = $.trim($('#endTime').val());
        var campaignId = $.trim($('#campaignId').val());
        var skuId = $.trim($('#skuId').val());
        //基础梯度
        var basicDivides = getSkuDivideds();
        if (null != basicDivides) {

            //素材链接
            var campaignImg = findModifiedUrl();
            var campaign = {
                campaignId: campaignId,
                skuId: skuId,
                campaignName: campaignName,
                campaignSummary: campaignSummary,
                pageType: pageType,
                startTime: startTime,
                endTime: endTime,
                campaignImg: campaignImg,
                skuRuleDetails: basicDivides,
                unionSkuRule: settingCpsSku()
            };
            //console.info("singleCampaign button: " + JSON.stringify(campaign));
            if (checkName()) {
                if (endTime != "") {
                    if (dateCompare(startTime, endTime)) {
                        $.ajax({
                            url: '/delivery/cps/change/save',
                            type: 'post',
                            dataType: 'json',
                            data: JSON.stringify(campaign),
                            contentType: 'application/json;charset=utf-8',
                            success: function (data) {
                                var code = parseInt(data.code);
                                if (code == 1) {
                                    alert("单品推广修改成功");
                                    window.location.href = "/delivery/cps/index";
                                } else {
                                    alert("单品推广修改失败");
                                    window.location.href = window.location;
                                }
                            }
                        });
                    } else {
                        alert("结束时间必须大于起始时间");
                    }
                } else {
                    $.ajax({
                        url: '/delivery/cps/change/save',
                        type: 'post',
                        dataType: 'json',
                        data: JSON.stringify(campaign),
                        contentType: 'application/json;charset=utf-8',
                        success: function (data) {
                            var code = parseInt(data.code);
                            if (code == 1) {
                                alert("单品推广修改成功");
                                window.location.href = "/delivery/cps/index";
                            } else {
                                alert("单品推广修改失败");
                                window.location.href = window.location;
                            }
                        }
                    });
                }
            }
        }

    });

    //活动修改保存
    $('#activityButton').click(function () {

        var campaignName = $.trim($('#campaignName').val());
        var pageType = $.trim($('#pageType option:selected').val());
        var campaignSummary = $.trim($("#campaignSummary").val());
        var startTime = $.trim($('#startTime').val());
        var endTime = $.trim($('#endTime').val());
        var campaignId = $.trim($('#campaignId').val());
        var skuId = $.trim($('#skuId').val());

        //素材链接
        var campaignImg = findModifiedUrl();
        var campaign = {
            campaignId: campaignId,
            skuId: skuId,
            campaignName: campaignName,
            campaignSummary: campaignSummary,
            pageType: pageType,
            startTime: startTime,
            endTime: endTime,
            campaignImg: campaignImg,
            campaignList: settingLink(),//活动有推广链接，但是推广链接不允许修改
            unionSkuRule: settingCpsSku()
        };
        console.info("activityButton button: " + JSON.stringify(campaign));
        if (checkName()) {
            if (endTime != "") {
                if (dateCompare(startTime, endTime)) {
                    $.ajax({
                        url: '/delivery/cps/change/save',
                        type: 'post',
                        dataType: 'json',
                        data: JSON.stringify(campaign),
                        contentType: 'application/json;charset=utf-8',
                        success: function (data) {
                            var code = parseInt(data.code);
                            if (code == 1) {
                                alert("活动推广修改成功");
                                window.location.href = "/delivery/cps/index";
                            } else {
                                alert("活动推广修改失败");
                                window.location.href = window.location;
                            }
                        }
                    });
                } else {
                    alert("结束时间必须大于起始时间");
                }
            } else {
                $.ajax({
                    url: '/delivery/cps/change/save',
                    type: 'post',
                    dataType: 'json',
                    data: JSON.stringify(campaign),
                    contentType: 'application/json;charset=utf-8',
                    success: function (data) {
                        var code = parseInt(data.code);
                        if (code == 1) {
                            alert("活动推广修改成功");
                            window.location.href = "/delivery/cps/index";
                        } else {
                            alert("活动推广修改失败");
                            window.location.href = window.location;
                        }
                    }
                });
            }
        }
    });


    //cpa修改
    $('#cpaModifyButton').click(function () {
        var campaignName = $.trim($('#campaignName').val());
        var campaignSummary = $.trim($("#campaignSummary").val());
        var startTime = $.trim($('#startTime').val());
        var endTime = $.trim($('#endTime').val());
        var campaignId = $.trim($('#campaignId').val());
        var skuId = $.trim($('#skuId').val());

        //素材链接
        var campaignImg = findModifiedUrl();
        var sku = $.trim($('#sku').val());
        var projectType = $.trim($('#skuProjectType option:selected').val());
        var skuRule = {
            sku: sku,
            projectType: projectType
        };

        //佣金梯度
        var tabTr = $('tbody[name=cpa-modified-tab]').children("tr:eq(0)");
        var details = [];
        var detail = {
            id: tabTr.attr("id"),
            skuRuleId: tabTr.attr("class"),
            type: '1',
            price: $.trim($('#price').val())
        };
        details.push(detail);

        var campaign = {
            campaignId: campaignId,
            skuId: skuId,
            campaignName: campaignName,
            campaignSummary: campaignSummary,
            startTime: startTime,
            endTime: endTime,
            campaignImg: campaignImg,
            skuRuleDetails: details,
            campaignList: settingLink(),//活动有推广链接，但是推广链接不允许修改
            unionSkuRule: skuRule
        };

        //console.info("cpa modify button: " + JSON.stringify(campaign));
        if (checkAction() && checkName()) {
            if (endTime != "") {
                if (dateCompare(startTime, endTime)) {
                    $.ajax({
                        url: '/delivery/cpa/change/save',
                        type: 'post',
                        dataType: 'json',
                        data: JSON.stringify(campaign),
                        contentType: 'application/json;charset=utf-8',
                        success: function (data) {
                            var code = parseInt(data.code);
                            if (code == 1) {
                                alert("推广修改成功");
                                window.location.href = "/delivery/cpa/index";
                            } else {
                                alert("修改推广失败");
                                window.location.href = window.location;
                            }
                        }
                    });
                } else {
                    alert("结束时间必须大于起始时间");
                }
            } else {
                $.ajax({
                    url: '/delivery/cpa/change/save',
                    type: 'post',
                    dataType: 'json',
                    data: JSON.stringify(campaign),
                    contentType: 'application/json;charset=utf-8',
                    success: function (data) {
                        var code = parseInt(data.code);
                        if (code == 1) {
                            alert("推广修改成功");
                            window.location.href = "/delivery/cpa/index";
                        } else {
                            alert("修改推广失败");
                            window.location.href = window.location;
                        }
                    }
                });
            }
        }
    });


});

/**
 * 获取所有基础梯度设置
 */
function getSkuDivideds() {
    var details = [];
    var tbody = $('tbody[name=pageBasicDivided]');
    tbody.children('tr').each(function () {
        var detail = {
            id: $(this).attr("id"),
            skuRuleId: $(this).attr("class"),
            priceStart: $(this).find('input[name=priceStart]').val(),
            priceEnd: $(this).find('input[name=priceEnd]').val(),
            type: $(this).find('select[name=type]').val(),
            price: $(this).find('input[name=price]').val()
        }
        details.push(detail);
    })
    if (details.length < 1) {
        alert('请至少设置一个梯度！');
        return null;
    }
    //校验梯度详情
    if (!validateDividedDetails(details)) {
        return null;
    }
    return details;
}

function findModifiedUrl() {
    var images = [];
    var tab = document.getElementById("cps_picture_list");
    for (var i = 0; i < tab.rows.length; i++) {
        var id = tab.rows[i].id;
        var campaignId = tab.rows[i].className;
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
            id: id,
            campaignId: campaignId,
            name: name,
            img: url,
            width: sizes[0],
            height: sizes[1]
        }
        images.push(img);
    }
    return images;
}
function checkName() {
    var name = $.trim($("#campaignName").val());
    if ('undefined' == name || "" == name) {
        alert("请填写推广名称");
        return false;
    }
    return true;
}

//cpa 行为明细
function checkAction() {
    var action = $.trim($("#price").val());
    if ('undefined' == action || "" == action) {
        alert("请填写有效行为数");
        return false;
    } else {
        if (isPositive(action)) {
            return true;
        }
        alert("请填写有效行为数");
        return false;
    }
    return true;
}

$(document).ready(function () {

    //单品修改保存
    $('#singleCampaign').click(function () {

        var campaignName = $.trim($('#campaignName').val());
        var pageType = $.trim($('#pageType option:selected').val());
        var campaignSummary = $.trim($("#campaignSummary").val());
        var startTime = $.trim($('#startTime').val());
        var endTime = $.trim($('#endTime').val());
        var campaignId = $.trim($('#campaignId').val());
        var skuId = $.trim($('#skuId').val());
        //基础梯度
        var basicDivides = getSkuDivideds();
        if (null != basicDivides) {

            //素材链接
            var campaignImg = findModifiedUrl();
            var campaign = {
                campaignId: campaignId,
                skuId: skuId,
                campaignName: campaignName,
                campaignSummary: campaignSummary,
                pageType: pageType,
                startTime: startTime,
                endTime: endTime,
                campaignImg: campaignImg,
                skuRuleDetails: basicDivides,
                unionSkuRule: settingCpsSku()
            };
            //console.info("singleCampaign button: " + JSON.stringify(campaign));
            if (checkName()) {
                if (endTime != "") {
                    if (dateCompare(startTime, endTime)) {
                        $.ajax({
                            url: '/delivery/cps/change/save',
                            type: 'post',
                            dataType: 'json',
                            data: JSON.stringify(campaign),
                            contentType: 'application/json;charset=utf-8',
                            success: function (data) {
                                var code = parseInt(data.code);
                                if (code == 1) {
                                    alert("单品推广修改成功");
                                    window.location.href = "/delivery/cps/index";
                                } else {
                                    alert("单品推广修改失败");
                                    window.location.href = window.location;
                                }
                            }
                        });
                    } else {
                        alert("结束时间必须大于起始时间");
                    }
                } else {
                    $.ajax({
                        url: '/delivery/cps/change/save',
                        type: 'post',
                        dataType: 'json',
                        data: JSON.stringify(campaign),
                        contentType: 'application/json;charset=utf-8',
                        success: function (data) {
                            var code = parseInt(data.code);
                            if (code == 1) {
                                alert("单品推广修改成功");
                                window.location.href = "/delivery/cps/index";
                            } else {
                                alert("单品推广修改失败");
                                window.location.href = window.location;
                            }
                        }
                    });
                }
            }
        }

    });

    //活动修改保存
    $('#activityButton').click(function () {

        var campaignName = $.trim($('#campaignName').val());
        var pageType = $.trim($('#pageType option:selected').val());
        var campaignSummary = $.trim($("#campaignSummary").val());
        var startTime = $.trim($('#startTime').val());
        var endTime = $.trim($('#endTime').val());
        var campaignId = $.trim($('#campaignId').val());
        var skuId = $.trim($('#skuId').val());

        //素材链接
        var campaignImg = findModifiedUrl();
        var campaign = {
            campaignId: campaignId,
            skuId: skuId,
            campaignName: campaignName,
            campaignSummary: campaignSummary,
            pageType: pageType,
            startTime: startTime,
            endTime: endTime,
            campaignImg: campaignImg,
            campaignList: settingLink(),//活动有推广链接，但是推广链接不允许修改
            unionSkuRule: settingCpsSku()
        };
        console.info("activityButton button: " + JSON.stringify(campaign));
        if (checkName()) {
            if (endTime != "") {
                if (dateCompare(startTime, endTime)) {
                    $.ajax({
                        url: '/delivery/cps/change/save',
                        type: 'post',
                        dataType: 'json',
                        data: JSON.stringify(campaign),
                        contentType: 'application/json;charset=utf-8',
                        success: function (data) {
                            var code = parseInt(data.code);
                            if (code == 1) {
                                alert("活动推广修改成功");
                                window.location.href = "/delivery/cps/index";
                            } else {
                                alert("活动推广修改失败");
                                window.location.href = window.location;
                            }
                        }
                    });
                } else {
                    alert("结束时间必须大于起始时间");
                }
            } else {
                $.ajax({
                    url: '/delivery/cps/change/save',
                    type: 'post',
                    dataType: 'json',
                    data: JSON.stringify(campaign),
                    contentType: 'application/json;charset=utf-8',
                    success: function (data) {
                        var code = parseInt(data.code);
                        if (code == 1) {
                            alert("活动推广修改成功");
                            window.location.href = "/delivery/cps/index";
                        } else {
                            alert("活动推广修改失败");
                            window.location.href = window.location;
                        }
                    }
                });
            }
        }
    });


    //cpa修改
    $('#cpaModifyButton').click(function () {
        var campaignName = $.trim($('#campaignName').val());
        var campaignSummary = $.trim($("#campaignSummary").val());
        var startTime = $.trim($('#startTime').val());
        var endTime = $.trim($('#endTime').val());
        var campaignId = $.trim($('#campaignId').val());
        var skuId = $.trim($('#skuId').val());

        //素材链接
        var campaignImg = findModifiedUrl();
        var sku = $.trim($('#sku').val());
        var projectType = $.trim($('#skuProjectType option:selected').val());
        var skuRule = {
            sku: sku,
            projectType: projectType
        };

        //佣金梯度
        var tabTr = $('tbody[name=cpa-modified-tab]').children("tr:eq(0)");
        var details = [];
        var detail = {
            id: tabTr.attr("id"),
            skuRuleId: tabTr.attr("class"),
            type: '1',
            price: $.trim($('#price').val())
        };
        details.push(detail);

        var campaign = {
            campaignId: campaignId,
            skuId: skuId,
            campaignName: campaignName,
            campaignSummary: campaignSummary,
            startTime: startTime,
            endTime: endTime,
            campaignImg: campaignImg,
            skuRuleDetails: details,
            campaignList: settingLink(),//活动有推广链接，但是推广链接不允许修改
            unionSkuRule: skuRule
        };

        //console.info("cpa modify button: " + JSON.stringify(campaign));
        if (checkAction() && checkName()) {
            if (endTime != "") {
                if (dateCompare(startTime, endTime)) {
                    $.ajax({
                        url: '/delivery/cpa/change/save',
                        type: 'post',
                        dataType: 'json',
                        data: JSON.stringify(campaign),
                        contentType: 'application/json;charset=utf-8',
                        success: function (data) {
                            var code = parseInt(data.code);
                            if (code == 1) {
                                alert("推广修改成功");
                                window.location.href = "/delivery/cpa/index";
                            } else {
                                alert("修改推广失败");
                                window.location.href = window.location;
                            }
                        }
                    });
                } else {
                    alert("结束时间必须大于起始时间");
                }
            } else {
                $.ajax({
                    url: '/delivery/cpa/change/save',
                    type: 'post',
                    dataType: 'json',
                    data: JSON.stringify(campaign),
                    contentType: 'application/json;charset=utf-8',
                    success: function (data) {
                        var code = parseInt(data.code);
                        if (code == 1) {
                            alert("推广修改成功");
                            window.location.href = "/delivery/cpa/index";
                        } else {
                            alert("修改推广失败");
                            window.location.href = window.location;
                        }
                    }
                });
            }
        }
    });


});

/**
 * 获取所有基础梯度设置
 */
function getSkuDivideds() {
    var details = [];
    var tbody = $('tbody[name=pageBasicDivided]');
    tbody.children('tr').each(function () {
        var detail = {
            id: $(this).attr("id"),
            skuRuleId: $(this).attr("class"),
            priceStart: $(this).find('input[name=priceStart]').val(),
            priceEnd: $(this).find('input[name=priceEnd]').val(),
            type: $(this).find('select[name=type]').val(),
            price: $(this).find('input[name=price]').val()
        }
        details.push(detail);
    })
    if (details.length < 1) {
        alert('请至少设置一个梯度！');
        return null;
    }
    //校验梯度详情
    if (!validateDividedDetails(details)) {
        return null;
    }
    return details;
}

function findModifiedUrl() {
    var images = [];
    var tab = document.getElementById("cps_picture_list");
    for (var i = 0; i < tab.rows.length; i++) {
        var id = tab.rows[i].id;
        var campaignId = tab.rows[i].className;
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
            id: id,
            campaignId: campaignId,
            name: name,
            img: url,
            width: sizes[0],
            height: sizes[1]
        }
        images.push(img);
    }
    return images;
}
