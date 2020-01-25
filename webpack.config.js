const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: './js/utils.js',
    output: {
        filename: 'utils.es5.js'
    },
    module: {
        rules: [{
            test: /\.m?js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                }
            }
        }],
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                // uglifyOptions: {
                //     warnings: false,
                //     parse: {},
                //     compress: {},
                //     mangle: true, // Note `mangle.properties` is `false` by default.
                //     output: null,
                //     toplevel: false,
                //     nameCache: null,
                //     ie8: false,
                //     keep_fnames: true,
                // },
            })
        ],
    },
}