'use strict';

// const fs = require('fs');
const paths = require('../config/paths');

module.exports = function(/*webpackEnv*/){
    // const isEnvDevelopment = webpackEnv === 'development';
    // const isEnvProduction = webpackEnv === 'production';
    // const mode = isEnvProduction ? 'production' : isEnvDevelopment && 'development';
console.log("webpackconfig: ", paths.appIndexJs, paths.appBuild)
    return {
        mode: 'development',
        entry:[
            paths.appIndexJs
        ],
        output:{
            path: paths.appBuild,
            publicPath: 'http://www.baidu.com'
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
                            options:{
                                presets: ['@babel/preset-env']
                            }
                        }
                    ]
                }
            ]
        },
        devtool:'source-map'
    }
}
