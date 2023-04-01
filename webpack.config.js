module.exports = {
    entry: './src/index.js',
    output: {
      path: __dirname + '/dist',
      filename: 'bundle.js'
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: ['babel-loader']
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html'
      })
    ],
    resolve: {
      extensions: ['.js', '.jsx']
    },
    devServer: {
      contentBase: './dist',
      port: 3000
    },
    resolve: {
        fallback: {
            "zlib": require.resolve("browserify-zlib"),
            "stream": require.resolve("stream-browserify"),
            "buffer": require.resolve("buffer")
          },
          extensions: [ '.ts', '.js' ]
    }
  };