// 初始化表单模块
layout = 0;
var isvalidate
var moduleId
var setint = [];
var setintcount = []
var upimgarr = [];
var tpm = []
function initCustomFormGiant(moduleId, layout, options) {

    //解决ie不支持closest方法（用于查找父元素）
    if (!Element.prototype.matches) {
        Element.prototype.matches =
            Element.prototype.msMatchesSelector ||
            Element.prototype.webkitMatchesSelector;
    }
    if (!Element.prototype.closest) {
        Element.prototype.closest = function (s) {
            var el = this;

            do {
                if (Element.prototype.matches.call(el, s)) return el;
                el = el.parentElement || el.parentNode;
            } while (el !== null && el.nodeType === 1);
            return null;
        };
    }

    this.layout = layout;
    this.moduleId = moduleId
    this.upimgarr[moduleId] = 5
    options = options || {};
    options.lang = options.lang || {};
    multiseriate(moduleId, options)
    setTimeout(function () { //延时初始化是因为表单模块可能会放到swiper里，而swiper如果启用loop,会克隆一些DOM，这可能会导致初始化有问题
        $('.module_' + moduleId).each(function (i, item) {
            var module = $(item).closest(".ModuleItem");
            //判断是否移动端并且不在微信下
            if (window.innerWidth <= 787 && (window.navigator.userAgent + '').toLocaleLowerCase().indexOf('micromessenger') == -1) {
                $('#module_' + moduleId).find(".wxpay").hide()
            }

            //循环表单，拿出单选的项
            tpm[moduleId] = []
            var formElem = module.find('form').find(':radio');
            for (var i = 0; i <= formElem.length - 1; i++) {
                var chname = $(formElem[i]).attr('name').replace('col', '')
                if (chname != undefined && !tpm[moduleId][chname]) {
                    tpm[moduleId][chname] = 0;
                }
            }
            if (options.IsPay == 1) {
                module.find(".computation").html(getLang('calculating'))
                if (options.PayType == 0) {
                    module.find('.PayAmount').val(options.PayAmount)
                    module.find('.computation').html(options.PayAmount)
                }
            }
            //初始化关联
            var FieldItem = $('#module_' + moduleId).find(".customFormFieldItem")
            for (var i = 0; i <= FieldItem.length - 1; i++) {
                var josn = $(FieldItem[i]).attr('rel')
                releFromelem(moduleId, '', josn)
            }
            // module.closest('.ModuleGridGiant').css('overflow','unset');
            // module.find('.ModuleCustomFormGiant').css('overflow','unset');
            module['instanceId'] = parseInt(Math.random() * 100000000);
            //TODO: 做到单选、多选、下拉三者分离
            // 单选、多选、下拉处理
            if (module.find('.customFormRadio, .customFormCheckbox, .customFormSelectValue').length > 0) {
                initCustomFormSomeFieldItems(module, layout, options);
            }

            // 初始化时间
            if (module.find('.customFormDatetime').length > 0) {
                initCustomFormDateTime(module, options);
            }

            // 初始化地区选择
            if (module.find('.customFormRegion').length > 0) {
                initCustomFormRegionSelector(module, options);
            }

            // 初始化上传
            if (module.find('.customFormFile').length > 0) {
                initCustomFormFileUpload(module, options, layout);
            }
            // 初始化图片上传
            if (module.find('.customFormImg').length > 0) {
                initCustomFormImgUpload(module, options, layout, false);
            }
            //
            if (module.find('.customFormImgMore').length > 0) {
                initCustomFormImgUpload(module, options, layout, true);
            }
            // 初始化验证码
            var vImg = module.find(".vCodeImg");
            if (vImg.length > 0) {
                var vCode = module.find("[name=vCode]");
                if (vCode.length > 0) {
                    vCode.on("click", function () {
                        if ((vImg.attr("src") + "").indexOf("c=validatecode") == -1) {
                            vImg.attr("src", "/index.php?c=validatecode&t=" + Math.random());
                            vImg.show();
                            module.find(".refreshVCode").show();
                            if (layout == 105) vCode.attr('placeholder', '');
                            else vCode.attr('placeholder', getLang('plz_enter_verification_code'));
                        }
                    });
                }
            }

            //解决pc多选和单选右边间距问题
            // if (layout == '102') {
            //     var inFormListCheckBox = module.find('.in-formList-checkbox');
            //     if (inFormListCheckBox.length > 0) {
            //         inFormListCheckBox.each(function (idx, el) {
            //             $(el).css({
            //                 'margin-left': $(el).siblings('.content-title').outerWidth(true) + 10
            //             })
            //         })
            //     }
            // }

            // 初始化表单验证
            initCustomFormValidate(module, options);

            smsvaildate(moduleId, options)
            Displaymode(moduleId, layout)
            if (layout == 107) {
                var btnhegiht = $('#module_' + moduleId + ' .Special').height();
                $('#module_' + moduleId + ' .customFormSubmit').css('line-height', btnhegiht - 16 + 'px');
            }
        });
    }, 1000);
    $(window).off('resize.initCustomFormGiant' + moduleId).on('resize.initCustomFormGiant' + moduleId, function () {
        multiseriate(moduleId, options)
        Displaymode(moduleId, layout)
        if (layout == 107) {
            var btnhegiht = $('#module_' + moduleId + ' .Special').height();
            $('#module_' + moduleId + ' .customFormSubmit').css('line-height', btnhegiht - 16 + 'px');
        }
    })
    window['initFunc' + moduleId] = function () {
        if (layout == 107) {
            var btnhegiht = $('#module_' + moduleId + ' .Special').height();
            $('#module_' + moduleId + ' .customFormSubmit').css('line-height', btnhegiht - 16 + 'px');
        }
    }
}

// 初始化单选、多选、下拉组件
function initCustomFormSomeFieldItems(module, layout, options) {
    var currentData = null;

    // 手机弹出层，返回或确定执行的代码
    var GoBack = function (el) {
        $(el).closest('.customFormFieldItem').find('.InsidePage').hide();
        if ($(el).attr('data') == 'back') {
            return;
        };
        var value = '';
        /*如果不是单选(下拉)是多选*/
        if (!$(el).hasClass('ensure-radio')) {
            var valueText = null;
            var values = [];
            $(el).closest('.customFormFieldItem').find('.InsidePage-list :checkbox:checked').each(function (idx, el) {
                var val = escapeValue($(el).val());
                values.push(val);
            });
            if (values.length <= 0) {
                valueText = options.lang.plz_select; // 请选择
            } else {
                valueText = (options.lang.n_items_have_been_selected || '').replace('{n}', values.length); // ('已选择' + values.length + '项')
            };
            // 手机版结果框同步值
            currentData.val(valueText);
            $(el).closest('.customFormFieldItem').find('.Pc-formList-content .customFormCheckbox').prop('checked', false);
            $(el).closest('.customFormFieldItem').find('.Pc-formList-content .customFormCheckbox').each(function () {
                for (var i = 0; i < values.length; i++) {
                    if (values[i] == $(this).val()) {
                        $(this).prop('checked', true);
                    }
                }
            });
        } else {
            $(el).closest('.InsidePage').find('.InsidePage-list-content').each(function (idx, el) {
                if ($(el).attr('thisData') == 'yes') {
                    value = $(el).attr('data-value');
                }
            });
            // 手机版结果框同步值
            currentData.val(value);
            // 单选同步值
            $(el).closest('.customFormFieldItem').find('.Pc-formList-content').find('.customFormRadio[value="' + value + '"]').prop('checked', true);
            // 下拉同步值
            var instance = $(el).closest('.customFormFieldItem').find('.Select_Simulate').data('select_simulate') || {};
            instance.setValue && instance.setValue(value);
            //关联联动
            var josn = $(el).closest('.customFormFieldItem').attr('rel')
            releFromelem(module.attr('id').replace('module_', ''), value, josn)
            if (options.IsPay == 1 && options.PayType == 1) {
                var calculatitem = $(el).closest('.customFormFieldItem').attr('calculatitem')
                var colid = $(el).closest('.customFormFieldItem').find('.Pc-formList-content').find('.customFormRadio[value="' + value + '"]').attr('name').replace('col', '')
                setCalculation(module.attr('id').replace('module_', ''), calculatitem, colid, value, options.Calculations)
            }
        }
    }



    /*手机内页跳转*/
    module.find('.goToInsidePage').off('click').on('click', function () {
        currentData = $(this).find('.theData');
        module.find('.InsidePage').remove();
        var fieldType = $(this).attr('field-type');
        var fieldItem = $(this).closest('.customFormFieldItem');
        var title = (layout == 106 ? (fieldItem.find('.Describ-text-color').text() || '') : (fieldItem.find('.mobile-formList-content .Describ-text-color').text() || ''));
        title = title.trim()
        if (title.substr(-1) == '*') title = title.substring(0, title.length - 1)
        var setheight = '';
        if ($(this).closest('.enquiryFormDiv').length > 0) {
            setheight = 'height:' + ($(window).height() + 52) + 'px';
        }
        if (fieldType == 3 || fieldType == 4) {
            var items = null;
            if (fieldType == 3) {
                items = fieldItem.find('.customFormRadio');
            } else {
                items = fieldItem.find('.customFormSelectItem');
            }
            var html = '';
            html += '<div class="InsidePage" style="display:block;' + setheight + '">';
            html += '<h3 class="InsidePage-title">';
            html += '<span data="back" class="backImg goBack">';
            html += '<img src="/skinp/modules/ModuleCustomFormGiant/images/back.png">';
            html += '</span>';
            html += '<span class="InsidePage-title-text">' + title + '</span>';
            html += '<span class="ensure ensure-radio">' + options.lang.select2 + '</span>';
            html += '</h3>';
            html += '<ul class="InsidePage-list InsidePage-list-radio">';
            items.each(function () {
                var val = escapeValue($(this).attr('value'));
                html += '<li class="InsidePage-list-content" data-value="' + val + '">'
                html += '<input type="radio" class="Describ-text-color customFormRadio CustomForm-icon-radio"/>';
                html += '<span>' + val + '</span>'
                //html += '<span class="Describ-text-color CustomForm-icon-radio"><img src="/skinp/modules/ModuleCustomFormGiant/images/checkmack.png"></span>';
                html += '</li>';
            });
            html += '</ul>';
            html += '</div>';

            fieldItem.find('.mobile-formList-top').after(html);
        } else if (fieldType == 5) {
            var items = fieldItem.find('.customFormCheckbox');
            var html = '';
            html += '<div class="InsidePage" style="display:block;' + setheight + '">';
            html += '<h3 class="InsidePage-title">';
            html += '<span data="back" class="backImg goBack">';
            html += '<img src="/skinp/modules/ModuleCustomFormGiant/images/back.png">';
            html += '</span>';
            html += '<span class="InsidePage-title-text">' + title + '</span>';
            html += '<span class="ensure">' + options.lang.select2 + '</span>';
            html += '</h3>';
            html += '<ul class="InsidePage-list">';
            items.each(function () {
                var val = escapeValue($(this).attr('value'));
                html += '<li class="InsidePage-list-content">';
                html += '<input type="checkbox" class="iconfont icon-radiobutton2" value="' + val + '">';
                html += '<span>' + val + '</span>'
                html += '</li>';
            });
            html += '</ul>';
            html += '</div>';
            fieldItem.find('.mobile-formList-top').after(html);
        }

        // 模拟返回
        module.find('.goBack').off('clcik').on('click', function () {
            GoBack(this);
        })
        // 确定按钮点击
        module.find('.ensure').off('clcik').on('click', function () {
            GoBack(this);
        });
        // 手机弹出层里选项点击选择事件
        module.find('.InsidePage-list-content').off('click').on('click', function () {
            if ($(this).closest('.customFormFieldItem').find('.ensure').hasClass('ensure-radio')) {
                /*单选*/
                $(this).closest('.InsidePage-list-radio').find('.InsidePage-list-content').find('.CustomForm-icon-radio').prop('checked', false)
                $(this).closest('.InsidePage-list-radio').find('.InsidePage-list-content').attr('thisData', 'No');
                $(this).find('.CustomForm-icon-radio').prop('checked', true);
                $(this).closest('.customFormFieldItem').find('.customFormSelectValue ').val($(this).attr('data-value'));
                $(this).attr('thisData', 'yes');
            } else {
                /*多选*/
                var inputCheckbox = $(this).closest('li').find('input[type="checkbox"]');
                if (inputCheckbox.is(':checked')) {
                    inputCheckbox.attr('checked', false);
                } else {
                    inputCheckbox.prop('checked', 'true');
                }
                $(this).closest('.customFormFieldItem').find('.customFormSelectValue ').val($(this).attr('data-value'));
            }
        });
        module.find('.InsidePage-list-content input[type="checkbox"]').off('click').on('click', function () {
            if (!$(this).closest('.customFormFieldItem').find('.ensure').hasClass('ensure-radio')) {
                if ($(this).is(':checked')) {
                    $(this).prop('checked', false);
                } else {
                    $(this).prop('checked', true);
                }
            }
        })

        // 设置手机弹出层选中的值
        if (fieldType == 3) {
            if (fieldItem.find('.customFormRadio:checked').length > 0) {
                var val = escapeValue(fieldItem.find('.customFormRadio:checked').val());
                module.find('.InsidePage-list-content[data-value="' + val + '"]').click();
            }
        } else if (fieldType == 4) {
            var val = escapeValue(fieldItem.find('.customFormSelectValue').val());
            module.find('.InsidePage-list-content[data-value="' + val + '"]').click();
        } else if (fieldType == 5) {
            fieldItem.find('.customFormCheckbox:checked').each(function () {
                var val = escapeValue($(this).val());
                module.find('.InsidePage-list-content>:checkbox[value="' + val + '"]').parent().click();
            });
        }
    });

    // PC版单选选择
    module.find('.Pc-formList-content .customFormRadio').off('change').on('change', function () {
        var moduleID = module.attr('id').replace('module_', '');
        var val = $(this).val();
        var josn = $(this).closest('.customFormFieldItem').attr('rel')
        releFromelem(moduleID, val, josn)
        $(this).closest('.customFormFieldItem').find('.theData').val(val);
        if (options.IsPay == 1 && options.PayType == 1) {
            var calculatitem = $(this).closest('.customFormFieldItem').attr('calculatitem')
            setCalculation(moduleID, calculatitem, $(this).attr('name').replace('col', ''), val, options.Calculations)
        }
    });

    // PC版多选选择
    module.find('.Pc-formList-content .customFormCheckbox').off('change').on('change', function () {
        var val = $(this).val();
        var count = $(this).closest('.customFormFieldItem').find('.Pc-formList-content .customFormCheckbox:checked').length;
        if (count <= 0) {
            valueText = options.lang.plz_select; // 请选择
        } else {
            valueText = (options.lang.n_items_have_been_selected || '').replace('{n}', count); // ('已选择' + values.length + '项')
        };
        $(this).closest('.customFormFieldItem').find('.theData').val(valueText);
    });

    // 初始化下拉框插件
    if (module.find('.customFormSelectValue').length > 0) {
        if ($.inArray(Number(layout), [102, 103, 104, 105, 106, 107]) > -1) {
            var num = Number(layout) - 100;
            if (layout == 105 || layout == 107) num = 2;
            if (layout == 106) num = 3;
            loadStyleSheet('/scripts/widget/Select_Simulate/Select_Simulate-layout' + num + '.css');
        } else {
            loadStyleSheet('/scripts/widget/Select_Simulate/Select_Simulate.css');
        }
        addScripts(['/scripts/widget/Select_Simulate/Select_Simulate.js'], function () {
            module.find('.Select_Simulate').find('.select_box').mCustomScrollbar({ scrollButtons: { scrollSpeed: 30 } });
            module.find('.Select_Simulate').each(function () {
                var instance = new Select_Simulate({
                    selector: this,
                    select: function (val) {
                        var josn = $(this).closest('.customFormFieldItem').attr('rel')
                        releFromelem(module.attr('id').replace('module_', ''), val, josn)
                        $(this).closest('.customFormFieldItem').find('.theData').val(val).text(val);
                    }
                });
                $(this).data('select_simulate', instance);
            });
        });
    }
}

function setCalculation(moduleId, calculatitem, macth, val, Calculations) {
    $('#module_' + moduleId).find('.computation').html(getLang('calculating'))
    try {
        if (calculatitem == undefined || calculatitem == null || calculatitem == '' || calculatitem == 'null' || calculatitem == 'undefined') {
        } else {
            var itemjosn = JSON.parse(decodeURIComponent(calculatitem))
            $.each(itemjosn, function (idx, obj) {
                $.each(obj, function (idx, obj2) {
                    if (obj2.value == val) {
                        tpm[moduleId][macth] = obj2.price
                    }
                })
            })
        }
        for (var key in tpm[moduleId]) {
            Calculations = Calculations.replace('[' + key + ']', tpm[moduleId][key]);
        }
        var needpaymoney = eval(Calculations.replaceAll('{', '').replaceAll('}', ''));
        if (needpaymoney < 0) needpaymoney = 0
        needpaymoney = needpaymoney.toFixed(2)
        if (needpaymoney == 'Infinity') needpaymoney = 0
        $('#module_' + moduleId).find('.PayAmount').val(needpaymoney)
        $('#module_' + moduleId).find('.computation').html('¥' + needpaymoney)
    } catch (ex) {
        $('#module_' + moduleId).find('.computation').html(getLang('Calculation_failed'))
    }
}

// 值处理
function escapeValue(val) {
    return (val || '').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

// 初始化时间组件
function initCustomFormDateTime(module, options) {

    /*pc端时间插件*/
    //loadStyleSheet('/content/jQuery/jquery.datetimepicker.css');
    loadStyleSheet('/scripts/jQuery/xndatepicker.css');
    loadStyleSheet('/scripts/jQuery/font_2213760_as9380qm7dw.css');
    addScripts(['/scripts/jQuery/xntimepicker.js', '/scripts/jQuery/moment.js', '/scripts/jQuery/xndatepicker.js'], function () {
        var datatimeobj = module.find('.customFormDatetime');
        for (var i = 0; i <= datatimeobj.length - 1; i++) {
            var date = new XNDatepicker($(datatimeobj[i]), {
                // format:'YYYY-MM-DD',
                type: 'date',//year/month/date/multiple/ week/datetime/datetimerange/ daterange/monthrange/yearrange
                multipleDates: [],//当为多选日期类型时的初始值
                startTime: '',
                // endTime:'2036-04-04',
                // minDate:'2019-04-04',
                maxDate: '',
                separator: ' 到 ',
                showType: 'modal',
                linkPanels: false,//面板联动
                showClear: true,//是否显示清除按钮
                autoConfirm: true,
                showShortKeys: false,
                autoFillDate: true,//自动变更element里面的值
                //placeholder:'日期选择',
                classname: 'ModuleCustomFormGiant layout-color-' + options.LayoutColor,
            }, function (data) {

            })
        }
    });
    /*移动度时间插件*/
    loadStyleSheet('/scripts/ioscalendar/FJL.picker.css');
    loadStyleSheet('/scripts/ioscalendar/FJL.xiugai.css');
    window.FastClick = true;
    addScripts(['/scripts/ioscalendar/mui.js', '/scripts/ioscalendar/FJL.picker.min.js'], function () {
        (function ($) {
            $.init();
            var btns = module.find('.chooseTime'); //规定触发的元素
            btns.each(function (i, btn) {
                btn.addEventListener('tap', function () {
                    btns.prop('disabled', true)
                    var options = {
                        "type": "date", //date,datetime
                        "beginYear": 1950, //开始年份
                        "endYear": 2050, //结束年份
                        "beginMonth": 1, //开始月份
                        "endMonth": 12 //结束月份
                    };
                    var id = this.getAttribute('id');
                    var picker = new $.DtPicker(options); //初始化
                    var val = this.getAttribute('value');

                    if (val) {
                        picker.setSelectedValue(val); //设置默认值
                    }
                    var _this = this;
                    picker.show(function (rs) {
                        _this.children[0].innerText = rs.text;
                        _this.setAttribute('value', rs.text);
                        jQuery(_this).closest('.customFormFieldItem').find('.customFormDatetime').val(rs.text);
                        picker.dispose();
                        btns.prop('disabled', false)
                    });
                }, false);
            });
        })(mui);
    });
}

// 初始化地区选择组件
function initCustomFormRegionSelector(module, options) {
    var formElem = module.find("form");
    var moduleId = formElem.find("[name=ModuleID]").val();
    addScripts(['/scripts/mobileCityPicker/js/city-picker.data.js', '/scripts/cityselect/Region3.js'], function () {
        module.find('.customFormFieldItem .pcCitybox .areabox').AreaSelector(
            {
                moduleID: moduleId,
                layoutColor: options.LayoutColor,
                callBack: function (wholdName, provinceIndex, cityIndex, areaIndex, id, bindobj) {
                    bindobj.closest('.customFormFieldItem').find('[name^=col]').val(wholdName);
                    bindobj.closest('.customFormFieldItem').find('.mobile-formList-content .cityval').html(wholdName);
                    var cityListId = $('#module_' + id).find('ul[id^=cityList]').attr('id');
                    $.mobiscroll.instances[cityListId].setArrayVal([(provinceIndex != undefined ? provinceIndex : 0), (cityIndex != undefined ? cityIndex : 0), (areaIndex != undefined ? areaIndex : 0)]);
                }
            }

        )
    })


    /*移动端地区插件*/
    loadStyleSheet('/scripts/mobileCityPicker/css/mobiscroll.animation.css');
    loadStyleSheet('/scripts/mobileCityPicker/css/mobiscroll.frame.css');
    loadStyleSheet('/scripts/mobileCityPicker/css/mobiscroll.frame.ios.css');
    loadStyleSheet('/scripts/mobileCityPicker/css/mobiscroll.frame.jqm.css');
    loadStyleSheet('/scripts/mobileCityPicker/css/mobiscroll.frame.wp.css');
    loadStyleSheet('/scripts/mobileCityPicker/css/mobiscroll.scroller.css');
    loadStyleSheet('/scripts/mobileCityPicker/css/mobiscroll.scroller.ios.css');
    loadStyleSheet('/scripts/mobileCityPicker/css/mobiscroll.image.css');
    loadStyleSheet('/scripts/mobileCityPicker/css/Mobilecityxuigai.css');
    addScripts([
        '/scripts/mobileCityPicker/js/mobiscroll.core.js',
        '/scripts/mobileCityPicker/js/mobiscroll.frame.js',
        '/scripts/mobileCityPicker/js/mobiscroll.scroller.js',
        '/scripts/mobileCityPicker/js/mobiscroll.listbase.js',
        '/scripts/mobileCityPicker/js/mobiscroll.treelist.js',
        '/scripts/mobileCityPicker/js/i18n/mobiscroll.i18n.zh.js',
        '/scripts/mobileCityPicker/js/city-picker.data.js',
        '/scripts/mobileCityPicker/js/mobile-cityPicker.js'
    ], function () {
        module.find('ul[id^=cityList' + moduleId + ']').each(function () {
            $(this).attr('id', $(this).attr('id') + module['instanceId']);
            $.mobileCityPicker({
                id: $(this).attr('id'), //容器id
                inputClass: 'cityPickerInput', //
                inputClick: true,
                option: {
                    defaultValue: [0, 0, 0], //默认选项{编号}
                    label: ['province', 'city', 'district'],
                    theme: 'ios', //风格
                    mode: 'scroller', //表现形式
                    inputClass: 'hidden',
                    display: 'bottom', //模式
                    lang: 'zh', //语言
                },
                callback: function (val, citys, el) {
                    // 清除在微信打开时出现两次回调的问题
                    citys.join('') && setCallBack(val, citys, el);
                }
            })
        });
        function setCallBack(val, citys, el) {
            var arr = val.split(' ');
            var provinceCode = window.cityPicker.getAreaCode(window.ChineseDistricts[86], arr[0]);
            var cityCode = arr.length > 1 ? window.cityPicker.getAreaCode(window.ChineseDistricts[provinceCode], arr[1]) : '';
            var areaCode = arr.length > 2 ? window.cityPicker.getAreaCode(window.ChineseDistricts[cityCode], arr[2]) : '';
            // 同步值到PC地区插件
            //var areaSelector = $(el).closest('.customFormFieldItem').find('.pcCitybox').data('areaSelector');
            // 微信打开页面偶尔为undefined
            //areaSelector && areaSelector.initProvince(provinceCode, cityCode, areaCode);
            var moduleId = $(el).closest('.ModuleItem').attr('id').replace('module_', '')
            $(el).closest('.customFormFieldItem').find('.pcCitybox .areabox').AreaSelector(
                {
                    provinceOptionText: citys[0], 	// 省份第一项的字符
                    provinceOptionValue: provinceCode,
                    cityOptionText: citys[1], 	// 地级市第一项的字符
                    cityOptionValue: cityCode,
                    areaOptionText: citys[2], 	// 市、县级市、县第一项的字符
                    areaOptionValue: areaCode,
                    moduleID: moduleId,
                    selareabox: $(el).closest('.customFormFieldItem').find('.pcCitybox .areabox'),
                    layoutColor: options.LayoutColor,
                    callBack: function (wholdName, provinceIndex, cityIndex, areaIndex, id, bindobj) {
                        bindobj.closest('.customFormFieldItem').find('[name^=col]').val(wholdName);
                        bindobj.closest('.customFormFieldItem').find('.mobile-formList-content .cityval').html(wholdName);
                        var cityListId = module.find('ul[id^=cityList]').attr('id');
                        $.mobiscroll.instances[cityListId].setArrayVal([(provinceIndex != undefined ? provinceIndex : 0), (cityIndex != undefined ? cityIndex : 0), (areaIndex != undefined ? areaIndex : 0)]);
                    }
                }
            )

            // 设置表单值
            $(el).closest('.customFormFieldItem').find('[name^=col]').val(citys.join(' '));
            // 设置显示的值
            $(el).closest('.customFormFieldItem').find('.cityval').html(citys.join(' '));
            var curModuleCustomFormGiant = $(el).closest('.ModuleCustomFormGiant').attr('class')
            layout = /\d+/g.exec(curModuleCustomFormGiant)[0];
            if ($.inArray(Number(layout), [102, 105, 107]) > -1) {
                console.log($(el).closest('.customFormFieldItem').find('.cityval'))
                $(el).closest('.customFormFieldItem').find('.cityval').show()
                $(el).closest('.customFormFieldItem').find('.choose-city-content').hide()
            }
        }
    });
}

// 初始化上传组件
function initCustomFormFileUpload(module, options, layout) {
    addScript('/framework/ref/scripts/jquery.ajaxfileupload.js', function () {
        module.find('.customFormFile').off('change').on('change', function () {
            var val = $(this).val();
            var fieldItem = $(this).closest('.customFormFileFieldItem')
            if (!/\.(pdf|doc|docx|txt|csv|xls|xlsx|rar|zip)$/i.test(val)) {
                fieldItem.find('.Browse-file-input').val("");
                alert(options.lang.upload_incorrect_type_file + '，' + options.lang.optional_format + '：pdf|doc|docx|txt|csv|xls|xlsx|rar|zip'); // 上传文件类型有误
                return false;
            }
            uploadCustomForm(module, $(this), options, 'file', layout);
        });
    });
}

// 初始化图片上传组件
function initCustomFormImgUpload(module, options, layout, ismore) {
    var cur;
    if (ismore) {
        cur = module.find('.customFormImgMore')
        var moduleId = module.attr('id').replace('module_', '')
        if (this.upimgarr[moduleId] <= 0) {
            module.find('.customFormImgMore').parent().hide()
            module.find('.customFormImgMore').attr('disabled', true)
            module.find('.customform-upload-img-preview').eq(3)
            //alert('最多上传5张')
            return false
        }
    }
    else {
        cur = module.find('.customFormImg')
    }
    addScript('/framework/ref/scripts/jquery.ajaxfileupload.js', function () {
        cur.off('change').on('change', function () {
            var val = $(this).val();
            var fieldItem = $(this).closest('.customFormImgFieldItem')
            if (!/\.(jpg|gif|png|jpeg)$/i.test(val)) {
                fieldItem.find('.Browse-file-input').val("");
                alert(options.lang.upload_incorrect_type_file + '，' + options.lang.optional_format + '：jpg|gif|png|jpeg'); // 上传文件类型有误
                return false;
            }
            uploadCustomForm(module, $(this), options, 'img', layout, ismore);
        });
    });
}

//上传附件初始化关闭附件按钮
function closeuploadForm(module, fileElem, options, layout) {

    var fieldItem = fileElem.closest('.customFormFieldItem');
    fieldItem.find('.fileclose').off('click').on('click', function () {
        fieldItem.find('.UploadFileSpan').hide();
        fieldItem.find('.UploadFileSpan').html('');
        fieldItem.find('[name^=col]').val('');
        fieldItem.find('.Browse-file').show();
        var file = fieldItem.find('.Browse-file').html();
        var id = fieldItem.find('.Browse-file').attr("id");
        if ($.inArray(layout, [104, 101, 102, 107]) > -1) {
            fieldItem.find('.Browse-file').replaceWith('<span id="' + id + '" class="Browse-file input-text-color">' + file + '</span>');
        } else {
            fieldItem.find('.Browse-file').replaceWith('<span id="' + id + '" class="Browse-file input-text-color boder-style">' + file + '</span>');
        }
        initCustomFormFileUpload(module, options, layout);
    })
}
//上传图片初始化关闭图片按钮
function closeuploadimgForm(module, fileElem, options, layout, ismore) {
    var _this = this
    var fieldItem = fileElem.closest('.customFormFieldItem');
    var moduleId = module.attr('id').replace('module_', '')
    fieldItem.find('.imgclose').off('click').on('click', function () {
        if (ismore) {
            var cursrc = $(this).closest('.customform-upload-img-preview').find('img').attr('src')
            $(this).closest('.customform-upload-img-preview').remove();
            var oldval = fieldItem.find('[name^=col]').val();
            var newval2 = ''
            var imgobj = oldval.split(',')
            for (var i = 0; i <= imgobj.length - 1; i++) {
                if (imgobj[i] == cursrc) { continue; }
                else { newval2 = imgobj[i] + ',' + newval2 }
            }

            newval2 = newval2.replace(/,$/gi, "")
            fieldItem.find('[name^=col]').val(newval2);
            module.find('.customFormImgMore').parent().show()
            module.find('.customFormImgMore').attr('disabled', false)
            _this.upimgarr[moduleId]++

        } else {
            //fieldItem.find('.customform-upload-img-preview').remove();
            $(this).closest('.customform-upload-img-preview').remove();
            fieldItem.find('[name^=col]').val('');
            fieldItem.find('.Browse-file').show();
            var file = fieldItem.find('.Browse-file').html();
            var id = fieldItem.find('.Browse-file').attr("id");
            fieldItem.find('.Browse-file').replaceWith('<div id="' + id + '" class="Browse-file Browse-file-img Browse-img">' + file + '</div>');
        }
        initCustomFormImgUpload(module, options, layout, ismore);
    })
}

// 触发上传
function uploadCustomForm(module, fileElem, options, type, layout, ismore) {
    var moduleId = module.attr('id').replace('module_', '')
    var url = '/index.php?c=Front/CustomForm&a=uploadfiles&count=' + this.upimgarr[moduleId]
    //上传时加入遮罩层
    var html = '<div class="loadingPanel" style="width: 100%; height: 100%;position: fixed;top: 0;left: 0;opacity: 0.9;background: #999;text-align: center;z-index:999999;">';
    html += '<div style="position: absolute;top: 50%;width:100%">';
    html += '<p><i class="fa fa-spinner fa-spin" style="font-size: 30px;margin-bottom: 10px;';
    html += '"></i></p>';
    html += '<p>' + options.lang.uploading_and_wait_a_moment + '</p>'; // 上传中，请稍后...
    html += '</div>';
    html += '</div>';
    $('body').append(html);
    var fieldItem = fileElem.closest('.customFormFieldItem');
    //隐藏上传按钮
    if (!ismore) {
        fieldItem.find('.Browse-file').hide();
        url = '/index.php?c=Front/CustomForm&a=uploadfile'
    }
    var _this = this;
    //调用上传组件
    $.ajaxFileUpload({
        url: url, //用于文件上传的服务器端请求地址
        secureuri: false, //是否需要安全协议，一般设置为false
        fileElementId: fileElem, //文件上传域的j对象
        dataType: 'text', //返回值类型 一般设置为json
        success: function (data, status) //服务器成功响应处理函数
        {
            // 该死的uc手机浏览器，成功响应的话，会在返回文本中添加一段<script...>的代码
            // 使得ajaxFileUpload原生的eval方法出错
            // 所以dataType改成text，人工处理返回值，使得变会一个真正的json字符串
            if ((data || '').indexOf('<script') > -1) {
                data = data.replace(/<script[\w\W]+$/ig, '').trim();
            }
            eval("data = " + data);

            if (!data.success) {
                if (!ismore) {
                    fieldItem.find('[name^=col]').val('');
                }
                alert(data.msg);
                return;
            }
            var oldval = ''
            fieldItem.find('.Browse-file-input').val(data.newfile.replace(/.*\//g, ''));
            if (ismore) {
                var oldval = fieldItem.find('[name^=col]').val()
                // var newval = data.newfile + ',' + oldval
                // newval = newval.replace(/,$/gi, "")
                var newval = data.newfile.replace(/,$/gi, "")
                fieldItem.find('[name^=col]').val(newval)
            } else {
                fieldItem.find('[name^=col]').val(data.newfile);
            }
            //接口返回是图片类型
            if (type == 'img') {
                if (ismore) {
                    _this.upimgarr[moduleId] = _this.upimgarr[moduleId] - data.successcount;
                    var imgobj = fieldItem.find('[name^=col]').val().split(',')
                    for (var i = 0; i <= imgobj.length - 1; i++) {
                        initviewimg(module, options, fieldItem, layout, imgobj[i], ismore)
                    }
                    if (_this.upimgarr[moduleId] <= 0) {
                        module.find('.customFormImgMore').parent().hide()
                        module.find('.customFormImgMore').attr('disabled', true)
                        module.find('.customform-upload-img-preview').eq(3)
                    }
                    var newval2 = data.newfile + ',' + oldval
                    newval2 = newval2.replace(/,$/gi, "")
                    fieldItem.find('[name^=col]').val(newval2)
                } else {
                    initviewimg(module, options, fieldItem, layout, data.newfile, ismore)
                }
            } else {
                if (layout == '105') {
                    fieldItem.find('.UploadFileSpan').css('display', 'inline-flex');
                } else {
                    fieldItem.find('.UploadFileSpan').css('display', 'flex');
                }
                // fieldItem.find('.UploadFileSpan').css('justify-content', 'center');
                // fieldItem.find('.UploadFileSpan').css('align-items', 'center');
                var html = '';
                html += '<span style="margin-right: 5px;" class="iconfont icon-fujian"></span><span class="customform-upload-file-preview">' + data.newfile.replace(/.*\//g, '') + '</span><span style="color:#959da7;font-size: 12px; margin-left: 10px; cursor: pointer;" title="可点击关闭" class="iconfont fileclose icon-guanbi3" ></span>';
                fieldItem.find('.UploadFileSpan').html(html);
                closeuploadForm(module, fieldItem, options, layout)
            }
        },
        error: function (data, status, e) //服务器响应失败处理函数
        {
            console.log(e)
            alert("发生异常，可能文件太大");
            // 移除loading层
            $('.loadingPanel').remove();
            fieldItem.find('.Browse-file').show();
            if (type == 'img') {
                var file = fieldItem.find('.Browse-file').html();
                var id = fieldItem.find('.Browse-file').attr("id");
                fieldItem.find('.Browse-file').replaceWith('<div id="' + id + '" class="Browse-file Browse-file-img Browse-img">' + file + '</div>');
                initCustomFormImgUpload(module, options, layout, ismore);
            }
            else {
                var file = fieldItem.find('.Browse-file').html();
                var id = fieldItem.find('.Browse-file').attr("id");
                fieldItem.find('.Browse-file').replaceWith('<span id="' + id + '" class="Browse-file">' + file + '</span>');
                initCustomFormFileUpload(module, options, layout);
            }
        },
        complete: function (data) {
            // 移除loading层
            $('.loadingPanel').remove();
        }
    });
    //再次初始化
    // this.upimgarr[moduleId] > 0)
    if (ismore) {
        if (this.upimgarr[moduleId] >= 0) {
            //this.upimgarr[moduleId]--
            initCustomFormImgUpload(module, options, layout, true)
        }
        else {
            alert('最多上传5张');
            return false;
        }
    }
}

function initviewimg(module, options, fieldItem, layout, newfile, ismore) {
    var html = '';
    html += '<div class="customform-upload-img-preview">';
    html += '<img  src="' + newfile + '" />';
    html += '<span title="可点击关闭"  class="iconfont icon-guanbi3 imgclose" style=" line-height: 1; background: #4e4e4e;color: #fff; border-radius: 50%; padding: 5px;font-size: 12px;right: -9px; cursor: pointer;position: absolute; top: -10px;" ></span>';
    html += '</div>';
    if (layout == '105') {
        $(html).appendTo(fieldItem.find('.file-operation'));
    } else {
        $(html).insertBefore(fieldItem.find('.Browse-img'));
        //fieldItem.find('.file-operation').prepend(html);
    }
    closeuploadimgForm(module, fieldItem, options, layout, ismore)
}



// 初始化表单验证
function initCustomFormValidate(module, customFormOptions) {
    addScript('/share/global.js', function () {
        var formElem = module.find("form");
        // 绑定表单验证
        var options = {
            ignore: ".ignore",
            rules: {},
            messages: {},
            errorElement: 'p',
            errorClass: 'invalid',
            errorPlacement: function (error, element) {
                var obj = $(element).closest('.customFormFieldItem')
                // if (obj.find('.invalid').attr('fieldtype') == '9' || obj.find('.invalid').attr('fieldtype') == '6') {
                //     obj = $(element).closest('.customFormFieldItem')
                // }
                // console.log(error)
                $(error).appendTo(obj).addClass('CustomFormGiant-err');
            },
            showErrors: function (errorMap, errorList) {
                this.defaultShowErrors();
                for (var i = 0; i < errorList.length; i++) {
                    $(errorList[i].element).closest('.customFormFieldItem').addClass('CustomFormGiant-err-box');
                }
            },
            // onkeyup的时候去除空格显示
            onkeyup: false,
            onclick: false,
            onsubmit: true,
            onfocusout: function (element, event) {
                try {
                    //去除左侧空格
                    var value = $.trim(this.elementValue(element));
                    $(element).val(value);
                } catch (e) { }
            },
            submitHandler: function (form) {
                return submitCustomForm(module, customFormOptions);
            }
        }
        var validateOptions = getformValidateOptions(formElem, customFormOptions);

        options.rules = validateOptions.rules;
        options.messages = validateOptions.messages;
        formElem.validate(options);
        var color = ''
        // 点击提交按钮提交表单
        module.find('.customFormSubmit').off('click').on('click', function () {
            color = module.find(".vcbtn1").css("background-color");
            if (module.find('.VerificationCodediv').length > 0) {
                module.css("height", "100%")
                module.find('.ModuleCustomFormGiant').css("overflow", "unset");
                module.closest('.ModuleGridGiant').css('overflow', 'unset')
                module.closest('.ModuleGridCustomGiant').css('overflow', 'unset')
                module.closest('.ModuleSubPupopBox').css('overflow', 'unset')
                module.closest('.ModuleSubGridCustomBox').css('overflow', 'unset')
                if (formElem.valid()) {
                    if (window.innerWidth < 768) {
                        $('body').append("<div class='customFormlayer' style='position: fixed; top: 0;background:#000; height: 100%; width: 100%; opacity: 0.3;'></div>")
                    }
                    var currentheight = module.height();

                    if ($(this).attr("layout") == "105") {
                        //当在幻灯片里时候
                        if (module.parent('div').hasClass("ModuleSlideContainer")) {
                            if (module.position().top > 0) {
                                module.find('.VerificationCodediv').css("top", "-" + module.position().top + "px");
                            } else {
                                module.find('.VerificationCodediv').css("top", module.position().top + "px");
                            }
                        } else {
                            if ($(this).offset().top < 380) {
                                module.find('.VerificationCodediv').css("top", "0");
                            }
                            //底部不够位置的时候
                            else if ($(this).offset().top + 380 > $(document).height()) {
                                module.find('.VerificationCodediv').css("top", "unset");
                            }
                        }
                    } else {
                        if (currentheight < 380) {
                            //移动端的时候
                            if (window.innerWidth < 768) {

                            } else {
                                if ($(this).offset().top + 380 > $(document).height()) {
                                    module.find('.VerificationCodediv').css("top", '-40px');
                                } else {
                                    module.find('.VerificationCodediv').css("top", '60px');
                                }
                            }
                        }
                    }
                    formElem.find('img.vCodeImg').attr("src", "/index.php?c=validatecode&useCurve=1&useNoise=1&fontSize=32&imageW=290&imageH=100&t=" + Math.random());
                    module.find('.VerificationCodediv').show()
                }
            } else {
                $(this).closest('form').submit();
            }
        });

        //关闭验证码窗口
        module.find('.VCClose,.vcbtn2').off('click').on('click', function () {
            module.find('.VerificationCodediv').hide()
            module.closest('.ModuleSubPupopBox').css('overflow', 'auto')
            module.find('.ModuleCustomFormGiant').css('overflow', 'hidden');
            module.closest('.ModuleGridGiant').css('overflow', 'hidden')
            module.closest('.ModuleGridCustomGiant').css('overflow', 'hidden')
            if (window.innerWidth < 768) {
                $(".customFormlayer").remove();
            }
        })
        //关闭验证码窗口
        module.find('.vcbtn1').off('click').on('click', function () {
            if (module.find('input[name=vCode]').val() == '') alert(customFormOptions.lang.please_checkcode1);
            else {
                $(this).closest('form').submit();
            }
        })

        //输入框的时候，去掉边框
        module.find(".vcinput").bind('focus ', function () {
            module.find(".vciline").css("background-color", color)
            module.find(".vciline").animate({ width: module.find(".vcinput").outerWidth(true) }, 300)
        })

        module.find(".vcinput").bind('blur ', function () {
            module.find(".vciline").css("background-color", "unset")
            module.find(".vciline").css("width", "0")
        })


        // 刷新验证码
        module.find('.refreshVCode').off('click').on('click', function () {
            var src = formElem.find('img.vCodeImg').attr('src').replace(/t=[^&]*/) + '&t=' + new Date().getTime();
            formElem.find('img.vCodeImg').attr('src', src);
        });
    });
}

// 获取表单验证参数（规则和对应的提示信息）
function getformValidateOptions(formElem, options) {
    if (!formElem && $(formElem).length == 0) {
        return {};
    }
    var rules = {};
    var messages = {};
    var obj = '[name^=col], [name=vCode]'
    if ($('.VerificationCodediv').length > 0) {
        obj = '[name^=col]'
    }
    $(formElem).find(obj).each(function (i, item) {
        var type = $(item).attr("type");
        var require = $(item).attr("isrequire");
        var ftype = $(item).attr("fieldtype");
        var vtype = $(item).attr("validatetype");
        var chname = $(item).attr("chname");
        var name = $(item).attr("name");
        var smsv = $(item).attr("smsvalidate");
        rules[name] = {};
        messages[name] = {};
        if (ftype == '1' || ftype == '2') {
            if (require == '1') {
                rules[name]['required'] = true;
                messages[name]['required'] = options.lang.plz_fill_in_the_item; // '该项不能为空'
            }
            if (vtype == '2') {
                rules[name]['digits'] = true;
                messages[name]['digits'] = options.lang.plz_enter_numbers; //'请填写数字';
            }
            if (vtype == '3') {
                if (getCookie('Lang') == 'big5') {
                    //验证香港澳门号码
                    jQuery.validator.addMethod("custformMobile", function (value, element) {
                        return this.optional(element) || /^(5|6|8|9)\\d{7}$/.test($.trim(value));
                    });
                } else {
                    jQuery.validator.addMethod("custformMobile", function (value, element) {
                        return this.optional(element) || /^(1)\d{10}$/.test($.trim(value));
                    });
                }
                rules[name]['custformMobile'] = true;
                messages[name]['custformMobile'] = options.lang.mobileformat; // '手机号码格式不正确！'
            }
            if (vtype == '4') {
                jQuery.validator.addMethod("custformTel", function (value, element) {
                    return this.optional(element) || /^\d{3,4}\-\d{6,9}$/.test(value);
                });
                rules[name]['custformTel'] = true;
                messages[name]['custformTel'] = options.lang.plz_enter_correct_phone_number; //'请填写正确的电话号码，格式如区号-电话号码'
            }
            if (vtype == '5') {
                jQuery.validator.addMethod("custformTelOrMobile", function (value, element) {
                    return this.optional(element) || /^\d{3,4}\-\d{6,9}$/.test(value) || /^(1)\d{10}$/.test(value);
                });
                rules[name]['custformTelOrMobile'] = true;
                messages[name]['custformTelOrMobile'] = options.lang.plz_enter_the_correct_tel_or_mobile_number; // '请填写座机格式：区号-电话号码或手机号码'
            }
            if (vtype == '6') {
                rules[name]['email'] = true;
                messages[name]['email'] = options.lang.emailfomart; // '请填写正确的邮箱地址';
            }
            if (vtype == '7') {
                jQuery.validator.addMethod("custformIdcard", function (value, element) {
                    return this.optional(element) || /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(value);
                });
                rules[name]['custformIdcard'] = true;
                messages[name]['custformIdcard'] = options.lang.plz_enter_the_correct_idcard_number; //'请填写正确的身份证'
            }
        } else if (ftype == '3' || ftype == '4') {
            if (require == '1') {
                rules[name]['required'] = true;
                messages[name]['required'] = options.lang.plz_select_one_of_these_items; //"请选择其中一项"
            }
        } else if (ftype == '5') {
            if (require == '1') {
                rules[name]['required'] = true;
                messages[name]['required'] = options.lang.plz_select_at_least_one_item; //"请至少选择一项"
            }
        } else if (ftype == '6' || ftype == '9' || ftype == '10') {
            if (require == '1') {
                rules[name]['required'] = true;
                messages[name]['required'] = options.lang.plz_select_a_file_to_upload; //'请选择文件上传'
            }
        } else if (ftype == '7') {
            if (require == '1') {
                rules[name]['required'] = true;
                messages[name]['required'] = options.lang.plz_select_the_region; // '请选择地区'
            }
        } else if (ftype == '8') {
            if (require == '1') {
                rules[name]['required'] = true;
                messages[name]['required'] = options.lang.plz_select_the_date; //'请选择日期'
            }
            jQuery.validator.addMethod("custformDate", function (value, element) {
                return this.optional(element) || /\d{4}-\d{2}-\d{2}/.test(value);
            });
            rules[name]['custformDate'] = true;
            messages[name]['custformDate'] = options.lang.the_date_is_not_in_the_correct_format; //'日期格式不正确'
        }

        if (vtype == '99') {
            var validateFunction = $(item).attr('validateFunction'); // 实际存在的函数方法名
            var validateFunctionName = 'validateFunction_' + name; // jquery.validate验证方法名
            var fieldName = chname || name; // 字段名称
            var errMsg = $(item).attr('validateErrMsg') || ('请正确填写' + fieldName); //通用的错误提示信息

            // 定义jquery.validate验证方法
            window[validateFunctionName] = function (value, element) {
                if (typeof window[validateFunction] != 'function') {
                    throw validateFunction + ' is not a function';
                }
                return window[validateFunction].call(window, value, element);
            }

            // 验证方法加入jquery.validate框架
            jQuery.validator.addMethod(validateFunctionName, function (value, element) {
                return this.optional(element) || window[validateFunctionName](value, element);
            }, errMsg);

            // 加入规则和提示信息
            rules[name][validateFunctionName] = name;
            messages[name][validateFunctionName] = function () {
                return window['validateErrMsg_' + name] || errMsg;
            }
        }
        if (smsv == '1') {
            rules[name]['required'] = true;
            messages[name]['required'] = options.lang.please_checkcode1;
        }
    });

    if ($(formElem).attr('id')) {
        window['jquery_validate_rules_' + $(formElem).attr('id')] = rules;
        window['jquery_validate_messages_' + $(formElem).attr('id')] = messages;
    }
    return {
        rules: rules,
        messages: messages
    };
}

function checksmsvcode(formElem) {
    var result = true
    if (formElem.find('.smsvaldatebox:visible').length > 0) {
        var vcode = formElem.find('.smsvaldatebox [smsvalidate = 1]').val()
        var txtval = formElem.find('.smsvaldatebox [smsvalidate = 1]').parent().parent().find('.customFormText').val()
        $.ajax({
            type: "GET",
            url: "/index.php?c=Front/CustomForm&a=checksmsvcode&mobile=" + txtval + '&vcode=' + vcode,
            dataType: "json",
            async: false,
            success: function (data) {
                if (data.success) {
                    result = true
                }
                else {
                    alert(data.msg)
                    formElem.find('.VerificationCodediv').hide()
                    formElem.find('.customFormSubmit').prop('disabled', false);
                    formElem.find('.customFormSubmit').val(formElem.find('.customFormSubmit').attr('btntext'));
                    result = false
                    $(".customFormlayer").remove();
                }
            }
        })
        return result
    } else {
        return result
    }

}

function checkuser() {
    $.ajax({
        type: "GET",
        url: "/index.php?c=Front/CustomForm&a=checkuser",
        dataType: "json",
        async: false,
        success: function (data) {
            if (data.isLogined == 1) {
                result = true
            } else {
                result = false
            }
        }
    })
    return result;
}

// 提交表单
function submitCustomForm(module, options) {
    var formElem = module.find('form');
    var moduleId = formElem.find("[name=ModuleID]").val();
    var Siteid = getCookie('InitSiteID');
    var inviteid = getCookie('invite') || '';
    var isenquiryForm = formElem.closest('.enquiryFormDiv').length || PageType == 48

    formElem.find('.customFormSubmit').prop('disabled', true);
    formElem.find('.customFormSubmit').val(options.lang.form_submitting);
    var isok = checksmsvcode(formElem)
    if (options.IsPay == 1) {
        isok = this.checkuser()
        if (!isok) {
            var back_url = document.URL
            location.href = '/index.php?c=front/Userlogin&BackUrl=' + escape(back_url)
        }
        if (formElem.find("[name=payamount]").val() == 'NaN' || formElem.find("[name=payamount]").val() == '') {
            alert(getLang('Calculation_failed'))
            return false;
        }
    }
    if (isok) {
        var submitType = formElem.find('[name=submitType]').val();
        if (submitType != 'ajax') {
            if (window[formElem[0]] && window[formElem[0]].submitHandle) {
                return window[formElem[0]].submitHandle.call(this);
            }
            return true;
        }

        $('.customFormMask, .customFormLoading').remove();
        $('<div class="customFormMask" style="position:fixed;z-index:9999999;top:0px;left:0px;width:100%;height:100%;background:black;opacity:0.5;filter:alpha(opacity=50);zoom:1;"></div>').appendTo('body');
        $('<div class="customFormLoading" style="position:fixed;z-index:10000000;top:50%;left:50%;width:auto;height:100%;"><img src="/images/loading.gif"></div>');

        var data = formElem.serializeArray();
        var proid = "";
        if (isenquiryForm > 0) {
            var proArr = JSON.parse(localStorage.getItem('enquiryPro' + Siteid + inviteid)) || [];
            if (proArr.length > 0) {
                // for (var i = 0; i < proArr.length; i++) {
                //     proid += "," + proArr[i].productID;
                // }
                // proid = proid.substr(1)
                data.push({ "name": "EnquiryProduct", "value": JSON.stringify(proArr) })
            } else {
                alert(options.lang.enquiry_none_product);
                window.location.reload();
                return false
            }
        }

        $.ajax({
            type: "POST",
            url: "/index.php?c=Front/CustomForm&a=save",
            data: data,
            dataType: "json",
            success: function (json) {
                if (!json.success) {
                    alert(json.msg);
                    return;
                }

                // 如果是特殊ID,则不刷新改为关闭操作，该需求是品牌首页弹窗表单所需
                if (Number(moduleId) !== 9999 && isenquiryForm == 0) {
                    // 提交完，重新加载表单
                    $.get("/index.php?c=front/LoadModule&moduleId=" + moduleId, null, function (data) {
                        module.replaceWith(data);
                    });
                    $('#module_' + moduleId).css("visibility", 'visible');
                } else {
                    if (isenquiryForm > 0) {
                        document.getElementById("customForm" + moduleId).reset();
                        module.find('.VCClose').click()
                        $('.enquiryClose .icon-guanbi').click()
                        localStorage.removeItem('enquiryPro' + Siteid + inviteid);
                        if (trackerdata.leadID != undefined && trackerdata.leadID != '') {
                            gtag('config', trackerdata.leadID)
                            gtag('event', 'conversion', { 'value': proid, 'event_callback': '' })
                        }

                    } else {
                        if ($('#module_' + moduleId).closest('#form_box').find('.form_colse').length > 0) {
                            $('#module_' + moduleId).closest('#form_box').find('.form_colse').click();
                        }
                    }
                }

                // 提示成功
                alert(options.lang.submit_success);
                if (window.innerWidth < 768) {
                    $(".customFormlayer").remove();
                }
                // 若果有设置跳转链接，就跳转页面
                if (options.successRedirectUrl) {
                    location = options.successRedirectUrl;
                }else{
                    if(isenquiryForm>0 && Page == 'YouZhan.SiteFront.EquiryList'){
                        window.location.reload();
                    }
                }
                $('.customFormMask, .customFormLoading').remove();
                if (json.orderid) {
                    location = '/index.php?c=front/Onlinepay&a=formpay&showtips=0&OrderID=' + json.orderid + '&Action=' + json.action + '&Sign=' + json.signStr + '&amount=' + $(module).find('[name=payamount]').val() + '&t=' + json.t + '&UserID=' + getCookie("WebUserID")
                }
            },
            error: function () {
                alert(options.lang.submit_failed);
                formElem.find('.customFormSubmit').prop('disabled', false);
                formElem.find('.customFormSubmit').text(formElem.find('.customFormSubmit').attr('btntext'));
            },
            complete: function () {
                if (arguments[1] == 'success' && arguments[0].responseJSON.success && options.successRedirectUrl) {
                    return;
                }
                formElem.find('.customFormSubmit').prop('disabled', false);
                formElem.find('.customFormSubmit').text(formElem.find('.customFormSubmit').attr('btntext'));
                $('.customFormMask, .customFormLoading').remove();

                //刷新验证码
                var vcode = formElem.find('img.vCodeImg');
                if (vcode.length > 0) {
                    var src = vcode.attr('src').replace(/t=[^&]*/) + '&t=' + new Date().getTime();
                    vcode.attr('src', src);
                }
            }
        });
    }
    return false;
}

//多列展示
function multiseriate(moduleId, options) {
    var ItemCount = 1
    if (window.innerWidth < 768) {
        ItemCount = (options.XsItemCount == 0 ? 1 : options.XsItemCount)
    } else {
        ItemCount = (options.LgItemCount == 0 ? 1 : options.LgItemCount)
    }
    if (ItemCount == 1) {
        $('#customForm' + moduleId + " .customFormFieldItem").width('100%');
    } else {
        var ins = 0
        var ic = 100 / Number(ItemCount);
        $('#customForm' + moduleId + " .customFormFieldItem").each(function () {
            if ($(this).attr("multiseriate") == '1') {
                $(this).css('width', 'calc(' + ic.toFixed(2) + '% - 7.5px)');
                if (layout == 106) {
                    $(this).find('.txtitem').css('cssText', 'max-width:100% !important')
                }
                ins++
            } else {
                if (ins % ItemCount != 0) {
                    ins = 0
                    $(this).prev('.customFormFieldItem').css('width', '100%');
                }
            }
        })
    }
}

//单选，多选关联组件
function releFromelem(moduleId, key, relejosn) {
    if (relejosn == undefined || relejosn == null || relejosn == '' || relejosn == 'null' || relejosn == 'undefined') return
    relejosn = JSON.parse(decodeURIComponent(relejosn))
    $.each(relejosn, function (idx, obj) {
        for (var i = 0; i <= obj.length - 1; i++) {
            var cur = $('#module_' + moduleId + " [name=col" + obj[i] + "]");
            if (cur.length == 0) cur = $('#module_' + moduleId + " [name=col" + obj[i] + "\\[\\]]");
            cur.closest('.customFormFieldItem').hide()
            cur.closest('.customFormFieldItem').find('input').addClass('ignore')
            var rel = cur.closest('.customFormFieldItem').attr('rel')
            if (rel == undefined || rel == '' || rel == 'undefined' || relejosn == 'null') {
                if (cur.attr('fieldtype') != '3' && cur.attr('fieldtype') != '5') cur.val('')
                cur.prop('checked', false)
                if (tpm[moduleId][cur.attr('chname')] != undefined) tpm[moduleId][cur.attr('chname')] = 0
            } else {
                releFromelem(moduleId, "", rel)
            }
        }
    });
    if (key != '') {
        $.each(relejosn, function (idx, obj) {
            if (idx == key) {
                for (var i = 0; i <= obj.length - 1; i++) {
                    var cur = $('#module_' + moduleId + " [name=col" + obj[i] + "]");
                    if (cur.length == 0) cur = $('#module_' + moduleId + " [name=col" + obj[i] + "\\[\\]]");
                    cur.closest('.customFormFieldItem').show()
                    cur.closest('.customFormFieldItem').find('input').removeClass('ignore')
                    var rel = cur.closest('.customFormFieldItem').attr('rel')
                    var type = cur.attr('fieldtype')
                    var keyt = ''
                    if (type == 3) keyt = $('#module_' + moduleId + " [name=col" + obj[i] + "]:checked").val()
                    else if (type == 4) keyt = $('#module_' + moduleId + " [name=col" + obj[i] + "]").val()
                    if (rel == undefined || rel == '' || rel == 'undefined' || relejosn == 'null') {
                        //return false;
                    } else {
                        releFromelem(moduleId, keyt, rel)
                    }
                }
                return false;
            }
        });
    }
}

//短信验证
function smsvaildate(moduleId, options) {
    $('#module_' + moduleId + ' .smsbtn').off('click').click(function () {
        if (!$(this).hasClass('issend')) {
            var txtval = $(this).parent().parent().find('.customFormText').val()
            var name = $(this).parent().parent().find('.customFormText').attr('name')
            var _this = $(this);
            var index = moduleId + "_" + name
            if (!/^(1)\d{10}$/.test($.trim(txtval))) {
                alert(options.lang.mobileformat);
                return false
            } else {
                $.ajax({
                    type: "GET",
                    url: "/index.php?c=Front/CustomForm&a=sendsmsvcode&mobile=" + txtval,
                    dataType: "json",
                    success: function (data) {
                        if (data.success) {
                            $('#module_' + moduleId + ' .smsvcode').show()
                            _this.addClass('issend')
                            if (setint.indexOf(index) == -1) {
                                setintcount[index] = 60
                                setint[index] = setInterval(function () {
                                    setintcount[index]--
                                    //重新获取
                                    _this.html('(' + setintcount[index] + 's)' + options.lang.ResendAfter)
                                    if (setintcount[index] == 0) {
                                        clearInterval(setint[index])
                                        //'获取验证码'
                                        _this.html(options.lang.send_code)
                                        _this.removeClass('issend')
                                        setintcount[index] = 60
                                    }
                                }, 1000)
                            }
                        } else {
                            alert(data.msg)
                        }
                    }
                })

            }
        }
    })
}

//显示类型
function Displaymode(moduleId, layout) {
    if ($.inArray(Number(layout), [101, 102, 103, 104, 105, 106, 107]) > -1) {
        var formElem = $('#module_' + moduleId).find("form");
        var obj = "[fieldtype=5], [fieldtype=3]";
        $(formElem).find(obj).each(function (i, item) {
            var FieldItem = $(item.closest('.customFormFieldItem'))
            var pc = FieldItem.attr('pcshow')
            var mobile = FieldItem.attr('mobileshow')
            //手机
            if (window.innerWidth < 768) {
                //纵向排列
                if (mobile == '1') {
                    FieldItem.find('.mobile-formList-content').hide()
                    FieldItem.find('.Pc-formList-content').css('cssText', 'display:flex !important;flex-wrap: wrap;')
                    if (layout == 101) {
                        FieldItem.find('.Pc-formList-content .in-formList-checkbox').addClass('flex-wrap')
                    }
                    if (layout == 103 || layout == 106) FieldItem.find('.Pc-formList-content .in-formList-checkbox').addClass('vertical')
                    if (layout == 102, 107) {
                        FieldItem.find('.content-title').css('cssText', 'max-width:100%;width:100%')
                        FieldItem.find('.Pc-formList-content .in-formList-checkbox').addClass('vertical')
                    }
                    if (layout == 104) {
                        FieldItem.find('.Pc-formList-content .in-formList-checkbox').addClass('flex-wrap')
                    }

                    FieldItem.find('.Pc-formList-content label').addClass('verticalalign')
                } else {
                    if (layout == 101) FieldItem.find('.Pc-formList-content .in-formList-checkbox').removeClass('flex-wrap')
                    if (layout == 103 || layout == 106) FieldItem.find('.Pc-formList-content').find('.in-formList-checkbox').removeClass('vertical')
                    if (layout == 102 || layout == 107) {
                        FieldItem.find('.Pc-formList-content').find('.in-formList-checkbox').removeClass('vertical')
                    }
                    FieldItem.find('.Pc-formList-content').hide()
                    FieldItem.find('.mobile-formList-content').show()
                    FieldItem.find('.Pc-formList-content').find('label').removeClass('verticalalign')
                }
            }
            else {
                FieldItem.find('.mobile-formList-content').hide()
                FieldItem.find('.Pc-formList-content').show()
                FieldItem.find('.Pc-formList-content').attr('style', '')
                //纵向排列
                if (pc == '1') {
                    if (layout == 101) { FieldItem.find('.Pc-formList-content .in-formList-checkbox').addClass('flex-wrap') }
                    if (layout == 104) {
                        FieldItem.find('.Pc-formList-content .in-formList-checkbox').addClass('flex-wrap')
                    }
                    if (layout == 103 || layout == 106) FieldItem.find('.Pc-formList-content').find('.in-formList-checkbox').addClass('vertical')
                    if (layout == 102 || layout == 107) {
                        FieldItem.find('.Pc-formList-content').find('.in-formList-checkbox').addClass('vertical')
                        FieldItem.find('.Pc-formList-content').removeClass('flex')
                    }
                    FieldItem.find('.Pc-formList-content').find('label').addClass('verticalalign')
                }
                //横向排列
                else {
                    if (layout == 101) { FieldItem.find('.Pc-formList-content .in-formList-checkbox').removeClass('flex-wrap') }
                    if (layout == 104) {
                        FieldItem.find('.Pc-formList-content .in-formList-checkbox').removeClass('flex-wrap')
                    }
                    if (layout == 102 || layout == 107) {
                        FieldItem.find('.Pc-formList-content').find('.in-formList-checkbox').removeClass('vertical')
                        FieldItem.find('.Pc-formList-content').addClass('flex')
                    }
                    if (layout == 103) FieldItem.find('.Pc-formList-content').find('.in-formList-checkbox').removeClass('vertical')
                    FieldItem.find('.Pc-formList-content').find('label').removeClass('verticalalign')
                }
            }
        })
    }
}



/**
 * js获取多语言
 * @param  string lang 要获取多语言的key
 * @return string 多语言
 */
function getLang(lang) {
    if (window.AllLang) {
        return window.AllLang[lang];
    } else {
        var sys_lang = 'cn,big5,en,fr,jp,kr';
        var site_lang = (getCookie && sys_lang.indexOf(getCookie('Lang')) > -1) ? getCookie('Lang') : 'en';
        site_lang = site_lang == 'big5' ? 'cn' : site_lang
        var lang_url = '/share/lang/lang_' + site_lang + '.json?v=' + Math.random(1, 9999);
        $.ajax({
            url: lang_url,
            type: 'GET',
            dataType: 'json',
            async: false,
            success: function (json) {
                window.AllLang = json;
            }
        });
        return window.AllLang[lang];
    }
}
