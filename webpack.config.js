const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    index: './src/main.ts',
    create: './src/create.ts',
    home: './src/home.ts',
    signup: './src/signup.ts'
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
        test: /\.css$/, // Matches .css files
        use: ['style-loader', 'css-loader'], // Process CSS files
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
    new HtmlWebpackPlugin({
      template: './src/home.html',
      filename: 'home.html',
      chunks: ['home'], // Specify the chunks for this HTML
    }),
    new HtmlWebpackPlugin({
      template: './src/signup.html',
      filename: 'signup.html',
      chunks: ['signup'], // Specify the chunks for this HTML
    }),
  ],
  devServer: {
    static: './dist',
    port: 3000,
    open: true,
  },
};
