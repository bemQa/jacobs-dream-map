$(document).ready(function () {
	$('.burger').click(function(e){
        e.preventDefault();
        (this.classList.contains("active") === true) ? this.classList.remove("active") : this.classList.add("active");

        $('.menu-links').toggleClass('active');
        $('body').on('click', function (e) {
            var div = $('.menu-links, .burger');

            if (!div.is(e.target) && div.has(e.target).length === 0) {
                div.removeClass('active');
            }
        });
    });

    $('.anchor[href^="#"]').click(function () {
        if($(window).innerWidth() <= 1000) {
           $('.menu-links').removeClass('active'); 
           $('.burger').removeClass('active');
        }
        elementClick = $(this).attr("href");
        destination = $(elementClick).offset().top-150;
        $('html, body').animate( { scrollTop: destination }, 500, 'swing' );
        return false;
    });

    function OpenPopup(popupId) {
        $('body').removeClass('no-scrolling');
        $('.popup').removeClass('js-popup-show');
        popupId = '#' + popupId;
        $(popupId).addClass('js-popup-show');
        $('body').addClass('no-scrolling');
    }
    $('.pop-op').click(function (e) {
        e.preventDefault();
        let data = $(this).data('popup');
        OpenPopup(data);
    });
    function closePopup() {
        $('.js-close-popup').on('click', function (e) {
            e.preventDefault();
            $('.popup').removeClass('js-popup-show');
            $('body').removeClass('no-scrolling');
        });
    }
    closePopup();
    function clickClosePopup(popupId) {
        popupId = '#' + popupId;
        $(popupId).removeClass('js-popup-show');
        $('body').removeClass('no-scrolling');
    }

    $('.table-wrapper').scrollbar();
    $('.faq-wrap').scrollbar();
    $('.dream-text-wrapper').scrollbar();

    function maskInit() {
        $(".phone-mask").inputmask({
            mask:"+7(999)999-99-99",
            "clearIncomplete": true
        });

        $(".card-mask").inputmask({
            mask:"9999-9999-9999-9999",
            "clearIncomplete": true
        });
    }
    maskInit();

    function checkValidate() {
        var form = $('form');

        $.each(form, function () {
            $(this).validate({
                ignore: [],
                errorClass: 'error',
                validClass: 'success',
                rules: {
                    name: {
                        required: true 
                    },
                    email: {
                        required: true,
                        email: true 
                    },
                    phone: {
                        required: true,
                        phone: true 
                    },
                    message: {
                        required: true 
                    },
                    logo: {
                        required: true 
                    },
                    password: {
                        required: true,
                        normalizer: function normalizer(value) {
                            return $.trim(value);
                        }
                    }
                },
                errorElement : 'span',
                errorPlacement: function(error, element) {
                    var placement = $(element).data('error');
                    if (placement) {
                        $(placement).append(error);
                    } else {
                        error.insertBefore(element);
                    }
                },
                messages: {
                    phone: '???????????????????????? ??????????',
                    email: '???????????????????????? e-mail'
                } 
            });
        });
        jQuery.validator.addMethod('email', function (value, element) {
            return this.optional(element) || /\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,6}/.test(value);
        });
        jQuery.validator.addMethod('phone', function (value, element) {
            return this.optional(element) || /\+7\(\d+\)\d{3}-\d{2}-\d{2}/.test(value);
        });
    }
    checkValidate();

    if($('.select').length > 1) {
        $('select').each(function() {
            let $this = $(this).not('.select-search');
            let parent = $(this).not('.select-search').parents('.select');
            $this.select2({
                minimumResultsForSearch: Infinity,
                dropdownParent: parent
            });
        });
        $('.select-search').each(function() {
            let $this = $(this);
            let parent = $(this).parents('.select');
            $this.select2({
                dropdownParent: parent
            });
        });
    } else {
        $('select').select2({
            minimumResultsForSearch: Infinity,
            dropdownParent: $('.select')
        });
    }

    // ???????????????????????????? ????????????
    $('#restore-password .btn').click(function(e){
        e.preventDefault();
        if($('#restore-password form').valid()) {
            $('#restore-password .btn').addClass('disabled');
            $('.clock-text, .after-send').show();
            $('.before-send').hide();
            let dt = new Date();
            let time = dt.getFullYear() + '/' + (dt.getMonth()+1) + '/' + dt.getDate() + ' ' + dt.getHours() + ":" + (dt.getMinutes()+1) + ":" + dt.getSeconds();
            $('.clock').parent().show();
            $('.clock').countdown(time)
            .on('update.countdown', function(event) {
                $(this).html(event.strftime('%M:%S'));
            })
            .on('finish.countdown', function(event) {
                $(this).parent().hide();
                $('.after-send').hide();
                $('.before-send').show();
                $('#restore-password .btn').removeClass('disabled');
            });
        }
    });

    function openAccordion() {
        var wrap = $('.accordion-wrap');
        var accordion = wrap.find('.accordion-title');

        accordion.on('click', function () {
          var $this = $(this);
          var $parent = $(this).parent();
          var content = $this.next();

          if (content.is(':visible')) {
            $this.removeClass('active');
            $parent.removeClass('active');
            content.slideUp('fast');
          } else {
            $this.addClass('active');
            $parent.addClass('active');
            content.slideDown('fast');
          }

        });
    }
    openAccordion();

    $('.tab-trigger').click(function(){
        $('.tab-trigger').removeClass('active');
        var tab = $(this).data('tab');
        $('.tab').removeClass('active');
        $(this).addClass('active');
        $('.tab-item').removeClass('active');
        $('.tab-item.' + tab).addClass('active');
    });

    if($('.dropify').length) {
        $('.dropify').dropify({
            tpl: {
                message: '<div class="dropify-message"><p>?????????????? ?????????? ?????? ???????????????????? ???????? ????????????????</p></div>',
                preview: '<div class="dropify-preview"><span class="dropify-render"></span><div class="dropify-infos"><div class="dropify-infos-inner"><p class="dropify-infos-message">?????????????? ?????????? ?????? ???????????????????? ???????? ????????????????</p></div></div></div>',
                clearButton: '<button type="button" class="dropify-clear"><img src="img/trash.svg"></button>'
            }
        });
    }

    $('.tooltip-link').click(function(e) {
        e.preventDefault();
        $(this).next().toggleClass('active');

        $('body').on('click', function (e) {
            var div = $('.tooltip-link, .tooltip');

            if (!div.is(e.target) && div.has(e.target).length === 0) {
                div.removeClass('active');
            }
        });
    });

    if($('#video').length) {
        var overlay = document.getElementById('overlay');
        var vid = document.getElementById('video');

        if(overlay.addEventListener) {
            overlay.addEventListener("click", play, false)
        } else if(overlay.attachEvent) {
            overlay.attachEvent("onclick", play)
        }

        function play() { 
            if (vid.paused){
                vid.play(); 
                overlay.className = "o";
            }else {
                vid.pause(); 
                overlay.className = "";
            }
        }
    }

    if ($('.dreams-slider').length) {
        var wrap = $('.dreams-slider');

        var swiper = new Swiper(wrap, {
            // effect: 'fade',
            loop: true,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
            },
            pagination: {
                el: ".swiper-pagination",
            },
        });
        swiper.init();

    }

    if ($('.dreams-maps-slider').length) {

        function swipperInit() {
            var wrap = $('.dreams-maps-slider');

            var swiper = new Swiper(wrap, {
                slidesPerView: 2,
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev'
                },
                pagination: {
                    el: ".swiper-pagination",
                },

                effect: 'coverflow',
                centeredSlides: true,
                coverflowEffect: {
                    rotate: 0,
                    stretch: 180,
                    depth: 200,
                    modifier: 1,
                    slideShadows: false
                },

                loop: true,
                speed: 400,
                observer: true,
                observeParents: true,

                preloadImages: false,
                lazy: {
                    loadPrevNext: true,
                    loadPrevNextAmount: 3
                },
                breakpoints: {
                    1000: {
                        slidesPerView: 1,
                        effect: 'auto'
                    }
                }
            });
            swiper.init();
        }

        function swipperInitEdge() {
            var wrap = $('.dreams-maps-slider');

            new Swiper(wrap, {
                slidesPerView: 1,
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev'
                },
                pagination: {
                    el: ".swiper-pagination",
                },

                centeredSlides: true,

                loop: true,
                speed: 400,
                observer: true,
                observeParents: true,

                preloadImages: false,
                lazy: {
                    loadPrevNext: true,
                    loadPrevNextAmount: 3
                }
            });
        }
        if (/Edge/.test(navigator.userAgent)) {
            swipperInitEdge();
        } else {
            swipperInit();
        }

    }

    function test() {
        let question_number = $('.test-question-wrapper.active').data('question');

        $('.question-field').find('input[type="radio"]').on('click', function() {
            testBtnCheck();
        });

        $('.test-btn').on('click', function() {
            $('.test-question-title[data-question="'+ question_number +'"]').removeClass('active');
            $('.test-question-wrapper[data-question="'+ question_number +'"]').removeClass('active');
            question_number = question_number+1;
            $(this).addClass('disabled');
            $('.test-question-title[data-question="'+ question_number +'"]').addClass('active');
            $('.test-question-wrapper[data-question="'+ question_number +'"]').addClass('active');

            if(question_number > 5) {
                let result_number = 3;
                $('.test-form').hide();
                $('.test-result[data-result="'+ result_number +'"]').addClass('active');
            }
        });
    }

    test();

    function testBtnCheck() {
        if($('.question-field').find('input[type="radio"]').is(':checked')) {
            $('.test-btn').removeClass('disabled');
        }
    }
});