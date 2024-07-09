const express = require("express");

const router = express.Router();
const omit = require("lodash/omit");
const { query, matchedData, body } = require("express-validator");
const indexSQL = require("../sql");
const dbUtils = require("../utils/db");
const { validateInterceptor } = require("../utils/validate");

/**
 * @param {Boolean} getCount 是否需要同时查出每个分类下的文章数量
 * @description 查询分类
 */
router.get("/all", [query("getCount").optional().isBoolean(), validateInterceptor], (req, res, next) => {
    const { getCount } = matchedData(req);
    const sql = getCount ? indexSQL.QueryCategoryAndCount : indexSQL.QueryAllCategories;
    dbUtils.query(sql).then(({ results }) => {
        if (results) {
            res.send({
                code: "0",
                data: results,
            });
        } else {
            res.send({
                code: "007001",
                data: [],
            });
        }
    });
});

/**
 * 获取分类总数
 */
router.get("/count", (req, res, next) => {
    dbUtils.query(indexSQL.GetCategoryCount).then(({ results }) => {
        if (results) {
            res.send({
                code: "0",
                data: results[0].count,
            });
        } else {
            res.send({
                code: "007002",
                data: [],
            });
        }
    });
});

/**
 * 模糊查询分类
 */
router.get("/fuzzy", [query("wd").notEmpty(), validateInterceptor], async (req, res) => {
    const { wd } = matchedData(req);
    try {
        const { results } = await dbUtils.query({
            sql: indexSQL.FuzzyQueryCategory,
            values: [`%${wd}%`],
        });
        res.send({
            code: "0",
            data: results || [],
        });
    } catch (error) {
        res.send({
            code: "007005",
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
        dbUtils.query({ sql: indexSQL.GetCategoryAdminPage, values: sqlParams }).then(({ results }) => {
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
                    code: "0007003",
                    data: [],
                });
            }
        });
    }
);

/**
 * 管理员编辑分类
 */
router.put(
    "/admin/update",
    [body("id").isInt(), body("category_name").notEmpty(), body("poster").notEmpty(), validateInterceptor],
    (req, res, next) => {
        const { category_name, poster, id } = matchedData(req);
        const params = {
            category_name,
            poster,
        };
        dbUtils.query({ sql: indexSQL.AdminUpdateCategory, values: [params, id] }).then(({ results }) => {
            if (results) {
                // 查询成功
                res.send({
                    code: "0",
                    data: null,
                });
            } else {
                // 查询失败
                res.send({
                    code: "007004",
                    data: 0,
                });
            }
        });
    }
);

module.exports = router;
