$(function(){
$('body').append('<script>window.fbAsyncInit = function() { FB.init({ appId : "1202365276475059", xfbml : true, version : "v2.6" }) }; (function(d, s, id){ var js, fjs = d.getElementsByTagName(s)[0]; if (d.getElementById(id)) { return } js = d.createElement(s); js.id = id; js.src = "//connect.facebook.net/ru_RU/sdk.js"; fjs.parentNode.insertBefore(js, fjs) }(document, "script", "facebook-jssdk"));</script>');
$('body').append('\
<header>\
	<a class="banner-link view" data-url="/">\
		<img class="banner" src="http://eldoradio.fm/svg/alt.banner.svg" alt="Eldoradio.fm">\
	</a>\
	<div class="mobile-apps">\
		<a class="mobile-app ios" href="javascript:void(0)"></a>\
		<a class="mobile-app android" href="javascript:void(0)"></a>\
	</div>\
	<audio preload="none" type="audio/mpeg"></audio>\
	<ul class="player list-style-none"></ul>\
	<div class="volume"></div>\
</header>\
<main></main>\
<footer>\
	<a href="javascript:void(0)" class="copyright-toggle color-red bold">...</a>\
	<div class="copyright small"><span class="application-hidden color-red">&copy; </span><a class="link view" data-url="/legal">Информация<span class="application-hidden"> (подробнее)</span></a><span class="copyright-notice color-red"> - все материалы принадлежат их законным владельцам.</span></div>\
</footer>\
');
$('body').append('\
<div id="templates">\
	<script id="home" type="text/x-handlebars-template"></script>\
	<script id="stations" type="text/x-handlebars-template">\
		<div class="stations" data-iso="{{iso}}">\
			<div class="title"><span class="country">{{country}}</span><span class="counter">{{data.length}}</span><input type="text" class="search" name="search" value="" autocomplete="off" /><a href="javascript:void(0)" class="close"></a></div>\
			<ul class="list list-style-none">\
				{{#each data}}\
					<li class="station" data-index="{{@index}}" data-url="{{this.meta.source}}" data-fallback="{{this.url}}" data-bitrate="{{this.bitrate}}" data-listeners="{{this.listeners}}"><strong class="name">{{this.name}}</strong><br><small class="meta">{{this.meta.description}}</small><span class="save{{#in_array this.url ../saved}} active{{/in_array}}"></span></li>\
				{{/each}}\
			</ul>\
		</div>\
	</script>\
	<script id="not-station" type="text/x-handlebars-template">\
		<li class="station not-station"><a href="{{url}}" target="_blank" rel="nofollow"><strong class="name">{{name}}</strong><br><small class="meta">{{description}}</small></a></li>\
	</script>\
	<script id="legal" type="text/x-handlebars-template">\
		<div class="textual">\
			<p class="bold">1. Условия&nbsp;использования (пользовательское&nbsp;соглашение)</p>\
			<p class="small">1.1. Следующие условия использования (далее&nbsp;“условия”) применяются для пользования сайтом Eldoradio.fm (далее&nbsp;“сайт”) и заключается между всеми пользователями сайта и администрацией и владельцами сайта (далее&nbsp;“мы”).</p>\
			<p class="small">1.2. Если вы решите использовать сайт, мобильные приложение или какие-либо другие функции, включая, но, не ограничиваясь, RSS, API, программное обеспечение и другие сервисы (собирательно “наши сервисы”), вы подтверждаете свое согласие и обязуетесь соблюдать настоящие условия использования.</p>\
			<p class="small">1.3. Мы можем в любое время изменить, дополнить или удалить части настоящих условий использования. При этом все изменения вступают в силу сразу же после публикации. Вы можете пересматривать условия использования перед каждым взаимодействием с нашими сервисами.</p>\
			<p class="small">1.4. Если вы не принимаете все настоящие условия, то вы не должны использовать наши сервисы.</p>\
			<p class="bold">2. Правовая информация</p>\
			<p class="small">2.1. Если вы хотите связаться с нашей службой поддержки, отправьте электронное письмо на fm.eldoradio@gmail.com</p>\
			<p class="small">2.2. Сайт может содержать информацию, не предназначенную для лиц моложе 16 лет.</p>\
			<p class="bold">3. Авторские права на контент</p>\
			<p class="small">3.1. Весь контент и ссылки размещены на сайте в ознакомительных целях, предназначены только для удовлетворения любознательности посетителей и взяты исключительно из открытых источников. Мы не несем ответственности за доступность или достоверность этих источников или ресурсов, а также контент, продукцию или услуги, предлагаемые или содержащиеся на таких источниках или ресурсах.</p>\
			<p class="small">3.2. Все права на графические, текстовые, аудио и музыкальные материалы, представленные на сайте, принадлежат их законным владельцам. Адрес сайта, находящийся на графических материалах не обозначает нашего авторского права на данные материалы. </p>\
			<p class="small">3.3. Мы не проводим ретрансляцию - на сайте указаны ссылки на аудио потоки оригинальных сайтов.</p>\
			<p class="bold">4. Реклама на сайте</p>\
			<p class="small">4.1. Упоминание продукта или услуги коммерческого или некоммерческого характера на сайте или наших сервисах не является одобрением или рекомендацией данных продуктов или услуг и носит исключительно информативный характер.</p>\
		</div>\
	</script>\
	<script id="notfound" type="text/x-handlebars-template">\
		<div class="textual">\
			<p class="color-red">Ошибка 404 - страница не найдена</p>\
		</div>\
	</script>\
</div>\
');

var ini = {
    protocol: 'http://',
    host: 'eldoradio.fm',
    container: 'main',
    audio: {
        id: 'audio',
        player: '.player',
        volume: $('.volume').get(0),
        events: ['waiting','abort','loadstart','ended','error','stalled','suspend','playing','pause','canplay']
    },
    station: {
        /* list: {}, set during runtime */
        id: '.station',
        parent: '.stations',
        container: '.list',
        bitrates: [],
        title: '.title',
        search: '.search',
        current: null,
        source: '/inject/stations.json?v=' + Date.now()
    },
    page: {
        home: 'home',
        legal: 'legal',
        precompiled: {}
    },
    countries: {
        ru: '\u0420\u043e\u0441\u0441\u0438\u044f',
        ua: '\u0423\u043a\u0440\u0430\u0438\u043d\u0430',
        kz: '\u041a\u0430\u0437\u0430\u0445\u0441\u0442\u0430\u043d'
    },
    socket: 1,
    message: {
        player_link: '<a class="link popup popup-player-link application-hidden">\u041e\u0442\u043a\u0440\u044b\u0442\u044c&nbsp;\u043f\u043b\u0435\u0435\u0440</a>',
        share_link: '<a class="link facebook-share-link fb-xfbml-parse-ignore" target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Feldoradio.fm%2F&amp;src=sdkpreparse">\u041f\u043e\u0434\u0435\u043b\u0438\u0442\u044c\u0441\u044f</a>',
        close_link: '<div style="cursor:default;position:absolute;left:0;right:0;bottom:10px;margin:auto;width:165px;background:#FFF;color:#AA0000;height:22px;border-radius:3px;text-align:center;font-size:13px;">\u044d\u0442\u043e&nbsp;\u043e\u043a\u043d\u043e&nbsp;\u043c\u043e\u0436\u043d\u043e&nbsp;\u0437\u0430\u043a\u0440\u044b\u0442\u044c</div>'
    },
    popup: {
        settings: 'top=10,left=10,width=360,height=300,location=0,menubar=0,status=0,titlebar=0,toolbar=0'
    },
    os: 'Unknown',
    biletru: {
        api: '/inject/promotions.json?count=', //biletru.net/json/event?keys=id,MetaTitle,Url&count=',
        adds: false,
        description: '\u041a\u0443\u043f\u0438\u0442\u044c \u0431\u0438\u043b\u0435\u0442\u044b \u043d\u0430 biletru.net'
    }
};

/* Dependency check-list */

    !(function(dependency){
        for (var i = 0; i < dependency.length; i++) {
            if (typeof window[dependency[i]] == 'undefined') {
                throw new Error(dependency[i] + ' - dependency not availabled. Aborting.');
            }
        };
    })(['cordova','jQuery','$','Handlebars','navigator']);

/* OS Detection */

    // "Windows"    for all versions of Windows
    // "MacOS"      for all versions of Macintosh OS
    // "Linux"      for all versions of Linux
    // "UNIX"       for all other UNIX flavors 
    // "Unknown"    indicates failure to detect the OS

    if (navigator.appVersion.indexOf('Win')!=-1) ini.os = 'Windows';
    if (navigator.appVersion.indexOf('Mac')!=-1) ini.os = 'MacOS';
    if (navigator.appVersion.indexOf('Linux')!=-1) ini.os = 'Linux';
    if (navigator.appVersion.indexOf('Android')!=-1) ini.os = 'Android';
    if (navigator.appVersion.indexOf('X11')!=-1) ini.os = 'UNIX';
    if (cordova.platformId!='browser') history.replaceState(null,null,'/');

/* Handlebars in_array helper */

    Handlebars.registerHelper('in_array', function(element, list, options) {
        if (element !== null && list !== null) {
            if (list.indexOf(element) > -1) {
                return options.fn(this);
            }
        }
        return options.inverse(this);
    });

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
    ajax: function (url, callback) {
        alert('ajax' + url);
        if (window.XDomainRequest) {
            try {
                var xdr = new XDomainRequest();
                xdr.open("get", url);
                xdr.onload = function() {
                    callback(typeof xdr.responseText == 'string' ? xdr.responseText : JSON.stringify(xdr.responseText));
                };
                xdr.onprogress = function(){};
                xdr.ontimeout = function(){};
                xdr.onerror = function(){
                    console.log('AJAX: fail for \'' + url + '\'');
                    callback(false);
                };
                setTimeout(function(){
                    xdr.send();
                }, 0);
            } catch (e){
                console.log(e);
            }
        } else {
           $.ajax(url)
            .fail(function (data) {
                console.log('AJAX: fail for \'' + url + '\'');
                callback(false);
            })
            .done(function (data) {
                callback(typeof data == 'string' ? data : JSON.stringify(data));
            });
        };
    },
    storage: function (action, data, persistent) {
        alert('storage');
        var storage = (persistent !== undefined) ? window.localStorage : window.sessionStorage;
        if (action == 'get') {
            return storage.getItem(data);
        } else if (action == 'set') {
            var key = Object.keys(data);
            return storage.setItem(key, data[key]);
        } else if (action == 'add') {
            var current = storage.getItem(data.key);
            if (current !== null) {
                current = $.parseJSON(current);
                current.push(data.val);
                return storage.setItem(data.key, JSON.stringify(current));
            } else {
                current = [];
                current.push(data.val);
                return storage.setItem(data.key, JSON.stringify(current));
            }
        } else if (action == 'del') {
            var current = storage.getItem(data.key);
            if (current !== null) {
                current = $.parseJSON(current);
                current = $.grep(current, function(value) {
                  return value != data.val;
                });
                return storage.setItem(data.key, JSON.stringify(current));
            } else {
                return false;
            }
        }
    },
    initialize: function () {
        alert('initialize');
        try {
            document.addEventListener('deviceready', app.DeviceReady, false);
        } catch (e) {
            console.log(e);
        }
    },
    resize: function () {
        alert('resize');
        if (document.createEvent) {
            var ev = document.createEvent('Event');
            ev.initEvent('resize', true, true);
            window.dispatchEvent(ev);
        } else {
            element=document.documentElement;
            var event=document.createEventObject();
            element.fireEvent("onresize",event);
        }
    },
    GetStations: function (callback) {
        alert('GetStations');
        app.ajax(app.host(ini.station.source)/*app.api('/json')*/, function(data){
            if (data === false) {
                app.ReloadPage();
            } else {
                app.StoreStations(data);
                callback(true);
            };
        });
    },
    GetStationsBy: function (parameter, unique) {
        alert('GetStationsBy');
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
        alert('StoreStations');
        data = $.parseJSON(data);
        data.sort(function (a,b) {
            var x = (''+a.name).toLowerCase(), y = (''+b.name).toLowerCase();
            return (x > y) ? 1 : ((y > x) ? -1 : 0)
        });
        $.each(data, function (i,value) {
            /* important! use to restrict stations by bitrate or other param
                var bitrate_limit = 32;
                if (value.bitrate < bitrate_limit) {
                    console.log('Bitrate under ' + bitrate_limit + ': ' + value.name);
                };
            */
            var id = value.url.split('/')[1];
            if (typeof ini.station.list[id] == 'undefined') {
                ini.station.list[id] = [];
            };
            ini.station.list[id].push(value);
        });
        app.storage('set', {'stations':JSON.stringify(ini.station.list)});
    },
    PrepareStations: function () {
        alert('PrepareStations');
        ini.station.list = $.parseJSON(app.storage('get','stations')) || {};
        ini.station.saved = $.parseJSON(app.storage('get','saved',true));
        return (!$.isEmptyObject(ini.station.list));
    },
    OrderStations: function (argument) {
        alert('OrderStations');
        /* set order to station list */
            if ($('.title').length > 0) {
                $('.title').eq(0).addClass('active');
            };
        /* move saved stations to top */
            if ($(ini.station.id + ' .save.active').length > 0) {
                $.each($(ini.station.id + ' .save.active'), function(i, e) {
                    var p = $(e).parent(ini.station.id), c = p.parent(ini.station.list);
                    p.prependTo(c);
                });
            }
    },
    Adds: function (page) {
        alert('Adds');
        if (page == ini.page.home) {
            var temp = [], count = 0;
            $.each(ini.station.list, function(i, value) {
                temp.push(value.length);
            });
            $.each(temp, function(i, value) {
                 count += Math.max.apply(Math,temp) - value;
            });
            function AddAdds(data) {
                if (data !== false) {
                    $.each($(ini.station.container), function(n, parent) {
                        var x = Math.max.apply(Math,temp) - $(this).find(ini.station.id).length;
                        if (x > 0) {
                            var html = '';
                            for (var z = 0; z < x; z++) {
                                if (data.length != 0) {
                                    var e = data.shift();
                                    html += app.CompileHtml('#not-station', JSON.stringify({
                                                                        url: e['Url'],
                                                                        name: e['MetaTitle'],
                                                                        description: ini.biletru.description
                                                                    })
                                                    );
                                }
                            };
                            $(this).append(html);
                        }
                    });
                    app.resize();
                }
            }
            if (count > 0) {
                if (!ini.biletru.adds) {
                    app.ajax(app.host(ini.biletru.api + count), function(data) {
                        data = $.parseJSON(data);
                        ini.biletru.adds = $.extend(true, [], data);
                        AddAdds(data);
                    });
                } else {
                    var data = $.extend(true, [], ini.biletru.adds);
                    AddAdds(data);
                }
            }
        }
    },
    CompileHtml: function (element, data) {
        alert('CompileHtml');
        var html = Handlebars.compile($(element).html());
        return html( data !== undefined ? $.parseJSON(data) : null );
    },
    OutputPage: function (page, view) {
        alert('OutputPage');
        /* router */
            var html = '';
                page = page || location.pathname;
                page = page.replace(/^\//, '');
                page == '' ? page = ini.page.home : null;
            if (typeof ini.page.precompiled[page] == 'undefined' || ini.page.precompiled[page] == '') {
                if (page == ini.page.home) {
                    html += app.CompileHtml('#'+page);
                    $.each(ini.countries, function (i,value) {
                        html += app.CompileHtml('#stations', JSON.stringify({
                                                                    iso: i,
                                                                    country: value,
                                                                    data: ini.station.list[i],
                                                                    saved: ini.station.saved
                                                                })
                                                );
                    });
                } else if (page == ini.page.legal) {
                    html += app.CompileHtml('#'+page);
                } else {
                    html += app.CompileHtml('#notfound');
                };
                ini.page.precompiled[page] = html;
            } else {
                html += ini.page.precompiled[page];
            }
            if (page == ini.page.home) {
                $('html').removeClass('is-textual');
            } else {
                $('html').addClass('is-textual');
            }
            $(ini.container).html(html);

            app.OrderStations();
            app.resize();
            app.Adds(page);
            
        /* if not pushstate event */
            if (!view) {
                app.PreparePage();
                app.SetEventListeners();
                //app.AttachScrollbar('body');
            }
    },
    AttachScrollbar: function (element) {
        alert('AttachScrollbar');
        if (typeof $.fn.scroll == 'function' && ini.os == 'Windows') {
            $(element).scrollbar({
                horizrailenabled: false,
                autohidemode: false,
                cursorcolor: '#DD0000',
                background: 'transparent',
                cursorwidth: '5px',
                cursorborder: '0 none',
                cursorborderradius: '0'
            });
        }
    },
    PreparePage: function () {
        alert('PreparePage');
        $('html').addClass(cordova.platformId);
        $('html').addClass(cordova.platformId == 'browser' ? ini.os.toLowerCase() : 'application');
        $('.copyright').append(ini.message.share_link, ini.message.player_link);
        if (window.opener && window.opener !== window && $(window.opener.document).find('html').hasClass('to-popup')) {
            $('html').addClass('popup');
        }
        noUiSlider.create(ini.audio.volume, {
            start: [ 0.95 ],
            step:  0.05,
            range: { 'min': [ 0 ], 'max': [ 1 ] }
        });
        /* end show */
            $('body').addClass('ready'); // scroll
            navigator.splashscreen ? navigator.splashscreen.hide() : null;
            app.SendStats();
    },
    ReloadPage: function () {
        alert('ReloadPage');
        setTimeout(function () {
             location.reload();
        }, 30000);
    },
    AudioEventListener: function (e) {
        alert('AudioEventListener');
        $(ini.audio.id).get(0).addEventListener(e, function () {
            console.log('Audio: ' + e);
            if (e == 'playing') {
                ini.station.current.removeClass('loading').addClass(e);
                $(ini.audio.id).removeClass('loading').addClass(e);
                $(ini.audio.player).html(ini.station.current.clone());
                $('html').addClass('on-air');
            } else if (e == 'pause') {
                ini.station.current.removeClass('playing');
                $(ini.audio.id).removeClass('playing');
            } else if (e == 'canplay') {
                //$(ini.audio.id).get(0).play();
            } else if (e == 'error') {
                $(ini.audio.id).attr('src', app.api() + ini.station.current.data('fallback'));
                try {
                    $(ini.audio.id).get(0).load();
                    $(ini.audio.id).get(0).play();
                } catch (error) {
                    console.log(error);
                }
            }
        }, true);
    },
    SetEventListeners: function () {
        alert('SetEventListeners');
        for (var i = 0; i < ini.audio.events.length; i++) {
            app.AudioEventListener(ini.audio.events[i]);
        };
        $(window).on('popstate',function(event) {
            event.preventDefault();
            app.OutputPage(location.pathname, true);
            $('html, body').animate({ scrollTop: 0 }, 100);
        });
        $(document).on('click', '.copyright-toggle, .copyright.active .link:not([target="_blank"])', function(event) {
            event.preventDefault();
            $('.copyright').toggleClass('active');
        });
        $(document).on('click', '.view', function(event) {
            event.preventDefault();
            var page = $(this).data('url');
            if (typeof history.pushState != 'undefined') {
                history.pushState(null,null,page);
            };
            app.OutputPage(page, true);
            $('html, body').animate({ scrollTop: 0 }, 100);
        });
        $(document).on('click', '.link.popup', function(event) {
            event.preventDefault();
            $('header, main, footer, #templates').remove();
            $('html').addClass('to-popup');
            navigator.splashscreen ? navigator.splashscreen.show() : null;
            $('body').css('background','#DD0000');
            $('body').append(ini.message.close_link);
            window.open(location.origin, '_blank', ini.popup.settings);
        });
        $(document).on('click', ini.station.title, function (event) {
            event.preventDefault();
            $(ini.station.title).removeClass('active');
            $(this).addClass('active');
            app.resize();
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
        ini.audio.volume.noUiSlider.on('update', function(){
            $(ini.audio.id).get(0).volume = ini.audio.volume.noUiSlider.get();
            console.log('Audio: volume ' + $(ini.audio.id).get(0).volume);
        });
        $(document).on('click', ini.station.id, function (event) {
            if ($(this).hasClass('not-station')) {
                console.log($(this).data('url'));
            } else {
                event.preventDefault();
                if ($(event.target).hasClass('save')) {
                    var e = $(event.target);
                    if (e.hasClass('active')) {
                        app.storage('del', { key: 'saved', val: $(this).data('fallback') }, true);
                        e.removeClass('active');
                        var p = $(e).parent(ini.station.id),
                            i = parseInt(p.data('index')) - 1; i = (i > 0) ? i : 0;
                            s = p.siblings(ini.station.id);
                            $.each(s, function(n, o) {
                                 if ($(o).data('index') == i) {
                                    p.insertAfter(o);
                                 };
                            });
                    } else {
                        app.storage('add', { key: 'saved', val: $(this).data('fallback') }, true);
                        e.addClass('active');
                        var p = $(e).parent(ini.station.id), c = p.parent(ini.station.list); p.prependTo(c);
                        $('html, body').animate({ scrollTop: 0 }, 100);
                    }
                } else {
                    $(ini.audio.player).html('');
                    $('html').removeClass('on-air');
                    if ($(this).hasClass('playing')) {
                        $(ini.audio.id).get(0).pause();
                    } else {
                        ini.station.current = $(this);
                        $(ini.station.id).removeClass('pause playing loading'); /*.find('.meta').html(''); */
                        ini.station.current.addClass('loading');
                        $(ini.audio.id).removeClass('playing').addClass('loading');
                        $(ini.audio.id).attr('src', /*app.api() + */ini.station.current.data('url'));
                        try {
                            $(ini.audio.id).get(0).load();
                            $(ini.audio.id).get(0).play();
                        } catch (error) {
                            console.log(error);
                        }
                    }
                }
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
                    }
                }
            });
        });
    },
    SendStats: function () {
        alert('SendStats');
        if (device.uuid !== null) {
            console.log(device.platform + ' ' + device.version);
            console.log(device.manufacturer + ' ' + device.model);
        }
    },
    DeviceReady: function () {
        alert('DeviceReady');
        if (app.PrepareStations()) {
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
};

app.initialize();

});