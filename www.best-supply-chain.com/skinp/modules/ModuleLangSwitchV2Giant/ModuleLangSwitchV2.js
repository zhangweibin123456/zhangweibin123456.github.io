function intModuleLangSwitchV2(moduleid, layout, option) {
    replaceModule("module_" + moduleid);
    if ((typeof (option.CanDesign) == 'undefined' || option.CanDesign != "True") && option.isgt == '1') {
        addScript('https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit2', function () { });
    }

    var moduleIdSelector = "#module_" + moduleid;
    var clonemoduleIdSelector = "#clone_module_" + moduleid;
    if ($.inArray(layout, [101])) {
        var langContainerSelector = moduleIdSelector + ' .lang-container';
        var langSelectionSelector = clonemoduleIdSelector + ' .lang-selection';
        var cloneLangSelection = null;
        $(langContainerSelector).off('mouseenter mouseleave').on('mouseenter', function () {
            if ($(clonemoduleIdSelector).length == 0) {
                cloneLangSelection = $(this).find('.lang-selection').clone();
                var html = '<div id="clone_module_' + moduleid + '"><div class="ModuleLangSwitchV2Giant layout-' + layout + ' notranslate"></div></div>';
                var elem = $(html).appendTo('body');
                elem.find('.ModuleLangSwitchV2Giant').append(cloneLangSelection);
                elem.find('.lang-selection').css('position', 'absolute');
                elem.find('.lang-selection').css('top', $(this).offset().top + $(this).height());
                elem.find('.lang-selection').css('left', $(this).offset().left);
                elem.find('.lang-selection').css('z-index', 999999);
                elem.find('.lang-selection').show();
                elem.find('.lang-selection li').off().on('click', function () {
                    var langname = $(this).find('.lang-selection-text').attr('showname')
                    var langimg = $(this).find('img').attr('src')
                    if ($(this).attr('Type') != 'gt') {
                        setCookie('googtrans', '', -1)
                        var arr = window.location.hostname.split('.')
                        var host = arr[arr.length - 2] + '.' + arr[arr.length - 1]
                        setCookie('googtrans', '', -1, '/', '.' + host)
                    } else {
                        $(moduleIdSelector).find('.currentlangimg').attr('src', langimg)
                        $(moduleIdSelector).find('.currentlang').html(langname)
                    }
                    top.window.location.href = $(this).attr('url');
                    $(clonemoduleIdSelector).remove();
                });

                $(langSelectionSelector).off('mouseleave').on('mouseleave', function (evt) {
                    evt = evt || window.event;
                    var relatedTarget = evt.relatedTarget || evt.toElement;
                    if ($(relatedTarget).is('.lang-container,.lang-selection') || $(relatedTarget).closest('.lang-container,.lang-selection').length > 0) {
                        return false;
                    }
                    $(clonemoduleIdSelector).remove();
                });
            }
            $(langSelectionSelector).mCustomScrollbar({
                mouseWheel: { preventDefault: true }
            });
        }).on('mouseleave', function (evt) {
            evt = evt || window.event;
            var relatedTarget = evt.relatedTarget || evt.toElement;
            if ($(relatedTarget).is('.lang-container,.lang-selection') || $(relatedTarget).closest('.lang-container,.lang-selection').length > 0) {
                return false;
            }
            $(langSelectionSelector).mouseleave();
        });
    }

    if (layout == 104) {
        $(moduleIdSelector).find('.lang-text,.icoBox').off().on('click', function () {
            $(moduleIdSelector).find('.langmask').find('.langbox').addClass('animated')
            $(moduleIdSelector).find('.langmask').show();
            if ($(moduleIdSelector + " .langboxs").height() + 50 == 400) {
                $(moduleIdSelector + " .langboxs").mCustomScrollbar({
                    mouseWheel: { preventDefault: true }
                });
            }
        })
        $(moduleIdSelector).find('.icon-guanbi3').off().on('click', function () {
            $(moduleIdSelector).find('.langmask').hide();
        })
        $(moduleIdSelector).find('.langlist div').off().on('click', function () {
            $(moduleIdSelector).find('.langlist div').removeClass('current')
            if ($(this).attr('Type') != 'gt') {
                setCookie('googtrans', '', -1)
                var arr = window.location.hostname.split('.');
                var host = arr[arr.length - 2] + '.' + arr[arr.length - 1]
                setCookie('googtrans', '', -1, '/', '.' + host)
            }
            $(this).addClass('current')
            if(option.NameShowType == 0) $(moduleIdSelector).find('.lang-text').html($(this).attr('showname'));
            $(moduleIdSelector).find('.langmask').hide();
        })
    }

    if ($.inArray(layout, [102, 103])) {
        $(moduleIdSelector).find('.lang-list li a').off().on('click', function () {
            if ($(this).attr('Type') != 'gt') {
                setCookie('googtrans', '', -1)
                var arr = window.location.hostname.split('.');
                var host = arr[arr.length - 2] + '.' + arr[arr.length - 1]
                setCookie('googtrans', '', -1, '/', '.' + host)
            }
            if (layout == 103) {
                $(moduleIdSelector).find('.lang-list li').removeClass('current');
                $(this).parent().addClass('current')
            } else if (layout == 102) {
                $(moduleIdSelector).find('.lang-list li a').removeClass('current');
                $(this).addClass('current')
            }

        })
    }
    if (layout == 106) {
        var langContainerSelector = moduleIdSelector + ' .lang-container';
        var langSelectionSelector = clonemoduleIdSelector + ' .lang-selection';


        var langMaskSelector = clonemoduleIdSelector + ' .lang-mask';
        var cloneLangSelection = null;
        var isShow = false;
        $(langContainerSelector).off('mouseenter mouseleave').on('mouseenter', function () {
            var lang = getCookie("Lang");
            var googtrans = getCookie('googtrans');
            if (googtrans != '' && googtrans != 'undefined' && googtrans != null) {
                var trs = /\/auto\/([a-zA-Z]*)/
                var res = googtrans.match(trs)
                if (res != null) lang = res[1]
            }
            if ($(clonemoduleIdSelector).length == 0) {
                cloneLangSelection = $(this).find('.lang-box').clone();
                var html = '<div id="clone_module_' + moduleid + '"><div class="ModuleLangSwitchV2Giant layout-106 notranslate"></div></div>';
                var elem = $(html).appendTo('body');
                elem.find('.ModuleLangSwitchV2Giant').append(cloneLangSelection);
                elem.find('.lang-selection,.lang-mask').css('position', 'absolute');
                var left = $(this).offset().left + ($(this).width() / 2) - (elem.find('.lang-selection').width() / 2)
                elem.find('.lang-mask').css('top', $(this).offset().top + $(this).height() - 10);
                elem.find('.lang-mask').css('width', $(this).width() > $(langContainerSelector).find(".lang-selection").width() ? $(this).width() : $(langContainerSelector).find(".lang-selection").width())
                elem.find('.lang-selection').css('top', $(this).offset().top + $(this).height() + 10);
                elem.find('.lang-selection,.lang-mask').css('left', left);
                elem.find('.lang-selection,.lang-mask').css('z-index', 999999);
                elem.find('.lang-selection,.lang-mask').show();
                setTimeout(function () {
                    elem.find('.lang-selection').addClass('lang-show');
                }, 200)

                elem.find('.lang-selection li').removeClass('active')
                elem.find('.lang-selection li').each(function () {
                    if ($(this).attr('lang') == lang) {
                        $(this).parent().addClass('active')
                    }
                })

                elem.find('.lang-selection li').off().on('click', function () {
                    var langname = $(this).attr('showname')
                    if ($(this).attr('Type') != 'gt') {
                        setCookie('googtrans', '', -1)
                        var arr = window.location.hostname.split('.')
                        var host = arr[arr.length - 2] + '.' + arr[arr.length - 1]
                        setCookie('googtrans', '', -1, '/', '.' + host)
                    }
                    $(moduleIdSelector).find('.lang-text').html(langname)

                    top.window.location.href = $(this).attr('url');
                    $(clonemoduleIdSelector).remove();
                });

                $(langSelectionSelector).off('mouseleave').on('mouseleave', function (evt) {
                    evt = evt || window.event;
                    var relatedTarget = evt.relatedTarget || evt.toElement;
                    if ($(relatedTarget).is('.lang-selection,.lang-mask') || $(relatedTarget).closest('.lang-container,.lang-box').length > 0) {
                        return false;
                    }
                    if (isShow == false) {
                        isShow = true;
                        $(clonemoduleIdSelector).find('.lang-selection').removeClass('lang-show');
                        setTimeout(function () {
                            $(clonemoduleIdSelector).remove();
                            isShow = false;
                        }, 200)
                    }

                });

                $(langMaskSelector).off('mouseleave').on('mouseleave', function (evt) {
                    evt = evt || window.event;
                    var relatedTarget = evt.relatedTarget || evt.toElement;
                    if ($(relatedTarget).is('.lang-selection,.lang-mask') || $(relatedTarget).closest('.lang-container,.lang-box').length > 0) {
                        return false;
                    }
                    if (isShow == false) {
                        isShow = true;
                        $(clonemoduleIdSelector).find('.lang-selection').removeClass('lang-show');
                        setTimeout(function () {
                            $(clonemoduleIdSelector).remove();
                            isShow = false;
                        }, 200)
                    }
                });

            }
            $(langSelectionSelector + " .lang-selection-ul").mCustomScrollbar({
                mouseWheel: { preventDefault: true }
            });
        }).on('mouseleave', function (evt) {
            evt = evt || window.event;
            var relatedTarget = evt.relatedTarget || evt.toElement;
            if ($(relatedTarget).is('.lang-container,.lang-selection,.lang-mask') || $(relatedTarget).closest('.lang-container,.lang-box').length > 0) {
                return false;
            }

            if (isShow == false) {
                isShow = true;
                $(clonemoduleIdSelector).find('.lang-selection').removeClass('lang-show');
                setTimeout(function () {
                    $(clonemoduleIdSelector).remove();
                    isShow = false;
                }, 200)
            }
        });
    }
}