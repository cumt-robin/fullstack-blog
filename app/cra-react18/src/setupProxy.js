const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
    app.use(
        "/api",
        createProxyMiddleware({
            target: "http://express-server:8002",
            changeOrigin: true,
            pathRewrite: {
                "^/api": "",
            },
        }),
    );
};
