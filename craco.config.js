module.exports = {
  webpack: {
    configure: {
      module: {
        rules: [
          {
            test: /\.m?js$/,
            enforce: 'pre',
            use: ['source-map-loader'],
            exclude: [/@mediapipe/]
          }
        ]
      },
      ignoreWarnings: [/Failed to parse source map/]
    }
  }
};