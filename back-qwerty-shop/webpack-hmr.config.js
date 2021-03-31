const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const StartServerPlugin = require("start-server-nestjs-webpack-plugin");
const { RunScriptWebpackPlugin } = require("run-script-webpack-plugin");
//const StartServerPlugin = require('start-server-webpack-plugin');

module.exports = function (options) {
    return {
        ...options,
        entry: ['webpack/hot/poll?100', options.entry],
        watch: true,
        externals: [
            nodeExternals({
                allowlist: ['webpack/hot/poll?100'],
            }),
        ],
        plugins: [
            ...options.plugins,
            new webpack.HotModuleReplacementPlugin(),
            // new webpack.WatchIgnorePlugin([/\.js$/, /\.d\.ts$/]),
            new RunScriptWebpackPlugin({
                name: 'main.js',
                nodeArgs: ['--inspect'], // allow debugging
                args: ['scriptArgument1', 'scriptArgument2'], // pass args to script
                signal: false | true | 'SIGUSR2', // signal to send for HMR (defaults to `false`, uses 'SIGUSR2' if `true`)
                keyboard: true | false, // Allow typing 'rs' to restart the server. default: only if NODE_ENV is 'development'
                cwd: './', // set a current working directory for the child process default: current cwd
            }),
        ],
    };
};