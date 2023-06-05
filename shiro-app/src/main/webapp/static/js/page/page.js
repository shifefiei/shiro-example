/* ---------- Tooltip ---------- */
$('[rel="tooltip"],[data-rel="tooltip"]').tooltip({
    "placement": "bottom",
    delay: {
        show: 400,
        hide: 200
    }
});

/* ---------- Popover ---------- */
$('[rel="popover"],[data-rel="popover"]').popover({
    trigger: 'hover',
    html: true,
    placement: 'auto'

});

$('[data-toggle="popover-list"]').popover({
    trigger: 'hover',
    html: true,
    placement: 'auto',
    content: function () {
        return '<form class="form-horizontal"><div class="form-group form-group-text"><label class="col-xs-5 control-label form-group-label">审核意见：</label><div class="col-x-s7"> <span class="form-control-text">朱仕银</span> </div></div><div class="form-group form-group-text"><label class="col-xs-5 control-label form-group-label">审核意见：</label><div class="col-x-s7"> <span class="form-control-text">朱仕银</span> </div></div></form>'
    }
});

/* ---------- Toggle ---------- */
$(".adlist .adlist-heading span a").click(function (e) {
    e.preventDefault();
    var $el = $(this),
        content = $el.parents('.adlist').find(".adlist-body");
    content.slideToggle('normal',
        function () {
            $el.find("i").toggleClass('icon-angle-up').toggleClass("icon-angle-down");

        });

});

jQuery(document).ready(function () {
    jQuery('.has-submenu > a').click(function () {
        var parent = jQuery(this).parent();
        var sub = parent.find('> ul');
        if (!jQuery('body').hasClass('sidebar')) {
            if (sub.is(':visible')) {
                sub.slideUp(200,
                    function () {
                        parent.removeClass('active');
                        jQuery('#container').css({
                            height: ''
                        });
                        adjustmainpanelheight();
                    });
            } else {
                closeVisibleSubMenu();
                parent.addClass('active');
                sub.slideDown(200,
                    function () {
                        adjustmainpanelheight();
                    });
            }
        }
        return false;
    });
    // sidebar收起展开
    jQuery(".sidebar-toggler a").click(function () {
        jQuery("#sidebar").toggleClass("hide");
        if (jQuery("#sidebar").hasClass("hide")) {
            jQuery("#frame").animate({marginLeft: '-10px'})
        } else {

            jQuery("#frame").css({
                marginLeft: "200px"
            })
        }
    });
    //数据报表表头跟随滚动条
    jQuery(".datetable").scroll(function (event) {
        jQuery(".cloneFix").css("marginLeft", -$(this).scrollLeft())
    });
});

function closeVisibleSubMenu() {
    jQuery('.has-submenu').each(function () {
        var t = jQuery(this);
        if (t.hasClass('active')) {
            t.find('> ul').slideUp(200,
                function () {
                    t.removeClass('active');
                });
        }
    });
}

function adjustmainpanelheight() {
    var docHeight = jQuery(document).height();
    if (docHeight > jQuery('#container').height()) jQuery('#container').height(docHeight);
}

/* ---------- Show More ---------- */
function showmore() {
    $("#showmore").toggle();
    $(".showparent").hide();
};

function megamenu() {
    $(".mega.dropdown-menu").toggle();
};
function megamenucancle() {
    $(".mega.dropdown-menu").hide();
};

/* ---------- Slider ---------- */
$(function () {
    $('.bxslider').bxSlider({
        startSlide: 0,
        auto: true
    });
});


var minHeight = 100;
var maxHeight = 300;
function ResizeTextarea() {
    var t = document.getElementById('txtContent');
    h = t.scrollHeight;
    h = h > minHeight ? h : minHeight;
    h = h > maxHeight ? maxHeight : h;
    t.style.height = h + "px";
}

//数据报表表头固定
/*!(function($){
 $(window).scroll(function(event){
 var fixTit = $(".fixTit"),
 domTop = fixTit.offset().top,
 pageTop = $(document).scrollTop(),
 navBarHeight = $(".navbar").height(),
 fixTitWid = fixTit.width();
 if($(".cloneFix").length == 0){
 fixTit.parent('thead').append('<tr class="cloneFix">' + $('.fixTit').html() + '</tr>');
 var thArr = fixTit.find('th'),
 thArrClone = $('.cloneFix').find('th')
 for (var i = 0, thArrLen = thArr.length; i < thArrLen; i++) {
 var thWid = thArr.eq(i).width();
 thArrClone.eq(i).css({
 'width': thWid
 });
 thArr.eq(i).css({
 'width': thWid
 });
 };
 }
 if((pageTop+navBarHeight) >= domTop){
 $(window).resize(function(event) {
 var thArr = fixTit.find('th'),
 thArrClone = $('.cloneFix').find('th')
 for (var i = 0, thArrLen = thArr.length; i < thArrLen; i++) {
 var thWid = thArr.eq(i).width();
 thArrClone.eq(i).css({
 'width': thWid
 });
 thArr.eq(i).css({
 'width': thWid
 });
 };
 });
 $(".cloneFix").removeClass("fn-dis-none");
 $(".cloneFix").css({
 "position":"fixed",
 "width":fixTitWid,
 "top":navBarHeight
 });
 }
 else{
 $(".cloneFix").addClass("fn-dis-none");
 }
 });
 })(jQuery)*/
