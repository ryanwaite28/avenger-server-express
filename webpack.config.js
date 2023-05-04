const path = require('path');
const TerserPlugin = require("terser-webpack-plugin");



module.exports = {
  target: "node",
  entry: './src/main.app.ts',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /node_modules\/yaml\/browser\/dist\/.*/,
        type: 'javascript/auto',
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
            ],
          },
        },
      }
    ],
  },
  
  resolve: {
    extensions: ['.ts', '.js', '...'],
    modules: [
      path.resolve(__dirname, '.'),
      path.resolve(__dirname, 'node_modules'),
    ],
    fallback: {
      util: require.resolve("util/")
    }
  },
  output: {
    filename: 'app.bundle.js',
    path: path.resolve(__dirname, 'build'),
  },
  mode: 'production',
  optimization: {
    usedExports: true,
    minimize: true,
    minimizer: [new TerserPlugin()],
  }
};