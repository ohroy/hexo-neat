/* global hexo */
var assign = require('object-assign');

//module.exports = function (hexo) {
    if (true === hexo.config.neat_enable) {
        // HTML minifier
        hexo.config.neat_html = assign({
            enable: true,
            logger: true,
            exclude: [],
            ignoreCustomComments: [/^\s*more/],
            removeComments: true,
            removeCommentsFromCDATA: true,
            collapseWhitespace: true,
            collapseBooleanAttributes: true,
            removeEmptyAttributes: true,
            minifyJS: true,
            minifyCSS: true,
        }, hexo.config.neat_html);

        // Css minifier
        hexo.config.neat_css = assign({
            enable: true,
            logger: true,
            exclude: ['*.min.css']
        }, hexo.config.neat_css);

        // Js minifier
        hexo.config.neat_js = assign({
            enable: true,
            mangle: true,
            logger: true,
            output: {},
            compress: {},
            exclude: ['*.min.js']
        }, hexo.config.neat_js, {
                fromString: true
            });


        var filter = require('./lib/filter');
        hexo.extend.filter.register('after_render:html', filter.logic_html);
        hexo.extend.filter.register('after_render:css', filter.logic_css);
        hexo.extend.filter.register('after_render:js', filter.logic_js);
    }
//}
