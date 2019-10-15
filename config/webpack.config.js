'use strict';

// const fs = require('fs');
const paths = require('../config/paths');
const path = require("path")
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const { CleanWebpackPlugin } = require('clean-webpack-plugin');



module.exports = function(/*webpackEnv*/){
    // const isEnvDevelopment = webpackEnv === 'development';
    // const isEnvProduction = webpackEnv === 'production';
    // const mode = isEnvProduction ? 'production' : isEnvDevelopment && 'development';
    // console.log("appIndexJs, appBuild : ", paths.appIndexJs, paths.appBuild)
    // const polyfillPath = path.resolve(__dirname, "../node_modules/@babel/polyfill");
    return {
        mode: 'development',
        entry:[
            // polyfillPath,
            paths.appIndexJs
        ],
        output:{
            path: paths.appBuild,
            publicPath: '/'
        },
        module: {
            rules : [
                { parser: { requireEnsure: false } },
                // {
                //     test: /\.(js|mjs|jsx|ts|tsx)$/,
                // },
                {
                    oneOf : [
                        {
                            test: /\.(js|mjs|jsx)$/,
                            loader: require.resolve('babel-loader'),
                            include: paths.appSrc,
                            options:{
                                // presets: ['@babel/preset-env', {"useBuiltIns":"entry"}]
                                presets: [
                                    [
                                        require.resolve("@babel/preset-env"),
                                        {
                                            "useBuiltIns": "usage",
                                            "corejs":{"version":'2'},
                                            // "targets" : {
                                            //     "chrome": 58,
                                            //     "ie": 11
                                            // }
                                        }
                                    ],
                                    [require.resolve("@babel/preset-react")]
                                ],
                                "plugins": [require.resolve("@babel/plugin-proposal-class-properties")]
                                // presets: [["@babel/preset-env"]]
                                
                            }
                        }
                    ]
                }
            ]
        },
        devtool:'source-map',
        plugins: [
            // new CleanWebpackPlugin(['dist/*']) for < v2 versions of CleanWebpackPlugin
            // new CleanWebpackPlugin(),
            new HtmlWebpackPlugin({
              title: 'Development',
              template: paths.appHtml,
            }),
        ],
    }
}
