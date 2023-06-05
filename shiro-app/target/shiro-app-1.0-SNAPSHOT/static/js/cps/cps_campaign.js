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

function checkProjectType() {
    var projectType = $("#skuProjectType option:selected").val();
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

function checkSku() {
    var sku = $.trim($("#sku").val());
    if ('undefined' == sku || "" == sku) {
        alert("请填写SKU");
        return false;
    }
    return true;
}


$(document).ready(function () {

    //新建推广
    $('#formButton').click(function () {
        var pageType = $.trim($('#pageType option:selected').val());
        var skuBizType = $.trim($("#skuBizType").val());

        var divided = getBasicSkuDivideds(pageType, skuBizType);
        //判断梯度校验是否通过
        if (divided != null) {
            var isPass = false;
            if (parseInt(pageType) == 0) {
                //单品推广表单校验
                isPass = checkProjectType() && checkName() && checkSku() && checkStartTime() && checkEndTime();
            } else {
                //活动推广表单校验
                isPass = checkName() && checkUrl() && checkStartTime() && checkEndTime();
            }
            if (isPass) {
                var start = $.trim($("#startTime").val());
                var end = $.trim($("#endTime").val());

                //推广起始时间必须大于等于今天
                var nowDate = dateCompare(getNowFormatDate(), start);
                if (nowDate) {
                    //结束时间必须大于等于起始时间
                    if (dateCompare(start, end)) {
                        var campaign = settingCpsCampaign();
                        if (campaign != null) {
                            console.info("form button: " + JSON.stringify(campaign));
                            $.ajax({
                                url: '/delivery/cps/creation',
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
                                        alert("创建失败");
                                    }
                                    window.location.href = "/delivery/cps/index";
                                }
                            });
                        }
                    } else {
                        alert("结束时间必须大于等于起始时间");
                    }
                } else {
                    alert("推广起始时间必须大于等于今天");
                }
            }
        }
    });

    //页面加载时展示用户所属业务线
    $.ajax({
        url: '/delivery/cps/business/type',
        type: 'get',
        dataType: 'json',
        success: function (result) {
            var data = result.projectType;
            var code = result.code;
            $("#skuProjectType").append("<option value='-1' selected='selected'>请选择</option>");
            if (data != null && 'undefined' != data) {
                for (var i = 0; i < data.length; i++) {
                    for (var key in code) {
                        if (key == data[i] && data[i] != 90001 && data[i] != 90002) {
                            $("#skuProjectType").append('<option value="' + key + '">' + code[key] + '</option>');
                        }
                    }
                }
            }
        }
    });


});

function settingCpsCampaign() {
    var campaignName = $.trim($('#campaignName').val());
    var pageType = $.trim($('#pageType option:selected').val());
    var campaignSummary = $.trim($("#campaignSummary").val());
    var startTime = $.trim($('#startTime').val());
    var endTime = $.trim($('#endTime').val());
    var bizProduct = $.trim($('#skuBizType').val());  //白拿特殊处理

    //基础梯度:只有单品才设置梯度
    var basicDivides = [];
    if (pageType == 0 && parseInt(bizProduct) != 2002) {
        basicDivides = getBasicSkuDivideds();
        if (basicDivides == null) {
            return null;
        }
    }

    //素材链接
    var campaignImg = findAllImgUrl();
    var campaign = {
        campaignName: campaignName,
        campaignSummary: campaignSummary,
        pageType: pageType,
        startTime: startTime,
        endTime: endTime,
        campaignList: settingLink(),
        campaignImg: campaignImg,
        skuRuleDetails: basicDivides,
        unionSkuRule: settingCpsSku()
    };
    return campaign;
}

//获取所有基础梯度设置
function getBasicSkuDivideds(pageType, skuBizType) {
    var details = [];
    var tbody = $('tbody[name=pageBasicDivided]');
    tbody.children('tr').each(function () {
        var detail = {
            priceStart: $(this).find('input[name=priceStart]').val(),
            priceEnd: $(this).find('input[name=priceEnd]').val(),
            type: $(this).find('select[name=type]').val(),
            price: $(this).find('input[name=price]').val()
        }
        details.push(detail);
    })
    if (parseInt(pageType) != 1 && parseInt(skuBizType) != 2002) {
        if (details.length < 1) {
            alert('请至少设置一个梯度！');
            return null;
        }
        //校验梯度详情
        if (!validateDividedDetails(details)) {
            return null;
        }
    }
    return details;
}

//二级：保险项目--->三级：小白理财、白拿、定期理财
function checkInsurance() {
    var skuProjectType = parseInt($.trim($('#skuProjectType option:selected').val()));

    //判断梯度列表是否显示:白拿中可能隐藏
    var baiNaCss = $("#detailsTable").css("display");
    if (baiNaCss == 'none') {
        $("#detailsTable").css("display", "block");
    }

    //判断小白理财档位显示时则隐藏
    var secondLevelCss = $("#secondLevel").css("display");
    if (secondLevelCss == 'block') {
        var thirdLevelCss = $("#thirdLevel").css("display");
        if (thirdLevelCss == "block") {
            $("#thirdLevel").css("display", "none");
            $("#thirdLevel option:selected").attr("selected", false);

            //sku置空且可操作
            $("#sku").val(null);
            $("#sku").removeAttr("readonly");
        }
    }
    //保险项目
    if (102 == skuProjectType) {
        $("#secondLevel").css("display", "block");//显示小白理财、白拿、定期理财
    } else {
        $("#secondLevel").css("display", "none");
        $("#secondLevel option:selected").attr("selected", false);

        //sku置空且可操作
        $("#sku").val(null);
        $("#sku").removeAttr("readonly");
    }
}

//三级分类：小白理财--->四级分类：年年盈、天天盈
function checkBlankNote() {
    var skuBizType = parseInt($.trim($("#skuBizType option:selected").val()));

    //白拿
    if (2002 == skuBizType) {
        clearDivided();
    } else {
        $("#detailsTable").css("display", "block");
    }

    //小白理财档位：天天盈，年年盈等
    if (2001 == skuBizType) {
        $("#thirdLevel").css("display", "block");
        $.ajax({
            url: "/delivery/cps/white",
            type: "get",
            dataType: "json",
            success: function (data) {
                var result = data.blankNoteVos;
                if (result != 'undefined' && result.length > 0) {
                    $("#skuBizProduct").empty();
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].gradeId == 27) {
                            //TODO 线上是3,年年盈
                            $("#skuBizProduct").append("<option value='" + result[i].gradeId + "'>" + result[i].gradeName + "</option>");
                            $("#sku").val(result[i].releventId);
                            $("#sku").attr("readonly", "true");
                        }
                    }
                }

            }
        });
    } else {
        $("#thirdLevel").css("display", "none");
        //隐藏后要清空值
        $("#skuBizProduct").empty();

        //sku置空且可操作
        $("#sku").val(null);
        $("#sku").removeAttr("readonly");
    }

}

//页面类型：活动推广、单品推广
function checkPageType() {
    var pageType = parseInt($.trim($("#pageType option:selected").val()));
    if (pageType == 0) {
        //清空名称和描述
        clearNameAndSummary();

        //清空链接并隐藏
        $("#mAndPc").css("display", "none");
        $("#pcUrl").val("");
        $("#mUrl").val("");

        //显示梯度
        $("#detailsTable").css("display", "block");

        //显示计费类型
        $("#activityCmsType").css("display", "block");
        $("#cmsType").empty();
        $("#cmsType").append("<option value='1' selected='selected'>销售额</option>");
        //$("#cmsType").append("<option value='2'>保有量</option>");

        //显示业务类型
        $("#projectType").css("display", "block");

        //sku置空且可操作
        $("#sku").val(null);
        $("#sku").removeAttr("readonly");
        $("#activitySku").css("display", "block");

        //重置sku的业务类型和二级分类
        resetSkuType();

    } else {
        //清空名称和描述
        clearNameAndSummary();

        //显示链接并清空
        $("#mAndPc").css("display", "block");
        $("#pcUrl").val("");
        $("#mUrl").val("");

        //活动推广没有梯度
        clearDivided();

        //清空SKU
        $("#sku").val(null);
        $("#activitySku").css("display", "none");

        //清空计费类型
        $("#activityCmsType").css("display", "none");
        $("#cmsType").empty();
        $("#cmsType").append("<option value='-1' selected='selected'></option>");

        //清空业务类型、二级分类和三级分类
        var projectType = parseInt($.trim($("#projectType option:selected").val()));
        if (projectType == -1 || projectType == 102 || projectType == 10002) {
            $("#projectType").css("display", "none");
            $("#secondLevel").css("display", "none");
            $("#thirdLevel").css("display", "none");
        }
    }
}

//重置sku的业务类型和二级分类
function resetSkuType() {
    var val = $("#skuProjectType option:selected").val();
    if (parseInt(val) != -1) {
        $("#skuProjectType option:selected").removeAttr("selected");
    }

    var val = $("#skuBizType option:selected").val();
    if (parseInt(val) != -1) {
        $("#skuBizType option:selected").removeAttr("selected");
    }
}

function clearNameAndSummary() {
    $("#campaignName").val(null);
    $("#campaignSummary").val(null);
}

function clearDivided() {
    $("#detailsTable").css("display", "none");
    $("tbody[name=pageBasicDivided]").children("tr:gt(0)").each(function () {
        $(this).remove();
    });
    $("input[name=priceEnd]").val("");
    $("input[name=price]").val("");
}

