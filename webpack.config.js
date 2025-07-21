const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const dotenv = require('dotenv');
const webpack = require('webpack');

// Load environment variables from .env file
const env = dotenv.config().parsed || {};

// Format into DefinePlugin-compliant object:
const envKeys = Object.keys(env).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(env[next]);
  return prev;
}, {});
 
module.exports = {
  entry: {
    index: './src/main.ts',
    create: './src/create.ts',
    home: './src/home.ts',
    signup: './src/signup.ts',
    uploadVideo: './src/uploadVideo.ts',
    signin: './src/signin.ts',
    deleteUser: "./src/deleteUser.ts"
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i, // Match image files
        type: 'asset/resource', // Use Webpack's built-in asset/resource
      },
      {
        test: /\.ts$/, // Matches .ts files
        use: 'ts-loader', // Use ts-loader to process TypeScript files
        exclude: /node_modules/, // Exclude node_modules from processing
      },
      {
        test: /\.svg$/,
        type: 'asset/resource',
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader, // Extract CSS into separate files
          'css-loader',                // Handles @import and url() in CSS
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    modules: [path.resolve(__dirname, 'src'), 'node_modules']
  },
  plugins: [
    new webpack.DefinePlugin(envKeys),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      chunks: ['index'],
    }),
    new HtmlWebpackPlugin({
      template: './src/create.html',
      filename: 'create.html',
      chunks: ['create'],
    }),
    new HtmlWebpackPlugin({
      template: './src/home.html',
      filename: 'home.html',
      chunks: ['home'],
    }),
    new HtmlWebpackPlugin({
      template: './src/signup.html',
      filename: 'signup.html',
      chunks: ['signup'],
    }),
    new HtmlWebpackPlugin({
      template: './src/uploadVideo.html',
      filename: 'uploadVideo.html',
      chunks: ['uploadVideo'],
    }),
    new HtmlWebpackPlugin({
      template: './src/signin.html',
      filename: 'signin.html',
      chunks: ['signin'],
    }),
    new HtmlWebpackPlugin({
      template: './src/deleteUser.html',
      filename: 'deleteUser.html',
      chunks: ['deleteUser'],
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css', // Output CSS file names
    }),
  ],
  devServer: {
    static: './dist',
    port: 3000,
    open: true,
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true, // Removes console.log
            drop_debugger: true,
            passes: 6, // More passes for better compression
          },
          mangle: true, // Shortens variable names
          format: {
            comments: false, // Remove comments
          },
        },
        extractComments: false, // Prevents separate LICENSE files
      }),
      `...`, // Use the default minimizers (e.g., Terser for JS)
      new CssMinimizerPlugin(), // Minimize CSS
    ],
  },
};
