var app = {
    container: '#app',
    sockets: 5,
    api: 'https://socket1.eldoradio.fm/json',
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
    DeviceReady: function () {
        if (app.storage('get','stations')) {
            app.OutputPage('home');
        } else {
            $.getJSON(app.api).done(function(data) {
                if (data) {
                    app.storage('set', {'stations':JSON.stringify(data)});
                    app.OutputPage('home');
                } else {
                    app.ReloadPage();
                }
            })
        }
    },
    CompileHtml: function (element,data) {
        var html = Handlebars.compile($(element).html());
        return html( data !== undefined ? $.parseJSON(data) : null );
    },
    OutputPage: function (page) {
        var html = '';
        if (page == 'home') {
            html += app.CompileHtml('#'+page);
            html += app.CompileHtml('#stations', app.storage('get','stations'));
        } else if (page == 'contacts') {
            html += app.CompileHtml('#'+page);
        };
        $(app.container).html(html);
        setTimeout(function () {
            navigator.splashscreen.hide();
        }, 1000);
    },
    ReloadPage: function () {
        setTimeout(function () {
             window.location.reload();
        }, 30000);
    }
};
app.initialize();