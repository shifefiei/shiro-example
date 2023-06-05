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

    $("#saveRole").bind("click", function () {
        save();
    });
    function save() {
        var newName = $('#name').val();
        if (newName.length == 0) {
            alert('亲，请输入角色名称！');
            return false;
        }
        if (newName.length > 15) {
            alert('亲，角色名称过长！');
            return false;
        }
        count();
        var ids = $('#ids').val();
        if (ids.length == 0) {
            alert('亲，请选择权限！');
            return false;
        }
        var data = {
            roleId: $('#roleId').val(),
            ids: $('#ids').val(),
            name: newName
        };
        $.ajax({
            async: false,
            type: "post",
            data: data,
            url: "/role/saveRole",
            success: function (data) {
                if (data == "true") {
                    alert('操作成功!');
                    window.location.href = '/role/index';
                } else {
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
        var privileges = eval("(" + $('#privileges').val() + ")");
        $(privileges).each(function (ind) {
            //  	alert(privileges[ind]);
            //	if(privileges[ind].privilegeId != 1)
            treeObj.checkNode(treeObj.getNodeByParam("id", privileges[ind].privilegeId, null), true, true);
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
            url: "/privilege/findAll", //请求链接
            error: function () {
                alert('亲，网络有点不给力呀！');
            },
            success: function (data) {
                ztreeNodes = eval("[" + data + "]"); //将string类型转换成json对象
                $.fn.zTree.init($("#treeDemo"), setting, ztreeNodes);
                zTree_Menu = $.fn.zTree.getZTreeObj("treeDemo");
                var roleId = $('#roleId').val();
                if (roleId > 0)
                    assignCheck();
                expandAllFlag();
            }
        });
    }

    $(".newRole").bind("click", function () {
        $('#roleId').val("");
        $('#name').val("");
        $('#privileges').val("");
        $('#ids').val("");
        onloadZTree();
    });
    $(".modRoleOp").bind("click", function () {
        var roleId = $(this).data("roleid");
        $.ajax({
            url: "/role/modifyRole",
            type: 'post',
            cache: false,
            data: {
                'roleId': roleId
            },
            dataType: 'json',
            error: function () {
                alert("代码出错，请稍后再试！");
            },
            success: function (data) {
                $('#roleId').val(data.role.roleId);
                $('#name').val(data.role.roleName);
                $('#privileges').val(data.privileges);
                onloadZTree();
            }
        });
    });
    $(".delRoleOp").bind("click", function () {
        var roleId = $(this).data("roleid");
        $('#rId').val(roleId);
    });
    $(".delRole").bind("click", function () {
        var roleId = $('#rId').val();
        delRole(roleId);
    });
    function delRole(roleId) {
        $.ajax({
            url: "/role/delRole",
            type: 'post',
            cache: false,
            data: {
                'roleId': roleId
            },
            dataType: 'json',
            error: function () {
                alert("代码出错，请稍后再试！");
            },
            success: function (data) {
                if (data == true) {
                    alert('操作成功!');
                    window.location.href = '/role/index';
                } else {
                    alert('亲，操作失败，请稍后再试！');
                }
            }
        });
    }
});