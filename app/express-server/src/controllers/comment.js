const express = require("express");
const xss = require("xss");

const router = express.Router();
const { query, matchedData, body } = require("express-validator");
const indexSQL = require("../sql");
const config = require("../config");
const utilsHelper = require("../utils/utils");
const emailHandler = require("../utils/email");
const dbUtils = require("../utils/db");
const { validateInterceptor } = require("../utils/validate");

/**
 * @param {Number} id 文章id，如果传入id，则代表查询文章下的评论；否则代表查询留言
 * @param {Number} pageNo 页码
 * @param {Number} pageSize 每页数量
 * @description 分页查询评论或留言
 */
router.get(
    "/page",
    [
        query("id").optional().isNumeric().toInt(),
        query("pageNo").optional().isNumeric().toInt().default(1),
        query("pageSize").optional().isNumeric().toInt().default(10),
        validateInterceptor,
    ],
    (req, res, next) => {
        const { pageNo, pageSize, id } = matchedData(req);
        dbUtils.getConnection(res).then((connection) => {
            const sql = id ? indexSQL.GetCommentsByArticleID : indexSQL.GetMessagesApproved;
            const sqlParams = id ? [id, (pageNo - 1) * pageSize, pageSize, id] : [(pageNo - 1) * pageSize, pageSize];

            dbUtils
                .query({ sql, values: sqlParams }, connection, false)
                .then(({ results }) => {
                    if (results) {
                        const allTaskList = results[0].map((item, index) => ({
                            task: () =>
                                dbUtils
                                    .query({ sql: indexSQL.QueryReplyByCommentID, values: [item.id, item.id] }, connection, false)
                                    .then(({ results: results2 }) => {
                                        results[0][index].replies = results2;
                                    }),
                        }));
                        return utilsHelper.handlePromiseList(allTaskList).then(
                            (resp) => {
                                res.send({
                                    code: "0",
                                    data: results[0],
                                    total: results[1][0].total,
                                });
                            },
                            (err) => {
                                res.send({
                                    code: "012001",
                                    data: [],
                                });
                            },
                        );
                    }
                    res.send({
                        code: "012001",
                        data: [],
                    });
                })
                .finally(() => {
                    connection.release();
                });
        });
    },
);

/**
 * @description 插入留言或评论
 */
router.post(
    "/add",
    [
        body("article_id").optional().isInt(),
        body("content").notEmpty(),
        body("jump_url").optional().isString(),
        body("email").optional().isString(),
        body("nick_name").notEmpty(),
        body("site_url").optional().isString(),
        validateInterceptor,
    ],
    (req, res, next) => {
        const params = matchedData(req);
        params.content = xss(params.content);
        // 默认是未审核状态
        params.approved = 0;
        const isComment = !!params.article_id;
        const wd = isComment ? "评论" : "留言";
        dbUtils.query({ sql: indexSQL.CreateComment, values: params }).then(
            ({ results }) => {
                // 成功
                const mailOptions = {
                    from: `"${config.blogName}" <${config.email.auth.user}>`,
                    to: config.authorEmail,
                    subject: `${config.blogName}《收到新的${wd}》`, // 主题
                    html: `收到一条新的${wd}，请点击<a href="${config.siteURL}" style="font-size:18px">${config.blogName}</a>前往查看`,
                };
                emailHandler.sendEmail(mailOptions).then(
                    (info) => {
                        console.log("通知邮件发送成功", info);
                    },
                    (error) => {
                        console.log("通知邮件发送失败", error);
                    },
                );
                res.send({
                    code: "0",
                    msg: `${wd}成功，等待审核`,
                });
            },
            (err) => {
                console.error(err);
                // 插入失败
                res.send({
                    code: "013001",
                    msg: `${wd}失败`,
                });
            },
        );
    },
);

/**
 * @description 获取留言总数
 */
router.get("/total", (req, res, next) => {
    dbUtils.query(indexSQL.GetMsgsTotal).then(({ results }) => {
        if (results) {
            res.send({
                code: "0",
                data: results.reduce((prev, cur) => prev + cur[0].total, 0),
                msg: "查询成功",
            });
        } else {
            res.send({
                code: "019002",
                data: [],
                msg: "查询失败",
            });
        }
    });
});

/**
 * @description 查询待审核的评论/留言
 */
router.get("/get_not_approved", [query("type").optional().isNumeric().toInt(), validateInterceptor], (req, res, next) => {
    const { type } = matchedData();
    const sqlStr = type === 1 ? indexSQL.QueryCommentsNotApproved : indexSQL.QueryMessagesNotApproved;
    dbUtils.query(sqlStr).then(({ results }) => {
        if (results) {
            res.send({
                code: "0",
                data: results,
                msg: "查询成功",
            });
        } else {
            res.send({
                code: "019001",
                data: [],
                msg: "查询失败",
            });
        }
    });
});

/**
 * @param {Number} pageNo 页码
 * @param {Number} pageSize 每页数量
 * @description 分页查询未审核的评论/留言
 */
router.get(
    "/page_not_approved",
    [
        query("type").optional().isNumeric().toInt(),
        query("pageNo").optional().isNumeric().toInt().default(1),
        query("pageSize").optional().isNumeric().toInt().default(10),
        validateInterceptor,
    ],
    (req, res, next) => {
        const { pageNo, pageSize, type } = matchedData(req);
        const sql = type === 1 ? indexSQL.QueryNotApprovedPageComment : indexSQL.QueryNotApprovedPageMessage;
        const sqlParams = [(pageNo - 1) * pageSize, pageSize];
        dbUtils.query({ sql, values: sqlParams }).then(({ results }) => {
            if (results) {
                res.send({
                    code: "0",
                    data: results[0],
                    total: results[1][0].total,
                });
            } else {
                res.send({
                    code: "019002",
                    data: [],
                });
            }
        });
    },
);

/**
 * @description 审核留言
 */
router.put(
    "/review",
    [
        body("id").isInt(),
        body("approved").isIn([1, 2]).withMessage("must be 1 or 2"),
        body("email").optional().isString(),
        body("jump_url").optional().isString(),
        body("email").optional().isString(),
        body("content").notEmpty(),
        validateInterceptor,
    ],
    (req, res, next) => {
        const { id, approved, email, jump_url, content } = matchedData(req);
        dbUtils.query({ sql: indexSQL.UpdateApprovedByCommentID, values: [approved, id] }).then(({ results }) => {
            if (results) {
                if (approved === 1 && email) {
                    // 发个邮件通知下
                    const jumpUrl = jump_url || config.siteURL;
                    emailHandler.replyEmailForMessage(email, "留言/评论", content, jumpUrl);
                }
                res.send({
                    code: "0",
                    msg: "审核成功",
                });
            } else {
                res.send({
                    code: "015001",
                    msg: "审核失败",
                });
            }
        });
    },
);

/**
 * @description 获取留言人数
 */
router.get("/number_of_people", (req, res, next) => {
    dbUtils.query(indexSQL.QueryPeopleCountOfMessage).then(({ results }) => {
        if (results) {
            // 查询成功
            res.send({
                code: "0",
                data: results.length,
            });
        } else {
            // 查询失败
            res.send({
                code: "012001",
                data: 0,
            });
        }
    });
});

/**
 * @description 分页查询评论，1查评论，2查留言
 */
router.get(
    "/page_admin",
    [
        query("type").optional().isNumeric().toInt(),
        query("pageNo").optional().isNumeric().toInt().default(1),
        query("pageSize").optional().isNumeric().toInt().default(10),
        validateInterceptor,
    ],
    (req, res, next) => {
        const { pageNo, pageSize, type } = matchedData(req);
        const sqlStr = type === 1 ? indexSQL.GetPageCommentAdmin : indexSQL.GetPageMessageAdmin;
        dbUtils.query({ sql: sqlStr, values: [(pageNo - 1) * pageSize, pageSize] }).then(({ results }) => {
            if (results) {
                // 查询成功
                res.send({
                    code: "0",
                    data: results[0],
                    total: results[1][0].total,
                });
            } else {
                // 查询失败
                res.send({
                    code: "013001",
                    data: 0,
                });
            }
        });
    },
);

/**
 * @description 修改评论，暂时只定义了修改 deleted 状态
 */
router.put("/update", [body("id").isInt(), body("deleted").optional().isIn([0, 1]), validateInterceptor], (req, res, next) => {
    const params = matchedData(req);
    const { id } = params;
    dbUtils.query({ sql: indexSQL.UpdateComment, values: [params, id] }).then(({ results }) => {
        if (results) {
            // 查询成功
            res.send({
                code: "0",
                data: null,
            });
        } else {
            // 查询失败
            res.send({
                code: "014001",
                data: 0,
            });
        }
    });
});

/**
 * @description 删除评论
 */
router.delete("/delete", [query("id").isInt(), validateInterceptor], (req, res, next) => {
    const { id } = matchedData(req);
    dbUtils.query({ sql: indexSQL.DeleteComment, values: [id] }).then(({ results }) => {
        if (results) {
            // 查询成功
            res.send({
                code: "0",
                data: null,
            });
        } else {
            // 查询失败
            res.send({
                code: "015001",
                data: 0,
            });
        }
    });
});

module.exports = router;
