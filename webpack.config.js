

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
}