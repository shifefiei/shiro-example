function checkProjectType() {
    var projectType = $("#projectType option:selected").val();
    if (parseInt(projectType) == -1) {
        alert("请选择业务类型");
        return false;
    }
    return true;
}

function checkName() {
    var name = $.trim($("#campaignName").val());
    if ('undefined' == name || "" == name) {
        alert("请填写推广名称");
        return false;
    }
    return true;
}

function checkUrl() {
    var pcUrl = $.trim($("#pcUrl").val());
    var mUrl = $.trim($("#mUrl").val());
    if ('undefined' == pcUrl || "" == pcUrl || 'undefined' == mUrl || "" == mUrl) {
        alert("请填全产品链接");
        return false;
    } else {
        var url = /^((https|http):)?\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/;
        if (!url.test(mUrl)) {
            alert("M端产品链接不合法");
            return false;
        } else {
            if (!url.test(pcUrl)) {
                alert("PC端产品链接不合法");
                return false;
            }
            return true;
        }
    }
    return true;
}

function checkStartTime() {
    var startTime = $.trim($("#startTime").val());
    if ('undefined' == startTime || "" == startTime) {
        alert("请选择推广开始时间");
        return false;
    }
    return true;
}

function checkEndTime() {
    var endTime = $.trim($("#endTime").val());
    if ('undefined' == endTime || "" == endTime) {
        alert("请选择推广结束时间");
        return false;
    }
    return true;
}

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

    //用户所属业务线
    $.ajax({
        url: '/delivery/cps/business/type',
        type: 'get',
        dataType: 'json',
        success: function (result) {
            var data = result.projectType;
            var code = result.code;
            $("#projectType").append("<option value='-1' selected='selected'>请选择</option>");
            if (data != null && 'undefined' != data) {
                for (var i = 0; i < data.length; i++) {
                    for (var key in code) {
                        if (key == data[i] && (data[i] == 90001 || data[i] == 90002)) {
                            $("#projectType").append('<option value="' + key + '">' + code[key] + '</option>');
                        }
                    }
                }
            }
        }
    });

    $('#formButton').click(function () {
        var isPass = checkProjectType() && checkName() && checkUrl() && checkStartTime() && checkEndTime() && checkAction();
        if (isPass) {
            var start = $.trim($("#startTime").val());
            var end = $.trim($("#endTime").val());

            var nowDate = dateCompare(getNowFormatDate(), start);
            if (nowDate) {
                if (dateCompare(start, end)) {
                    var campaign = settingCpaCampaign();
                    console.info("cpa form button: " + JSON.stringify(campaign));
                    $.ajax({
                        url: '/delivery/cpa/creation',
                        type: 'post',
                        dataType: 'json',
                        data: JSON.stringify(campaign),
                        contentType: 'application/json;charset=utf-8',
                        success: function (data) {
                            var status = parseInt(data.code);
                            if (status == 1002) {
                                alert("创建广告成功");
                            }
                            if (status == 1001) {
                                alert("SKU对应的推广已存在");
                            }
                            if (status == 1000) {
                                alert("表单SKU参数有误");
                            }
                            if (status == 1003) {
                                alert("创建失败");
                            }
                            window.location.href = "/delivery/cpa/index";
                        }

                    });
                } else {
                    alert("结束时间必须大于等于起始时间");
                }
            } else {
                alert("推广起始时间必须大于等于今天");
            }


        }

    });

});

function settingCpaCampaign() {
    var campaignName = $.trim($('#campaignName').val());
    var campaignSummary = $.trim($("#campaignSummary").val());
    var startTime = $.trim($('#startTime').val());
    var endTime = $.trim($('#endTime').val());

    //素材链接
    var campaignImg = findAllImgUrl();

    //佣金固定额度
    var details = [];
    var detail = {
        price: $.trim($('#price').val()),
        type: '1'
    };
    details.push(detail);

    var campaign = {
        campaignName: campaignName,
        campaignSummary: campaignSummary,
        pageType: "2",
        startTime: startTime,
        endTime: endTime,
        campaignList: settingLink(),
        campaignImg: campaignImg,
        skuRuleDetails: details,
        unionSkuRule: settingCpaSku()
    };

    return campaign;
}

//sku设置
function settingCpaSku() {
    var sku = $.trim($('#sku').val());
    var projectType = $.trim($('#projectType').val());
    var skuRule = {
        sku: sku,
        projectType: projectType
    };
    return skuRule;
}

function getCpaVirtualSku(obj) {
    var virtualSku = obj.options[obj.options.selectedIndex].value;
    $.ajax({
        url: '/delivery/cpa/virtual/' + virtualSku,
        type: 'get',
        dataType: 'json',
        success: function (data) {
            $("#sku").val(data.sku);
        }


    });
}