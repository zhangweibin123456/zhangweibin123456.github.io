function onlineServiceGiantInit(moduleid, layout, options) {
  $(function () {
    // if($.inArray(layout, ['101', '102']) > -1){
    //   $("#module_" + moduleid).css('width','208px');
    // }
    loaddialogbox(moduleid);
    if (options['CanDesign'] == 1 || options['CanEditFront'] == 1 || $.inArray(layout, ['101', '102']) > -1) {
      //编辑模式下特殊处理
      $("#module_" + moduleid).attr('title', '');
      var module = $("#module_" + moduleid).clone();
      $("#module_" + moduleid).remove();
      module.appendTo('body');
    }
    $(window).off('scroll.module' + moduleid);
    $("#module_" + moduleid).off('mousemove');
    switch (layout) {
      case '101':
      case '102':
        // 先去掉这种滚动效果
        // var offsetTop = $("#module_" + moduleid).offset().top
        // var isscroll = setScorllVal($("#module_" + moduleid), offsetTop, 'no-scroll');
        // if (isscroll) {
        //   $(window).on('scroll.module' + moduleid, function () {
        //     setScorllVal($("#module_" + moduleid), isscroll, 'scrolling');
        //   })
        // }

        if (options['Showdisplay'] == '0') {
          $("#module_" + moduleid + ' .online-service-toggle-btn' + ",#module_" + moduleid + ' .online-service-header-close').closest('.online-service').toggleClass('right').toggleClass('left').closest("#module_" + moduleid).toggleClass(function () {
            if ($(this).find('.setLeft').length > 0) return 'toleft'
            return 'toright'
          })
        }
        if ($(window).width() > 767) {
          $("#module_" + moduleid).show()
        }

        $(window).resize(function () {
          if ($(window).width() > 767) {
            $("#module_" + moduleid).show()
          }
          else {
            $("#module_" + moduleid).hide()
          }
        })

        $("#module_" + moduleid + ' .online-service-toggle-btn' + ",#module_" + moduleid + ' .online-service-header-close').off('click').click(function () {

          $(this).closest('body').css('overflow-x', 'hidden');
          $(this).closest('.online-service').toggleClass('right').toggleClass('left').closest("#module_" + moduleid).toggleClass(function () {
            if ($(this).find('.setLeft').length > 0) return 'toleft'
            return 'toright'
          })
        })
        // 防止收起状态显示设置按钮
        $("#module_" + moduleid + ' .online-service-toggle-btn,' + "#module_" + moduleid + ' .online-service-giant-ToTop-btn').on('mouseenter', function (event) {
          if ($(this).closest('.online-service').hasClass('left')) {
            event.stopPropagation();
            $('#moduleHelper').hide()
          }
        })
        break;
      case '103':
      case '104':
      case '105':
      case '106':
      case '107':
        var this_container = $("#module_" + moduleid);
        this_container.off()
        var this_showService = this_container.find(".online-service-giant"),
          mouse_enter_service = false; //为了移出消失弹出层
        if ($.inArray(parseInt(layout), [107]) > -1) {
          this_container.find('.online-service-giant-IM .IM-item-link img').before('<i class="iconfont icon-xinxi3"></i>').remove();
        }
        this_container.find(".online-service-giant-btn").off('mouseover').on('mouseover', function () {
          var service_type = $(this).attr("target");

          this_container.find(".service-active").removeClass("service-active");
          $(this).addClass('service-active');
          this_container.find(".online-service-giant-content").addClass('online-service-giant-hidden');
          if (!service_type) {
            return;
          }
          var contentExist = this_container.find(".online-service-giant-" + service_type);
          if (contentExist.children().length) {
            contentExist.removeClass("online-service-giant-hidden");
          }
          var topPos = 0;
          // 判断弹窗的位置
          if ($.inArray(parseInt(layout), [103, 104, 105, 107]) > -1) {
            switch (service_type) {
              case 'IM':
                topPos = this_container.find('.online-service-giant-IM-btn').offset().top - this_container.offset().top;
                break;
              case 'contact':
                topPos = this_container.find('.online-service-giant-Contacts-btn').offset().top - this_container.offset().top;
                break;
              case 'qrcode':
                topPos = this_container.find('.online-service-giant-QrCode-btn').offset().top - this_container.offset().top;
                break;
              default:
                break;
            }
          }
          if ($.inArray(parseInt(layout), [106]) > -1) {
            // 判断弹窗的位置
            switch (service_type) {
              case 'IM':
                topPos = 0;
                break;
              case 'contact':
                topPos = (this_container.find('.online-service-giant-IM-btn').height() + 10) * this_container.find('.online-service-giant-IM-btn').length;
                break;
              case 'qrcode':
                topPos = (this_container.find('.online-service-giant-Contacts-btn').height() + 10) * this_container.find('.online-service-giant-Contacts-btn').length + (this_container.find('.online-service-giant-IM-btn').height() + 10) * this_container.find('.online-service-giant-IM-btn').length;
                // 如果二维码图片多于一张
                if (this_showService.find(".qrcode-content img").length > 1) {
                  topPos = topPos - 176;
                }
                this_container.find('.online-service-giant-qrcode').css('margin-right', '5px');
                break;
              default:
                break;
            }
            /* 换客服图标 */
            this_container.find(".online-service-giant .IM-item img").before("<i class='iconfont icon-kefu2'></i>");
            this_container.find(".online-service-giant .IM-item img").remove();
          }
          this_showService.css('top', topPos + 'px');

          this_showService.show();
          // 如果弹出层底部超过下边屏幕
          if ($.inArray(parseInt(layout), [103, 104, 105, 107]) > -1 && this_showService.position().top + this_showService.outerHeight() > $(window).height() - this_container.position().top) {
            this_showService.css('top', ($(window).height() - this_container.position().top - this_showService.outerHeight()) > (-this_container.position().top) ? ($(window).height() - this_container.position().top - this_showService.outerHeight()) : (-this_container.position().top) + 'px');
          }
          mouse_enter_service = true;
        });
        this_showService.off("mouseleave").on('mouseleave', function () {
          this_showService.hide();
          this_container.find(".service-active").removeClass("service-active");
          mouse_enter_service = false;
        });
        this_showService.off("mouseover").on('mouseover', function () {
          mouse_enter_service = true;
        });
        this_container.find(".online-service-giant-btn").off("mouseleave").on('mouseleave', function () {
          setTimeout(function () { //加这个是为了等待触发 online-service-giant的mouseover事件之后再判断是否消失弹出层
            if (!mouse_enter_service) {
              this_container.find(".online-service-giant").hide();
            }
          }, 300);
          mouse_enter_service = false;

          this_container.find(".service-active").removeClass("service-active");
        });
        // 兼容pad端 再次点击的时候弹出层消失
        $(document).off('click.removeServiceActive').on('click.removeServiceActive', function (e) {
          // 判断点击的不是弹出内容 或 按钮 就消失掉所有的弹出层
          if (!this_container.is(e.target) && this_container.has(e.target).length === 0) {
            this_container.find('.service-active').removeClass('service-active');
            this_container.find('.online-service-giant-content').addClass('online-service-giant-hidden');
          }
        });
        break;
      case '108':
        $('#module_' + moduleid + ' .online-service-content-list').mCustomScrollbar({ scrollButtons: { scrollSpeed: 100 }, });
        var max = 0
        $('#module_' + moduleid + ' .online-service-content').show();
        $('#module_' + moduleid + ' .online-service-content').css("opacity", 0);
        $('#module_' + moduleid + ' .online-service-content-list').find('.anima').css('height', 'auto');
        $('#module_' + moduleid + ' .online-service-content-list').find('.anima').each(function () {
          if ($(this).outerHeight(true) > max) max = $(this).outerHeight(true)
          $(this).attr('style', '')

        })
        $('#module_' + moduleid + ' .online-service-content-list').css("height", (max + 40) + 'px');
        $('#module_' + moduleid + ' .online-service-content').hide();
        $('#module_' + moduleid + ' .online-service-content').css("opacity", 1);

        $('#module_' + moduleid + ' .online-service-content-tab span').click(function () {
          var tabname = $(this).attr('tab');
          $('#module_' + moduleid + ' .online-service-content-tab span').removeClass('active')
          $(this).addClass('active');
          $('#module_' + moduleid + ' .online-service-content-list').find('.online-service-qrcode,.online-service-contacts,.online-service-accounts').removeClass('showanima').addClass('anima')
          $('#module_' + moduleid + ' .online-service-content-list').find('[tabname =' + tabname + ']').addClass('showanima')
        })
        $('#module_' + moduleid + ' .online-service-content-tab span').eq(0).click()

        $('#module_' + moduleid + ' .online-service-header').click(function () {
          $('#module_' + moduleid + ' .online-service-header').slideUp(100, 'linear', function () {

            $('#module_' + moduleid + ' .online-service-content').slideDown('slow')
          });
        })
        $('#module_' + moduleid + ' .content-close').click(function () {
          $('#module_' + moduleid + ' .online-service-content').slideUp('slow', function () {
            $('#module_' + moduleid + ' .online-service-header').slideDown("fast");
          })
        })
        $('#module_' + moduleid + ' .online-service-content-list').hover(function () {
          $('#module_' + moduleid + ' #mCSB_1_dragger_vertical').css('opacity', '1')
        }, function () {
          $('#module_' + moduleid + ' #mCSB_1_dragger_vertical').css('opacity', '0')
        })
        break;
      case '109':
        var maxwidth = 0
        $('#module_' + moduleid + ' .online-service-content').show()
        $('#module_' + moduleid + ' .online-service-content').css("opacity", 0);
        $('#module_' + moduleid + ' .contacts-item-name').each(function () {
          if ($(this).width() > maxwidth) maxwidth = $(this).width()
        })
        $('#module_' + moduleid + ' .online-service-content').hide()
        $('#module_' + moduleid + ' .online-service-content').css("opacity", 1);
        $('#module_' + moduleid + ' .contacts-item-name').css('width', maxwidth + 'px')
        $('#module_' + moduleid + ' .contact-item-content').css('width', 'calc(100% - ' + (maxwidth + 30) + 'px')
        var setInter = true;
        setInterval(function () {
          if (setInter) {
            if (!$('#module_' + moduleid + ' .animated-circles').hasClass('animated')) {
              $('#module_' + moduleid + ' .animated-circles').addClass('animated');
            } else {
              $('#module_' + moduleid + ' .animated-circles').removeClass('animated');
            }
          }
        }, 3000)
        // var wait = setInterval(function () {
        //   $('#module_' + moduleid + ' .online-service-hint').removeClass('show_hint').addClass('hide_hint');
        //   clearInterval(wait);
        // }, 4500);

        $('#module_' + moduleid + ' .online-service').hover(function () {
          //clearInterval(wait);
          $('#module_' + moduleid + ' .animated-circles2').removeClass('turn').addClass('turn')
          $('#module_' + moduleid + ' .online-service-hint').removeClass('hide_hint').addClass('show_hint');
        }, function () {
          $('#module_' + moduleid + ' .online-service-hint').removeClass('show_hint').addClass('hide_hint');
          $('#module_' + moduleid + ' .animated-circles2').removeClass('turn')
        }).click(function () {
          if (options['CanDesign'] == 1 || options['CanEditFront'] == 1) {
            $('#module_' + moduleid + ' .online-service').hide();
            $('#module_' + moduleid + ' >.module_' + moduleid).css('cssText', 'min-height:300px !important;margin-top:-170px');
            $('#module_' + moduleid + ' .online-service-top').css('cssText', 'margin-top: 256px;');
          }
          setInter = false
          $('#module_' + moduleid + ' .animated-circles').removeClass('animated');
          $('#module_' + moduleid + ' .online-service-content').slideDown("fast", function () {
            $('#module_' + moduleid + ' .online-service-content-tab .content-tab').addClass('content-tabh')
            $('#module_' + moduleid + ' .online-service').css('visibility', 'hidden');
            $('#module_' + moduleid + ' .online-service-content-tab .content-tab').hover(function () {
              var tabname = $(this).attr('tab');
              $(this).addClass('active');
              $(this).find('.content-tab-name').addClass('tabnameshow');
              $(this).find('.' + tabname + '-content').addClass('showami')
            }, function () {
              var tabname = $(this).attr('tab');
              $(this).find('.' + tabname + '-content').removeClass('showami')
              $('#module_' + moduleid + ' .content-tab-name').removeClass('tabnameshow')
            })
          });
        })
        $('#module_' + moduleid + ' .content-close').click(function () {
          setInter = true
          if (options['CanDesign'] == 1 || options['CanEditFront'] == 1) {
            $('#module_' + moduleid + ' .online-service').show();
            $('#module_' + moduleid + ' >.module_' + moduleid).css('cssText', 'min-height:120px !important');
            $('#module_' + moduleid + ' .online-service-top').css('cssText', 'margin-top: auto;');
          }
          $('#module_' + moduleid + ' .online-service-content-tab .content-tab').removeClass('content-tabh')
          $('#module_' + moduleid + ' .online-service-content-tab .content-tab').unbind("mouseenter").unbind("mouseleave");
          $('#module_' + moduleid + ' .online-service-content').slideUp("fast", function () {
            $('#module_' + moduleid + ' .online-service').css('visibility', 'visible');
          });
        })
        break;
      default:
        // statements_def
        break;
    }
    if (options.PopupTips == 1 && options['CanDesign'] == 0) {
      var classlist = $("#module_" + moduleid + ' .ModuleOnLineServiceGiant').attr('class')
      var clonehtml = $("#module_" + moduleid + ' .popuptips').html()
      $("body").append('<div id="module_' + moduleid + 'popuptips_clone" class="' + classlist + '"><div class="popuptips">' + clonehtml + '</div></div>')
      setTimeout(function () {
        $("#module_" + moduleid + 'popuptips_clone .popuptips').show()
      }, options.PTInterval * 1000)
      $('#module_' + moduleid + 'popuptips_clone .pctips,#module_' + moduleid + 'popuptips_clone .btnclose').off('click').on('click', function () {
        $('#module_' + moduleid + 'popuptips_clone .popuptips').hide()
        if (options.PTFrequencyType == 1) {
          var time = (options.PTFrequencyUnit == 0 ? options.PTFrequency : options.PTFrequency * 60) * 1000
          setTimeout(function () {
            $("#module_" + moduleid + 'popuptips_clone .popuptips').show()
          }, time)
        }
      })
    }
    var isScroll = false;
    $('#module_' + moduleid + ' .online-service-giant-ToTop-btn').off('click.backTop').on('click.backTop', function () {
      if($('body').find('.ModuleFullGiant').length>0){
        var moduleid = $('body').find('.ModuleFullGiant').parent().attr('id').replace('module_','')
        window['fullSwiper'+moduleid].slideTo(0)
      }else{
        if (isScroll) return false;
        $('body,html').animate({
          scrollTop: 0
        }, 1000).queue(function () {
          isScroll = false;
          $(this).dequeue()
        });
        return false;
      }
    });
    $('#module_' + moduleid + ' .IM-dialog').off('click').on('click',function(){
        var dialogsrc = $(this).attr('_dialogsrc')
        $('#imdialogbox' + moduleid).find('.dialogsrc').attr('src',dialogsrc)
        $('#imdialogbox' + moduleid).show()
    })
    $('#imdialogbox' + moduleid + ' .imdialogclose').off('click').on('click',function(){
      $('#imdialogbox' + moduleid).hide()
    })
  });
}

function loaddialogbox(moduleid){
  var html = '<div id="imdialogbox' + moduleid +'" class="imdialogbox">';
  html += '<div class="imdialogmask"></div>'
  html += '<div class="imdialoginfo"><span class="iconfont icon-zu3 imdialogclose"></span><img class="dialogsrc" src="" /></div>'
  html += '</div>'
  $('body').append(html)
}

function setScorllVal(dom, offsetTop, statu) {
  if (dom.length == 0) return
  var Offbottom = Number(dom.css('bottom').replace('px', '')),
    amount = dom.outerHeight() + Offbottom,
    scrollTop = document.documentElement.scrollTop || document.body.scrollTop; //滚动的距离
  if (amount > window.innerHeight) {
    if (statu == 'no-scroll') {
      setTimeout(function () {
        dom.css("cssText", "top:0px !important;position:fixed !important;bottom:unset !important")
      }, 500)
      return false
    } else {
      dom.css({ 'bottom': -scrollTop - (amount - window.innerHeight) })
    }
  } else {
    if (statu == 'scrolling') {
      dom.css({
        'bottom': -scrollTop - (dom.outerHeight() - window.innerHeight) - offsetTop
      })
    } else {
      return offsetTop
    }

  }
}