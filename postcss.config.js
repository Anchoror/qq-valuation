module.exports = {
  plugins: {
    'postcss-px-to-viewport-8-plugin': {
      viewportWidth: 375,
      // exclude: /node_modules/i,
      propList: ['*', '!box-shadow']
    }
  }
}
