const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();
const { body } = require("express-validator");
const indexSQL = require("../sql");
const emailHandler = require("../utils/email");
const config = require("../config");
const errcode = require("../utils/errcode");
const dbUtils = require("../utils/db");
const { validateInterceptor } = require("../utils/validate");

/**
 * @description 登录
 */
router.put(
    "/login",
    [body("captcha").isString(), body("userName").isString(), body("password").isString(), validateInterceptor],
    (req, res, next) => {
        const params = req.body;
        if (!req.session.captcha) {
            res.send({
                code: "001001",
                data: null,
                msg: "验证码有误，换一张试试呢",
            });
        } else if (params.captcha.toLowerCase() !== req.session.captcha.toLowerCase()) {
            res.send({
                code: "001002",
                data: null,
                msg: "验证码输入有误",
            });
        } else {
            dbUtils.getConnection(res).then((connection) => {
                dbUtils
                    .query({ sql: indexSQL.QueryByUserNameAndPwd, values: [params.userName, params.password] }, connection, false)
                    .then(({ results }) => {
                        if (results.length > 0) {
                            const user = results[0];
                            const signResult = jwt.sign(
                                {
                                    id: user.id,
                                    userName: user.user_name,
                                    roleId: user.role_id,
                                    roleName: user.role_name,
                                },
                                config.jwt.secret,
                                {
                                    expiresIn: `${config.jwt.expireDays}d`,
                                }
                            );
                            // 更新登录时间
                            dbUtils.query(
                                {
                                    sql: indexSQL.UpdateUserById,
                                    values: [{ last_login_time: new Date() }, user.id],
                                },
                                connection,
                                false
                            );
                            res.send({
                                code: "0",
                                data: {
                                    ...results[0],
                                    token: signResult,
                                },
                            });
                        } else {
                            res.send({
                                code: "001003",
                                data: null,
                                msg: "用户名或密码输入有误",
                            });
                        }
                    })
                    .finally(() => {
                        connection.release();
                    });
            });
        }
    }
);

/**
 * @description 退出登录
 */
router.put("/logout", (req, res, next) => {
    res.send({
        code: "0",
    });
});

/**
 * @description 获取当前用户
 */
router.get("/current", (req, res, next) => {
    // base拦截器会做校验，这里不需要再校验
    res.send({
        code: "0",
        data: req.currentUser,
    });
});

/**
 * @description 忘记密码，暂未实现后续重置密码操作
 */
router.get("/forgetpwd", (req, res, next) => {
    const mailOptions = {
        from: `"来自${config.blogName}" <${config.email.auth.user}>`,
        to: config.authorEmail,
        subject: `${config.blogName}《通知邮件》`, // 主题
        text: "找回密码", // 发送text内容
        // html: '<b>Hello world?</b>' // 发送html内容
    };
    emailHandler.sendEmail(mailOptions).then(
        (info) => {
            console.log("邮件发送成功", info);
        },
        (error) => {
            console.log("邮件发送失败", error);
        }
    );
});

module.exports = router;
