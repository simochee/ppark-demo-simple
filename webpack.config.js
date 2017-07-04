const webpack = require('webpack');

module.exports = {
    entry: {
        'bundle': './sources/scripts/entry.js'
    },
    output: {
        path: `${__dirname}/public/javascripts`,
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                enforce: 'post',
                exclude: /node_modules/,
                use: ['buble-loader']
            }
        ]
    },
    resolve: {
        extensions: ['', '.js'],
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV) || 'development',
        })
    ],
    devtool: 'inline-sourcemap',
}