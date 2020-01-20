odoo.define('website_notifications.notify', function(require) {
    'use strict';

    var core = require('web.core');
    var website = require('website.website');
    var qweb = core.qweb;
    var ajax = require('web.ajax');

    ajax.loadXML('/web/static/src/xml/base_common.xml', qweb).then(function () {
        ajax.loadXML('/website_notifications/static/src/xml/templates.xml', qweb);
    });

    var _t = core._t;

    function is_object(options) {
        return options !== null && typeof options === 'object';
    }

    function init_modal($el, deferred) {
        $el.on('click', '.btn-primary', function () {
            if (deferred) {
                deferred.resolve();
            }
            $el.modal('hide').remove();
            $('.modal-backdrop').remove();
        });
        $el.on('hidden.bs.modal', function () {
            if (deferred) {
                deferred.reject();
            }
            $el.modal('hide').remove();
            $('.modal-backdrop').remove();
        });
        $el.appendTo("body");
        $el.modal('show');
    }

    function info(msg, options) {
        var overrides = is_object(options) ? options : {};
        var $info = $(qweb.render('website_notifications.dialog', {
            'window_title': overrides.title ? overrides.title : _t("Information"),
            'message': msg,
        }));
        init_modal($info);
    }

    function error(msg, options) {
        // Function which handles both odoo errors and custom javascript ones
        var overrides = is_object(options) ? options : {};

        var template_parameters = {};
        if (is_object(msg)) {
            template_parameters.window_title = _t("Error");
            var message;
            if (msg.data && msg.data.arguments[0]) {
                message = msg.data.arguments[0];
            } else if (msg.statusText) {
                message = msg.statusText;
            } else if (msg.message) {
                message = msg.message;
            } else {
                message = _t('Internal Server Error');
            }
            template_parameters.message = message;
        } else {
            template_parameters.window_title = overrides.title ? overrides.title : _t("Error");
            template_parameters.message = msg;
        }

        var $error = $(qweb.render('website_notifications.dialog', template_parameters));
        init_modal($error);
    }

    function dialog(msg, options) {
        var overrides = is_object(options) ? options : {};

        var dialog = $(qweb.render('website_notifications.dialog', {
            'window_title':  overrides.title ? overrides.title : _t("Prompt"), 
            'message': msg,
        }));
        var def = $.Deferred();
        init_modal(dialog, def);
        return def;
    }

    function warning(msg, options) {
        var overrides = is_object(options) ? options : {};
        var warning_options = _.extend({
            'window_title': "Warning",
        }, overrides);
        return prompt(msg, warning_options);
    }

    $.notifyDefaults({
        "placement": {
            "from": "top",
            "align": "center",
        },
        "newest_on_top": true,
        "delay": 3000,
        "timer": 500,
    });

    var promise = ajax.loadXML('/web/static/src/xml/base_common.xml', qweb).then(function () {
        return ajax.loadXML('/website_notifications/static/src/xml/templates.xml', qweb);
    });
    return promise.then(function() {
        return {
            info: info,
            error: error,
            dialog: dialog,
            warning: warning,
            alert_success: function(msg){return $.notify(msg, {"type": "success"});},
            alert_info: function(msg){return $.notify(msg, {"type": "info"});},
            alert_warning: function(msg){return $.notify(msg, {"type": "warning"});},
            // FIXME styling doesn't look right on this alert (transparent background)
            alert_error: function(msg){return $.notify(msg, {"type": "error"});},
        };
    });

});
