/* global hexo */
'use strict';
var CleanCSS = require('clean-css'),
    UglifyJS = require('uglify-js'),
    Htmlminifier = require('html-minifier').minify,
    streamToArray = require('stream-to-array');
var Promise = require('bluebird');
var minimatch = require('minimatch');

function logic_html(str, data) {
    var hexo = this,
        options = hexo.config.neat_html || {};
    // Return if disabled.
    if (false === options.enable) return;

    var path = data.path;
    var exclude = options.exclude;
    if (exclude && !Array.isArray(exclude)) exclude = [exclude];

    if (path && exclude && exclude.length) {
        for (var i = 0, len = exclude.length; i < len; i++) {
            if (minimatch(path, exclude[i], { matchBase: true })) return str;
        }
    }
    options.continueOnParseError = true;
    var result = Htmlminifier(str, options);
    var saved = (((str.length - result.length) / str.length) * 100).toFixed(2);
    if (options.logger) {
        var log = hexo.log || console.log;
        log.log('neat the html: %s [ %s saved]', path, saved + '%');
    }
    return result;
}

function logic_css(str, data) {
    var hexo = this,
        options = hexo.config.neat_css;
    // Return if disabled.
    if (false === options.enable) return;

    var path = data.path;
    var exclude = options.exclude;
    if (exclude && !Array.isArray(exclude)) exclude = [exclude];

    if (path && exclude && exclude.length) {
        for (var i = 0, len = exclude.length; i < len; i++) {
            if (minimatch(path, exclude[i], { matchBase: true })) return str;
        }
    }

    return new Promise(function (resolve, reject) {
        new CleanCSS(options).minify(str, function (err, result) {
            if (err) return reject(err);
            var saved = (((str.length - result.styles.length) / str.length) * 100).toFixed(2);
            var prefix = '/* build time:' + Date().toLocaleString() + '*/\n';
            var end = '\n/* rebuild by neat */';
            var css_result = prefix + result.styles + end;
            resolve(css_result);
            if (options.logger) {
                var log = hexo.log || console.log;
                log.log('neat the css: %s [ %s saved]', path, saved + '%');
            }
        });
    });
}

function logic_js(str, data) {
    let js_result = str;
    var hexo = this,
        options = hexo.config.neat_js;
    // Return if disabled.
    if (false === options.enable) return;

    var path = data.path;
    var exclude = options.exclude;
    if (exclude && !Array.isArray(exclude)) exclude = [exclude];

    if (path && exclude && exclude.length) {
        for (var i = 0, len = exclude.length; i < len; i++) {
            if (minimatch(path, exclude[i], { matchBase: true })) return str;
        }
    }

    var result = UglifyJS.minify(str, options);
    if (!result.error) {
        var saved = (((str.length - result.code.length) / str.length) * 100).toFixed(2);
        if (options.logger) {
            var log = hexo.log || console.log;
            log.log('neat the js: %s [ %s saved]', path, saved + '%');
        }
        var prefix = '// build time:' + Date().toLocaleString() + '\n';
        var end = '\n//rebuild by neat ';
        js_result = prefix + result.code + end;
    }
    return js_result;
}

module.exports = {
    logic_html: logic_html,
    logic_css: logic_css,
    logic_js: logic_js,
};
