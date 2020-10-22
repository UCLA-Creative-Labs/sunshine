const path = require('path');
const dotenv = require('dotenv').config({ path: path.resolve(__dirname, './.env') });
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: {
    index: './src/index.tsx',
  },

  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
              '@babel/preset-typescript',
            ],
          },
        },
      },
      {
        test: /\.json$/i,
        exclude: /node_modules/,
        loader: 'json5-loader',
        type: 'javascript/auto'
      }
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.jsx', '.js' ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: './index.html',
    }),
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: 'src/assets',
          to: 'assets',
        }
      ]
    }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(dotenv.parsed)
    })
  ],
};
