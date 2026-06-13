import { merge } from 'webpack-merge';
import common from './webpack.common.js';
import { watchFile } from 'node:fs';

export default merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        static: './src',
        watchFile: ['./src/index.html']
    },
});