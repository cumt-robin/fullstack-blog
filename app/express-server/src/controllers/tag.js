const express = require("express");

const router = express.Router();
const { omit } = require("lodash");
const { query, matchedData } = require("express-validator");
const indexSQL = require("../sql");
const dbUtils = require("../utils/db");
const { validateInterceptor } = require("../utils/validate");

/**
 * @param {Number} getCount 是否需要同时查出每个分类下的文章数量
 * @description 查询标签
 */
router.get("/all", [query("getCount").optional().isIn(["0", "1"]).default("0"), validateInterceptor], (req, res, next) => {
    const { getCount } = matchedData(req);
    const sql = getCount === "1" ? indexSQL.QueryTagAndCount : indexSQL.QueryAllTags;
    dbUtils.query(sql).then(({ results }) => {
        if (results) {
            res.send({
                code: "0",
                data: results,
            });
        } else {
            res.send({
                code: "010001",
                data: [],
            });
        }
    });
});

/**
 * 模糊查询标签
 */
router.get("/fuzzy", [query("wd").notEmpty(), validateInterceptor], async (req, res) => {
    const { wd } = matchedData(req);
    try {
        const { results } = await dbUtils.query({
            sql: indexSQL.FuzzyQueryTag,
            values: [`%${wd}%`],
        });
        res.send({
            code: "0",
            data: results || [],
        });
    } catch (error) {
        res.send({
            code: "010004",
        });
    }
});

/**
 * 管理员分页获取
 */
router.get(
    "/admin/page",
    [
        query("pageNo").optional().isNumeric().toInt().default(1),
        query("pageSize").optional().isNumeric().toInt().default(10),
        validateInterceptor,
    ],
    (req, res, next) => {
        const { pageNo, pageSize } = matchedData(req);
        const sqlParams = [(pageNo - 1) * pageSize, pageSize];
        dbUtils.query({ sql: indexSQL.GetTagAdminPage, values: sqlParams }).then(({ results }) => {
            if (results) {
                const list = results[0].map((item) => ({
                    ...omit(item, "article_ids"),
                    article_count: item.article_ids ? item.article_ids.split(",").length : 0,
                }));
                res.send({
                    code: "0",
                    data: list,
                    total: results[1][0].total,
                });
            } else {
                res.send({
                    code: "010003",
                    data: [],
                });
            }
        });
    },
);

module.exports = router;
