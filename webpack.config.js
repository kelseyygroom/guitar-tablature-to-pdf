const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    index: './src/main.ts',
    create: './src/create.ts', // Entry for create page
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      chunks: ['index'], // Specify the chunks for this HTML
    }),
    new HtmlWebpackPlugin({
      template: './src/create.html',
      filename: 'create.html',
      chunks: ['create'], // Specify the chunks for this HTML
    }),
  ],
  devServer: {
    static: './dist',
    port: 3000,
    open: true,
  },
};
