// eslint-disable-next-line
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const OfflinePlugin = require('offline-plugin');

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const production = process.env.NODE_ENV === 'production';
const BUILD_DIR = path.resolve(__dirname, 'dist');
const APP_DIR = path.resolve(__dirname, 'src');

module.exports = {
  entry: `${APP_DIR}/app.js`,
  output: {
    path: BUILD_DIR,
    filename: production ? '[name].[chunkhash].js' : '[name].[hash].js',
  },
  devtool: production ? 'sourcemap' : 'eval-source-map',
  // devtool: production ? false : 'sourcemap',
  devServer: {
    hot: false,
    inline: true,
    contentBase: BUILD_DIR,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
          },
        ],
      },
      {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        loader: 'url-loader',
        // options: {
        //   limit: 10000,
        // },
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        // options: {
        //   presets: [
        //     ['env', { modules: false }],
        //   ],
        // },
      },
    ],
  },
  node: {
    console: false,
    global: !production,
    process: !production,
    Buffer: !production,
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    // new webpack.optimize.UglifyJsPlugin({
    //   sourceMap: true,
    // }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'template.index.html',
    }),
    new HtmlWebpackPlugin({
      filename: 'baby.html',
      template: 'template.baby.html',
    }),
    new CopyWebpackPlugin([
      {
        from: './src/img',
        to: './img',
      },
      { from: './src/manifest.json' },
    ]),
    // it's always better if OfflinePlugin is the last plugin added
    new OfflinePlugin({
      ServiceWorker: {
        events: true,
      },
      // updateStrategy: 'all',
      // version: production ? '' : new Date().getTime(),
    }),
    // new BundleAnalyzerPlugin(),
  ],
};
