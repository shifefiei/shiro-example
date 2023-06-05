define([], function () {
    var dragId;
    var zTree_Menu;
    var setting = {
        view: {
            addHoverDom: addHoverDom,
            removeHoverDom: removeHoverDom,
            dblClickExpand: dblClickExpand,
            showLine: false,
            selectedMulti: false,
            showIcon: true
        },
        edit: {
            enable: true,
            showRemoveBtn: showRemoveBtn,
            showRenameBtn: showRenameBtn,
            removeTitle: "删除",
            renameTitle: "编辑",
            drag: {
                prev: true,
                next: true,
                inner: false
            },
            editNameSelectAll: true
        },
        data: {
            simpleData: {
                enable: true
            }
        },
        callback: {
            beforeEditName: beforeEditName,
            beforeRemove: beforeRemove,
            onRemove: onRemove
        }
    };

    function dblClickExpand(treeId, treeNode) {
        return treeNode.level > 0;
    }

    function beforeEditName(treeId, treeNode) {//用于捕获节点编辑按钮的 click 事件，并且根据返回值确定是否允许进入名称编辑状态
        $('#id').val(treeNode.id);
        $('#pId').val(treeNode.pId);
        $('#name').val(treeNode.name);
        $('#level').val(treeNode.level);
        $('#code').val(treeNode.code);
        $('#result').show();
    }

    function beforeRemove(treeId, treeNode) {//用于捕获节点被删除之前的事件回调函数，并且根据返回值确定是否允许删除操作
        var zTree = $.fn.zTree.getZTreeObj("treeDemo");
        zTree.selectNode(treeNode);
        var confirmFlag = confirm("该操作同时将删除已关联的角色权限，确认删除[ " + treeNode.name + " ]吗？");
        var confirmVal = false;
        if (confirmFlag) {
            var data = {
                id: treeNode.id
            };
            $.ajax({
                async: false,
                type: "post",
                data: data,
                url: "/privilege/delete",
                success: function (data) {
                    if (data == 0) {
                        alert('亲，删除失败！');
                    } else {
                        confirmVal = true;
                    }
                },
                error: function () {
                    alert("代码出错，请稍后再试！");
                }
            });
        }
        return confirmVal;
    }

    function onRemove(e, treeId, treeNode) {//用于捕获删除节点之后的事件回调函数
        alert('亲，删除成功！');
        window.location.href = '/privilege/index';
    }

    $(".savePri").bind("click", function () {
        save();
    });
    function save() {
        var newName = $('#name').val();
        if (newName.length == 0) {
            alert('亲，请输入资源名称！');
            return false;
        }
        if (newName.length > 15) {
            alert('亲，资源名称过长！');
            return false;
        }
        var newCode = $('#code').val();
        if (newCode.length == 0) {
            alert('亲，请输入资源码！');
            return false;
        }
        if (newCode.length > 25) {
            alert('亲，资源码过长！');
            return false;
        }
        var data = {
            id: $('#id').val(),
            pId: $('#pId').val(),
            name: newName,
            code: newCode,
            level: $('#level').val()
        };
        $.ajax({
            async: false,
            type: "post",
            data: data,
            url: "/privilege/update",
            success: function (data) {
                if (data > 0) {
                    alert('操作成功!');
                    window.location.href = '/privilege/index';
                } else {
                    alert('亲，操作失败，请稍后再试！');
                }
            },
            error: function () {
                alert("代码出错，请稍后再试！");
            }
        });
    }

    function addHoverDom(treeId, treeNode) {//用于当鼠标移动到节点上时，显示用户自定义控件
        var sObj = $("#" + treeNode.tId + "_span");
        if (treeNode.editNameFlag || $("#addBtn_" + treeNode.tId).length > 0
            || treeNode.level == 3)
            return;
        var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
            + "' title='添加' onfocus='this.blur();'></span>";
        sObj.after(addStr);
        var btn = $("#addBtn_" + treeNode.tId);
        if (btn)
            btn.bind("click", function () {
                $.ajax({
                    async: false,
                    type: "post",
                    url: "/privilege/add",
                    success: function (libraryId) {
                        if (libraryId != "") {
                            $('#name').val("");
                            $('#code').val("");
                            $('#id').val(libraryId);
                            $('#pId').val(treeNode.id);
                            $('#level').val(treeNode.level + 1);
                            $('#result').show();
                        }
                    },
                    error: function () {
                        alert("代码出错，请稍后再试！");
                    }
                });
                return false;
            });
    }

    function removeHoverDom(treeId, treeNode) {
        $("#addBtn_" + treeNode.tId).unbind().remove();
    };
    function showRemoveBtn(treeId, treeNode) {
        if (treeNode.level == 0 || treeNode.children != null)
            return false;
        return true;
    }

    function showRenameBtn(treeId, treeNode) {
        if (treeNode.level == 0)
            return false;
        return true;
    }

    //展开全部
    function expandAllFlag() {
        zTree_Menu.expandAll(true);
    }

    //合并全部
    function combineAllFlag() {
        zTree_Menu.expandAll(false);
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
                expandAllFlag();
            }
        });
    }

    $(document).ready(function () {
        onloadZTree();
    });
});