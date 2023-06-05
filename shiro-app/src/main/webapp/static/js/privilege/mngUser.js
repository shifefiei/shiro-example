define([], function () {
    var dragId;
    var zTree_Menu;
    var setting = {
        view: {
            selectedMulti: false
        },
        check: {
            enable: true
        },
        data: {
            simpleData: {
                enable: true
            }
        },
        callback: {
            onCheck: onCheck
        }
    };
    var clearFlag = false;

    function onCheck(e, treeId, treeNode) {
        count();
        if (clearFlag) {
            clearCheckedOldNodes();
        }
    }

    function clearCheckedOldNodes() {
        var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
            nodes = zTree.getChangeCheckedNodes();
        for (var i = 0, l = nodes.length; i < l; i++) {
            nodes[i].checkedOld = nodes[i].checked;
        }
    }

    function count() {
        var zTree_Menu = $.fn.zTree.getZTreeObj("treeDemo");
        var nodes = zTree_Menu.getCheckedNodes(true);
        var ids = "";
        for (var i = 0, l = nodes.length; i < l; i++) {
            ids += nodes[i].id + ",";
        }
        $('#ids').val(ids);
    }

    $("#saveUser").bind("click", function () {
        save();
    });
    function save() {
        var newName = $('#name').val();
        if (newName.length == 0) {
            alert('亲，请输入erp账号！');
            return false;
        }
        if (newName.length > 30) {
            alert('亲，erp账号过长！');
            return false;
        }
        $('#userId').val(newName);
        count();
        var ids = $('#ids').val();
        if (ids.length == 0) {
            alert('亲，请选择角色！');
            return false;
        }
        var data = {
            userId: $('#userId').val(),
            ids: $('#ids').val(),
            id: $('#id').val()
        };
        $.ajax({
            async: false,
            type: "post",
            data: data,
            url: "/mngUser/saveUser",
            success: function (data) {
                if (data == "true") {
                    alert('操作成功!');
                    window.location.href = '/mngUser/index';
                } else {
                    if (data == "repeat") {
                        alert('亲，操作失败，该用户已存在！');
                    } else
                        alert('亲，操作失败，请稍后再试！');
                }
            },
            error: function () {
                alert("代码出错，请稍后再试！");
            }
        });
    }

    //展开全部
    function expandAllFlag() {
        zTree_Menu.expandAll(true);
    }

    //合并全部
    function combineAllFlag() {
        zTree_Menu.expandAll(false);
    }

    function assignCheck() {
        var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
        var roles = eval("(" + $('#roles').val() + ")");
        $(roles).each(function (ind) {
            treeObj.checkNode(treeObj.getNodeByParam("id", roles[ind].roleId, null), true, true);
        });

    }

    //加载ztree
    function onloadZTree() {
        var ztreeNodes;
        $.ajax({
            async: true, //是否异步
            cache: false, //是否使用缓存
            type: 'post', //请求方式,post
            dataType: "json", //数据传输格式
            url: "/role/findAll", //请求链接
            error: function () {
                alert('亲，网络有点不给力呀！');
            },
            success: function (data) {
                ztreeNodes = eval("[" + data + "]"); //将string类型转换成json对象
                $.fn.zTree.init($("#treeDemo"), setting, ztreeNodes);
                zTree_Menu = $.fn.zTree.getZTreeObj("treeDemo");
                var id = $('#id').val();
                if (id > 0)
                    assignCheck();
                expandAllFlag();
            }
        });
    }

    $(".newUser").bind("click", function () {
        $('#userId').val("");
        $('#userIdDiv').html("<input class='form-control' name='name' id='name'  type='text' placeholder=''>");
        $('#roles').val("");
        $('#ids').val("");
        $('#id').val("");
        onloadZTree();
    });
    $(".modUserOp").bind("click", function () {
        var userId = $(this).data("userid");
        $.ajax({
            url: "/mngUser/modifyUser",
            type: 'post',
            cache: false,
            data: {
                'userId': userId
            },
            dataType: 'json',
            error: function () {
                alert("代码出错，请稍后再试！");
            },
            success: function (data) {
                $('#id').val(data.user.id);
                $('#userId').val(data.user.userId);
                $('#userIdDiv').html(data.user.userId + "<input name='name' id='name' value='" + data.user.userId + "' type='hidden'>");
                $('#roles').val(data.roles);
                onloadZTree();
            }
        });
    });
    $(".delUserOp").bind("click", function () {
        var userId = $(this).data("userid");
        $('#uId').val(userId);
    });
    $(".delUser").bind("click", function () {
        var userId = $('#uId').val();
        delRole(userId);
    });
    function delRole(userId) {
        $.ajax({
            url: "/mngUser/delUser",
            type: 'post',
            cache: false,
            data: {
                'userId': userId
            },
            dataType: 'json',
            error: function () {
                alert("代码出错，请稍后再试！");
            },
            success: function (data) {
                if (data == true) {
                    alert('操作成功!');
                    window.location.href = '/mngUser/index';
                } else {
                    alert('亲，操作失败，请稍后再试！');
                }
            }
        });
    }

    $(".modStatusOp").bind("click", function () {
        var userId = $(this).data("userid");
        var status = $(this).data("status");
        $('#sId').val(userId);
        $('#uStatus').val(status);
    });
    $(".modStatus").bind("click", function () {
        var userId = $('#sId').val();
        var status = $('#uStatus').val();
        modStatus(userId, status);
    });
    function modStatus(userId, status) {
        $.ajax({
            url: "/mngUser/updateStatus",
            type: 'post',
            cache: false,
            data: {
                'userId': userId,
                'status': status
            },
            dataType: 'json',
            error: function () {
                alert("代码出错，请稍后再试！");
            },
            success: function (data) {
                if (data == true) {
                    alert('操作成功!');
                    window.location.href = '/mngUser/index';
                } else {
                    alert('亲，操作失败，请稍后再试！');
                }
            }
        });
    }

    $(".searchUsers").bind("click", function () {
        searchUsers();
    });
    function searchUsers() {
        var intReg = /^[A-Za-z0-9]+$/;
        var erp = toTrim($("#erp").val(), "");
        if (erp != '') {
            if (!intReg.test(erp)) {
                alert('请正确输入erp账号!');
                return false;
            }
        }
        var form = document.forms['queryForm'];
        $("#pageIndex").val('0');
        form.action = '/mngUser/index';
        form.submit();
    }
});