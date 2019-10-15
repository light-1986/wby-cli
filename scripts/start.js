
const fs = require('fs-extra');

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const configFactory = require('../config/webpack.config')
const paths = require('../config/paths');
const config = configFactory('development');
// Tools like Cloud9 rely on this.
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const clearConsole = require('react-dev-utils/clearConsole');
const createDevServerConfig = require('../config/webpackDevServer.config');

const serverConfig = createDevServerConfig();
module.exports = function(){
    // clearConsole();
    const compiler = webpack(config);
    compiler.hooks.beforeCompile.tap('beforeCompile', () => {
        console.log("beforeCompile")
    })
    compiler.hooks.done.tap('done', () => {
        console.log("compile done")
        clearConsole();
    })

    const devServer = new WebpackDevServer(compiler, serverConfig);
    devServer.listen(DEFAULT_PORT, HOST, err => {
        if(err){
            return console.log(err)
        }
        // setTimeout(() => {
        //     clearConsole();
        // }, 3000)
    })
}