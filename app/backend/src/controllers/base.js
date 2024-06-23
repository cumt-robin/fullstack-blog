const express = require("express");

const router = express.Router();
const jwt = require("jsonwebtoken");
const errcode = require("../utils/errcode");
const authMap = require("../permissions/auth");
const config = require("../config");

/**
 * base controller
 * 权限验证
 */
router.use((req, res, next) => {
    // CORS 处理，已交给 Nginx 处理
    // if (req.headers.origin) {
    //     if (config.allowClient.includes(req.headers.origin)) {
    //         res.header('Access-Control-Allow-Origin', req.headers.origin);
    //     }
    //     res.header('Access-Control-Allow-Methods', 'PUT,GET,POST,DELETE,OPTIONS');
    //     res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type,Range");
    //     res.header('Access-Control-Allow-Credentials', 'true');
    // }

    const authority = authMap.get(req.path);

    if (authority) {
        // 需要检验token的接口
        const token = req.headers.authorization ? req.headers.authorization.replace("Bearer ", "") : undefined;
        if (token) {
            jwt.verify(token, config.jwt.secret, (err, payload) => {
                if (err) {
                    console.error(err);
                    return res.send({
                        ...errcode.AUTH.UNAUTHORIZED,
                    });
                }
                // token是否和权限符合
                if (payload.roleName !== authority.role) {
                    return res.send({
                        ...errcode.AUTH.FORBIDDEN,
                    });
                }

                // 将user信息存在本次请求内存中
                req.currentUser = payload;

                // 执行权转交后续中间件
                next();
            });
        } else {
            return res.send({
                ...errcode.AUTH.UNAUTHORIZED,
            });
        }
    } else {
        // 执行权转交后续中间件
        next();
    }
});

module.exports = router;
