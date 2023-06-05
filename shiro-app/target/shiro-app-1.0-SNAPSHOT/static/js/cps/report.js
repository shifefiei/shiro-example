function loadData(startDate, endDate, pidFlag) {
    var requestData = $.extend({}, {startDate: startDate, endDate: endDate, pidFlag: pidFlag});
    var ids = {};
    var tableTrDoms = {};
    $("#dataTBody >tr").each(function (_index) {
        var _this = $(this);
        var id = _this.metadata().id;

        ids[_index] = id;
        tableTrDoms[id] = _this;
    });
    requestData["ids"] = ids;

    $.ajax({
        data: requestData,
        url: '/stats/report',
        success: function (data) {
            var content = data.content;
            //console.info(JSON.stringify(content));
            $("#startDate").val(content.startDate);
            $("#endDate").val(content.endDate);
            for (var id in content.dataObject) {
                fillTableItem(tableTrDoms[id], content.dataObject[id]);
            }
        }
    });
}

function accumulatorObject(_array) {
    var result = {};
    var biglen = Object.keys(_array[0]).length;
    var bigIndex = 0;
    for (var i = 1; i < _array.length; i++) {
        if (biglen < Object.keys(_array[i]).length) {
            biglen = Object.keys(_array[i]).length;
            bigIndex = i;
        }
    }
    var objDelegate = _array[bigIndex];
    for (var prop in objDelegate) {
        var propItemValue = 0;
        for (var i = 0; i < _array.length; i++) {
            var innerVal = _array[i][prop];
            if (isNaN(innerVal)) {
                //如果该属性不是数值
                innerVal = 0;
            }
            propItemValue = propItemValue + parseFloat(innerVal);
        }
        result[prop] = propItemValue;
    }
    return result;
}
