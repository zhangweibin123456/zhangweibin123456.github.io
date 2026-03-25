$(window).load(function () {
    var lang = getCookie('Lang')
    if (lang == undefined) lang = '';
    var isbase64 = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/;
    var isclickcolor = $('#MobileFootNav').attr('isclickcolor');
    var href = (window.location.pathname + window.location.search);

    if (window.location.pathname.replace(lang + '/','') == '/' || window.location.pathname.replace(lang,'') == '/') {
        var iconobj = $('.foot-nav-list li[itemid=7]').find('.icon');
        var iconobj = $('.foot-nav-list li[itemid=7]').find('.icon');
        var textobj = $('.foot-nav-list li[itemid=7]').find('.itemText');
        activesIcon = iconobj.attr("activesIcon");
        icontab = iconobj.attr("icontab");
        if (icontab == '' || icontab == undefined) icontab = iconobj.attr("moren");
        if (activesIcon == '' || activesIcon == undefined) activesIcon = iconobj.attr("morenact");
        if (isclickcolor == '1') textobj.addClass('itemTexth');
        //认为是图片的时候
        iconobj.html('');
        if (activesIcon != '' && activesIcon != undefined && activesIcon.indexOf('.') > -1) {
            iconobj.removeClass(icontab);
            iconobj.css('background-image', 'url(' + activesIcon + ')')
        }
        //图标
        else {
            iconobj.removeClass(icontab);
            if (isbase64.test(activesIcon)) {
                iconobj.html(window.decodeURIComponent(atob(activesIcon)))
            }
            else {
                iconobj.addClass(activesIcon);
            }
            if (isclickcolor == '1') iconobj.addClass('iconh');
            iconobj.css('background-image', 'none')
            //iconobj.css('background-image','url('+activesIcon+')')
        }
    }
    else {
        $('.foot-nav-list li').each(function () {
            var link = $(this).find('a').attr('href');
            //if(href.indexOf('&view=1') > -1 ) href=href.replace('&view=1','')
            // console.log(href,link)
            if (href == link) {
                var iconobj = $(this).find('.icon');
                var textobj = $(this).find('.itemText');
                activesIcon = iconobj.attr("activesIcon");
                icontab = iconobj.attr("icontab");
                if (icontab == '' || icontab == undefined) icontab = iconobj.attr("moren");
                if (activesIcon == '' || activesIcon == undefined) activesIcon = iconobj.attr("morenact");
                if (isclickcolor == '1') textobj.addClass('itemTexth');
                iconobj.html('');
                //认为是图片的时候
                if (activesIcon != '' && activesIcon != undefined && activesIcon.indexOf('.') > -1) {
                    iconobj.removeClass(icontab);
                    iconobj.css('background-image', 'url(' + activesIcon + ')')
                }
                //图标
                else {
                    iconobj.removeClass(icontab);
                    if (isbase64.test(activesIcon)) {
                        iconobj.html(window.decodeURIComponent(atob(activesIcon)))
                    }
                    else {
                        iconobj.addClass(activesIcon);
                    }

                    if (isclickcolor == '1') iconobj.addClass('iconh');
                    iconobj.css('background-image', 'none')
                }
            }
        })
    }
})

function QRShow() {
    if (!$('#imgFootNavQrCode').attr('src')) {
        $('#imgFootNavQrCode').attr('src', $('#imgFootNavQrCode').attr('_src'));
    }
    $(".QQServices").hide();
    $(".FootNavQRCode").toggle();
    var dmHeight = $(".FootNavQRCodeImg").height();
    var sTop = $(".footer").offset().top - dmHeight;
    var left = $(".footer").offset().left;
    var width = $('#pagebody').width();

    if (navigator.platform.toLowerCase().indexOf("win") > -1) width = parseInt(width) - 17;
    if (typeof (modulesContainers) != 'undefined') {
        $(".FootNavQRCodeImg").css({
            "width": $('#pagebody').width() - 6,
            "bottom": $(".footer").height(),
            "left": left + "px",
            "height": dmHeight + "px"
        });
        $(".FootNavMask").css({
            "width": "100%",
            "height": $('#pagebody').outerHeight() + "px",
            "top": $('#pagebody').offset().top + "px"
        });
    } else {
        $(".FootNavQRCodeImg").css({
            "width": "192px",
            "height": "192px",
            "top": "initial",
            "bottom": $('#MobileFootNav').innerHeight(),
            "left": ($('body').outerWidth() / 2 - $(".FootNavQRCodeImg").outerWidth() / 2)
        });
        $(".FootNavMask").css({ "width": "100%", "height": "100%", "top": "0" });
    }
    return false;
}

function gototop() {
    $('html,body').animate({ scrollTop: 0 }, 'slow');
}
function gotobottom() {
    var scrollHeight = $('body').prop("scrollHeight");
    $('html,body').animate({ scrollTop: scrollHeight }, 'slow');
}

function ejectimg(obj, action) {
    //console.log(window.event);
    //如果是弹出窗口的
    //   var Aobj = $(document).find("a");
    //   $(Aobj).each(function(i,item){
    //         if($(item).attr('href').indexOf('javascript:ejectimg')>-1)
    //         {

    //             var divhtml="<div><img src='"+obj+"'/></div>"
    //             $(this).append(divhtml);
    //             console.log($(this).html());
    //             return false;
    //         }
    //   })
}

function showService() {
    var QQhref = ""
    var url = 'https://wpa.qq.com/msgrd?v=3&uin={0}&site=qq&menu=yes'
    var url1 = 'mqqwpa://im/chat?chat_type=wpa&uin={0}&version=1&src_type=web'
    var url2 = 'mqq://im/chat?chat_type=wpa&uin={0}&version=1&src_type=web'

    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        QQhref = url2
    } else if (/(Android)/i.test(navigator.userAgent)) {
        QQhref = url1
    } else {
        QQhref = url
    }

    //如果是微信浏览器
    if (/MicroMessenger/i.test(navigator.userAgent)) {
        QQhref = url
    }

    $('.QQList a li').each(function () {
        //如果是QQ类型
        if ($(this).parent().attr("data-type") == 1) {
            $(this).parent().attr('href', QQhref.replace('{0}', $(this).parent().attr("data-qq")))
        }
    })


    $(".QQServices").show();
    $(".FootNavQRCode").hide();
    $(".QQServices").css('z-index', '99999');
    $(".QQList").css({
        "z-index": "99999",
        "bottom": '0'
    });
    $(".FootNavMask").css({ "width": "100%", "height": "100%", "top": "0" });
    // if (typeof (modulesContainers) != 'undefined') {
    //     $(".mobileNav").css("z-index", 10);
    //     var dmHeight = $(".QQList").outerHeight();
    //     var sTop = $(".footer").offset().top - dmHeight + 45;
    //     var left = $(".footer").offset().left;
    //     var width = $('#pagebody').width();
    //     if (navigator.platform.toLowerCase().indexOf("win") > -1) width = parseInt(width) - 17;
    //     $(".QQList").css({ "width": $('#pagebody').outerWidth() - 6 + "px", "top": sTop + "px", "left": left + "px", "height": dmHeight + "px" });
    //     $(".FootNavMask").css({ "width": "100%", "height": $('#pagebody').outerHeight() + "px", "top": $('#pagebody').offset().top + "px" });
    // } else {
    //     $(".QQList").css({
    //         "bottom": "0px"
    //     });
    //     $(".FootNavMask").css({ "width": "100%", "height": "100%", "top": "0" });
    // }

    //计算宽度
    function sortNumber(a, b) { return b - a }
    var liWidth = $('.QQList a li').width();
    var liImg = $('.QQList a li').find('.imgSpan').width();
    var liData = [];
    $('.QQList a li').each(function () {
        liData.push($(this).find('.textSpan').width());
    })
    var liSpan = liData.sort(sortNumber)[0];
    var marginLeft = (liWidth - (liImg + liSpan)) / 2;
    if (marginLeft > 10) {
        $('.QQList a li').find('.imgSpan').css('margin-left', marginLeft)
    }
    return false;
}

$(document).on("click", document.body, function (e) {
    if ($(e.target).hasClass("QQCancel") || $(e.target).hasClass("FootNavMask")) {
        if (typeof (modulesContainers) != 'undefined') {
            $(".QQList").removeAttr("style");
        }
        $(".QQServices").hide();
        e.stopPropagation();
    }
});
function showHomePage() {
    var lang = getCookie("Lang");
    if (lang == undefined) lang = '';
    if (window.location.search.indexOf('view=1') > -1) {
        window.location.href = window.location.protocol + '//' + window.location.host + '/' + lang + '?view=1&SiteType=1';
    } else {
        window.location.href = window.location.protocol + '//' + window.location.host + '/' + lang + '?SiteType=1';
    }
}
$("#MobileFootNavRenderElem").remove();
function getUrlParam(name) {
    //构造一个含有目标参数的正则表达式对象
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    //匹配目标参数
    var r = window.location.search.substr(1).match(reg);
    //返回参数值
    if (r != null) {
        return decodeURI(r[2]);
    }
    return null;
}