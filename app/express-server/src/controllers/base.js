const express = require("express");

const router = express.Router();
const errcode = require("../utils/errcode");
const authMap = require("../permissions/auth");
const { parseToken } = require("../utils/auth");

/**
 * base controller
 * 权限验证
 */
router.use(async (req, res, next) => {
    const authority = authMap.get(req.path);

    if (authority) {
        // 需要检验token的接口
        const payload = await parseToken(req);
        if (payload) {
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
