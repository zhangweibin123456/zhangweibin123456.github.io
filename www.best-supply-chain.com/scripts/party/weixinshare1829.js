function getFirstImg() {
    var img = 'http://' + document.domain + '/images/wxshare-default-pic.jpg';
    if ($(document.body).find("img").eq(0) && $(document.body).find("img").eq(0).attr('src')) {
        var imgSrc = $(document.body).find("img").eq(0).attr('src');
        var protocol = window.location.protocol;
        //(/http[s]?:\/\//ig).test(imgSrc)
        // if ((/\//ig).test(imgSrc)) {
        //     img = protocol + imgSrc+'?cdn=0';
        // } else {
        //     img = 'http://' + document.domain + imgSrc+'?cdn=0';
        // }

        //有时候延时加载导致图片获取失败
        if (imgSrc == '/images/imgbg.png') {
            imgSrc = $(document.body).find("img").eq(0).attr('_src');
            if (imgSrc == undefined) imgSrc = $(document.body).find("img").eq(0).attr('data-src');
            if ((/\/\//ig).test(imgSrc)) {
                imgSrc = imgSrc.replace('//', '')
                var starindex = imgSrc.indexOf('/')
                imgSrc = imgSrc.substring(starindex)
            }

        }

        if ((/http[s]?:\/\//ig).test(imgSrc)) {
            img = imgSrc + '?cdn=0';
        }
        else if ((/\/\//ig).test(imgSrc)) {
            img = protocol + imgSrc + '?cdn=0';
        }
        else if ((/\//ig).test(imgSrc)) {
            img = protocol + '//' + document.domain + imgSrc + '?cdn=0';
        } else {
            img = 'http://' + document.domain + imgSrc + '?cdn=0';
        }
    };
    return img;
}

function WeiXinShare(json) {
    if (!json) {
        var img = getFirstImg();
        var url = new URL(img);
        img =  window.location.protocol + '//' + document.domain + url.pathname+"?cdn=0";
        if (window['wxshareimg']) {
            img = window['wxshareimg'];
            if (/^(http[s]?:\/\/)/.test(img) == false) img = 'http://' + document.domain + img;
        }
        var url = document.URL;
        var match = document['coo' + 'kie'].match(/WebUserID=(\d+)/i);
        if (match) {
            var WebUserID = match[1];
            if (window.location.search.indexOf("invite=" + WebUserID) == -1) {
                var baseurl = window.location.protocol + "//" + window.location.host + window.location.pathname;
                if (window.location.search == "") baseurl += "?invite=" + WebUserID;
                else baseurl += window.location.search + "&invite=" + WebUserID;
                baseurl += window.location.hash;
                baseurl = baseurl.replace(/#invite\d+/i, '');
                url = baseurl;
            }
        }
        json = {
            title: $('meta[name="sharetitle"]').attr("content") || document.title, // 分享标题
            desc: $('meta[name="sharedesc"]').attr("content") || $('meta[name="description"]').attr("content") || $('meta[name="keywords"]').attr("content"), // 分享描述
            link: url, // 分享链接
            imgUrl: $('meta[name="shareimg"]').attr("content") || img, // 分享图标
            type: '', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function () {
                // 用户确认分享后执行的回调函数
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            },
            debug: false
        };
    }
    if (!json.imgUrl) {
        json.imgUrl = getFirstImg();
    }
    $.ajax({
        type: "get",
        //url: "/JsAuthorize/",
        url: "/index.php?c=front/JsAuthorize",
        //data: { 'act': 'Authorize', 'url': location.href.split('#')[0] },
        data: { 'a': 'Authorize', 'url': location.href.split('#')[0] },
        dataType: "json",
        success: function (data) {
            if (data && data.success) {
                try {
                    wx.config({
                        debug: json.debug,
                        appId: data.appId,
                        timestamp: data.timestamp,
                        nonceStr: data.nonceStr,
                        signature: data.signature,
                        jsApiList: [
                            "onMenuShareTimeline",
                            "onMenuShareAppMessage",
                            "onMenuShareQQ",
                            "onMenuShareWeibo",
                            "onMenuShareQZone",
                            "scanQRCode"
                        ]
                    });

                    wx.ready(function () {
                        //分享到朋友圈
                        wx.onMenuShareTimeline(json);
                        console.log(json);
                        //分享给朋友
                        wx.onMenuShareAppMessage(json);
                        //分享到QQ
                        wx.onMenuShareQQ(json);
                        //分享到腾讯微博
                        wx.onMenuShareWeibo(json);
                        //分享到QQ空间
                        wx.onMenuShareQZone(json);
                    });
                } catch (e) {
                    //alert(e.message);
                };
            } else {
                //alert("weixinshare error:" + data.msg);
            }
        }, error: function (XMLHttpRequest, textStatus, errorThrown) {
            //alert("weixinshare error:" + XMLDocument.responseText);
        }
    });
};
if (typeof (window.WeiXinNotAutoShare) == 'undefined') (function () { WeiXinShare(); })();