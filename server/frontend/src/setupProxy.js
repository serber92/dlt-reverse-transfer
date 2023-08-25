const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function(app) {
  app.use(
    '/graphql',
    createProxyMiddleware({
      target: 'http://54.153.29.181:9824',
      changeOrigin: true,
    })
  );
};