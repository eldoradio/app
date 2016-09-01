var ini = {
    protocol: 'https://',
    host: 'eldoradio.fm',
    container: 'main',
    audio: {
        id: 'audio',
        events: ['waiting','abort','loadstart','ended','error','stalled','suspend','playing','pause','canplay']
    },
    station: {
        list: {},
        id: '.station',
        container: '.stations-list',
        bitrates: [],
        title: '.stations-title',
        search: '.stations-search',
        current: null
    },
    countries: {
        ru: 'Россия',
        ua: 'Украина',
        kz: 'Казахстан'
    },
    socket: 1,
    message: {
        playing: '<br>Сейчас&nbsp;играет. Всего&nbsp;слушателей:&nbsp;',
        player_link: ' <a class="link popup application-hidden">Открыть&nbsp;плеер</a>',
        share_link: ' <a class="link fb-xfbml-parse-ignore" target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Feldoradio.fm%2F&amp;src=sdkpreparse">Поделиться</a>',
        legal_link: ' <a class="link view" data-url="/legal">Правовая&nbsp;информация</a>'
    },
    popup: {
        settings: 'top=10,left=10,width=360,height=300,location=0,menubar=0,status=0,titlebar=0,toolbar=0'
    },
    os: "Unknown"
};

/* OS Detection */

    // "Windows"    for all versions of Windows
    // "MacOS"      for all versions of Macintosh OS
    // "Linux"      for all versions of Linux
    // "UNIX"       for all other UNIX flavors 
    // "Unknown" indicates failure to detect the OS

    if (navigator.appVersion.indexOf("Win")!=-1) ini.os = "Windows";
    if (navigator.appVersion.indexOf("Mac")!=-1) ini.os = "MacOS";
    if (navigator.appVersion.indexOf("Linux")!=-1) ini.os = "Linux";
    if (navigator.appVersion.indexOf("Android")!=-1) ini.os = "Android";
    if (navigator.appVersion.indexOf("X11")!=-1) ini.os = "UNIX";

var app = {
    socket: function () {
        return 'socket' + (ini.socket == 5 ? 1 : ini.socket++);
    },
    api: function (path) {
        return ini.protocol + app.socket() + '.' + ini.host + (path || '');
    },
    host: function (path) {
        return ini.protocol + ini.host + (path || '');
    },
    storage: function (action, data) {
        var session = window.sessionStorage;
        if (action == 'get') {
            return session.getItem(data);
        } else if (action == 'set') {
            var key = Object.keys(data);
            return session.setItem(key, data[key]);
        }
    },
    initialize: function () {
        document.addEventListener('deviceready', app.DeviceReady, false);
    },
    GetStations: function (callback) {
        if (window.XDomainRequest) {
            var xdr = new XDomainRequest();
            xdr.open("get", app.api('/json'));
            xdr.onload = function () {
                var data = $.parseJSON(xdr.responseText);
                if (data == null || typeof (data) == 'undefined') {
                    app.ReloadPage();
                } else {
                    app.StoreStations(JSON.stringify(data));
                    callback(true);
                };
            };
            xdr.send();
        } else {
           $.ajax(app.api('/json'))
            .fail(function (data) {
                console.log('AJAX: fail - ' + JSON.stringify(data));
            })
            .done(function (data) {
                console.log('AJAX: done');
                if (data) {
                    app.StoreStations(JSON.stringify(data));
                    callback(true);
                } else {
                    callback(false);
                };
            });
        };
    },
    GetStationsBy: function (parameter, unique) {
        if (parameter === undefined || unique === undefined) {
            console.warn('Provide sorting paremeter and unique selector (true or false).');
            return;
        };
        var result = [];
        $.each(ini.station.list, function(n,a) {
            $.each(a, function(i,o) {
                if (unique) {
                    if ($.inArray(o[parameter], result) < 0) {
                        result.push(o[parameter]);
                    };
                } else {
                    result.push(o[parameter]);
                }
            });
        });
        console.log(result);
    },
    StoreStations: function (data) {
        data = $.parseJSON(data);
        data.sort(function (a,b) { return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0) });
        $.each(data, function (i,value) {
            /* important! use to restrict stations by bitrate or other param
                var bitrate_limit = 32;
                if (value.bitrate < bitrate_limit) {
                    console.log('Bitrate under ' + bitrate_limit + ': ' + value.name);
                };
            */
            var id = value.url.split('/')[1];
            if (typeof(ini.station.list[id]) == 'undefined') {
                ini.station.list[id] = [];
            };
            ini.station.list[id].push(value);
        });
        app.storage('set', {'stations':JSON.stringify(ini.station.list)});
    },
    DeviceReady: function () {
        if (app.storage('get','stations')) {
            app.OutputPage();
        } else {
            app.GetStations(function(done){
                if (done) {
                    app.OutputPage();
                } else {
                    app.ReloadPage();
                };
            });
        };
    },
    CompileHtml: function (element, data) {
        var html = Handlebars.compile($(element).html());
        return html( data !== undefined ? $.parseJSON(data) : null );
    },
    OutputPage: function (page, view) {

        /* router */

            var html = '';
                page = page || window.location.pathname;
                page = page.replace(/^\//, '');
                page == '' ? page = 'home' : null;

            if (page == 'home') {
                $('html').removeClass('is-textual');
                html += app.CompileHtml('#'+page);
                ini.station.list = $.parseJSON(app.storage('get','stations'));
                $.each(ini.countries, function (i,value) {
                    html += app.CompileHtml('#stations', JSON.stringify({country: value, data: ini.station.list[i] }));
                });
            } else if (page == 'legal') {
                $('html').addClass('is-textual');
                html += app.CompileHtml('#'+page);
            } else {
                html += app.CompileHtml('#notfound');
            };

            $(ini.container).html(html);

            if ($('.stations-title').length > 0) {
                $('.stations-title').eq(0).addClass('active');
            };

        /* !pushstate */

            if (!view) {

                /* elements' event listeners */
                    app.SetEventListeners();

                /* splash screen */
                    navigator.splashscreen ? navigator.splashscreen.hide() : null;

                app.PreparePage();
                app.AttachScrollbar('body');

            }

    },
    AttachScrollbar: function (element) {
        if (typeof $.fn.scroll == 'function'  && ini.os == 'Windows') {
            $(element).scrollbar({
                horizrailenabled: false,
                autohidemode: false,
                cursorcolor: '#DD0000',
                background: 'transparent',
                cursorwidth: '5px',
                cursorborder: '0 none',
                cursorborderradius: '0'
            });
        };
    },
    PreparePage: function () {
        $('html').addClass(cordova.platformId);
        $('html').addClass(cordova.platformId == 'browser' ? ini.os.toLowerCase() : 'application');
        $('body').addClass('ready scroll');
        if (window.opener && window.opener !== window) {
            $('html').addClass('popup');
        };
        if ($('html').hasClass('browser')) {
            $('.copyright').append(ini.message.player_link, ini.message.share_link, ini.message.legal_link);
        };
    },
    ReloadPage: function () {
        setTimeout(function () {
             window.location.reload();
        }, 30000);
    },
    AudioEventListener: function (e) {
        $(ini.audio.id).get(0).addEventListener(e, function () {
            console.log('Audio: ' + e);
            if (e == 'playing') {
                ini.station.current.removeClass('loading').addClass(e);//.find('.meta').html(ini.message.playing + ini.station.current.data('listeners'));
                $(ini.audio.id).removeClass('loading').addClass(e);
                $('.player').append(ini.station.current.clone());
                $('html').addClass('on-air');
            } else if (e == 'pause') {
                ini.station.current.removeClass('playing');//.find('.meta').html('');
                $(ini.audio.id).removeClass('playing');
            } else if (e == 'canplay') {
                //$(ini.audio.id).get(0).play();
            };
        }, true);
    },
    SetEventListeners: function () {
        for (var i = 0; i < ini.audio.events.length; i++) {
            app.AudioEventListener(ini.audio.events[i]);
        };
        $(window).on('popstate',function(event) {
            event.preventDefault();
            app.OutputPage(window.location.pathname, true);
            $('html, body').animate({ scrollTop: 0 }, 100);
        });
        $(document).on('click', '.copyright-toggle, .copyright.active .link:not([target="_blank"])', function(event) {
            event.preventDefault();
            $('.copyright').toggleClass('active');
        });
        $(document).on('click', '.view', function(event) {
            event.preventDefault();
            var page = $(this).data('url');
            history.pushState(null,null,page);
            app.OutputPage(page, true);
            $('html, body').animate({ scrollTop: 0 }, 100);
        });
        $(document).on('click', '.link.popup', function(event) {
            event.preventDefault();
            $('header, main, footer, #templates').remove();
            navigator.splashscreen ? navigator.splashscreen.show() : null;
            $('body').css('background','#DD0000');
            $('body').append('<div style="cursor:default;position:absolute;left:0;right:0;bottom:10px;margin:auto;width:180px;background:#FFF;color:#AA0000;height:22px;border-radius:11px;text-align:center;font-size:13px;">это&nbsp;окно&nbsp;можно&nbsp;закрыть</div>');
            window.open(window.location.origin, '_blank', ini.popup.settings);
        });
        $(document).on('click', ini.station.title, function (event) {
            event.preventDefault();
            $(ini.station.title).removeClass('active');
            $(this).addClass('active');
            window.dispatchEvent(new Event('resize'));
        });
        $(document).on('focusout', ini.station.search, function (event) {
            event.preventDefault();
            var e = $(this);
            setTimeout(function () {
                e.val('');
                $(ini.station.title+'.active').siblings(ini.station.container).find(ini.station.id).each(function () {
                    $(this).removeClass('hidden');
                });
            }, 500);
        });
        $(document).on('keyup', ini.station.search, function (event) {
            event.preventDefault();
            var s = $(this).val().toLowerCase();
            var e = $(ini.station.title+'.active').siblings(ini.station.container).find(ini.station.id);
            e.each(function () {
                var t = $(this).find('.name').text().toLowerCase();
                if (s != '' && t.indexOf(s) != 0) {
                    $(this).addClass('hidden');
                } else {
                    $(this).removeClass('hidden');
                }
            });
        });
        $(document).on('click', ini.station.id, function (event) {
            event.preventDefault();
            $('.player').html('');
            $('html').removeClass('on-air');
            if ($(this).hasClass('playing')) {
                $(ini.audio.id).get(0).pause();
            } else {
                ini.station.current = $(this);
                $(ini.station.id).removeClass('pause playing loading');//.find('.meta').html('');
                ini.station.current.addClass('loading');
                $(ini.audio.id).removeClass('playing').addClass('loading');
                $(ini.audio.id).attr('src', app.api() + ini.station.current.data('url'));
                $(ini.audio.id).get(0).load();
                $(ini.audio.id).get(0).play();
            }
        });
        $(window).resize(function () {
            console.log('Window: resize ('+$(window).width()+'x'+$(window).height()+')');
        });
        ini.station.hammer = {};
        $(ini.station.container).each(function(n,c) {
            ini.station.hammer['i_'+n] = new Hammer($(this).get(0));
            ini.station.hammer['i_'+n].on('panleft panright', function(event) {
                if (event.pointerType == 'touch' && event.eventType == 4) {
                    if (event.type == 'panleft') {
                        console.log(event);
                    } else if (event.type == 'panright') {
                        console.log(event);
                    };
                };
            });
        });
    }
};

app.initialize();