const express = require("express");

const router = express.Router();
const omit = require("lodash/omit");
const indexSQL = require("../sql");
const dbUtils = require("../utils/db");

/**
 * @param {Number} getCount 是否需要同时查出每个分类下的文章数量
 * @description 查询分类
 */
router.get("/all", (req, res, next) => {
    const sql = req.query.getCount ? indexSQL.QueryCategoryAndCount : indexSQL.QueryAllCategories;
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
 * 管理员分页获取
 */
router.get("/admin/page", (req, res, next) => {
    const params = req.query;
    const pageNo = Number(params.pageNo || 1);
    const pageSize = Number(params.pageSize || 10);
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
});

/**
 * 管理员编辑分类
 */
router.put("/admin/update", (req, res, next) => {
    const { category_name, poster, id } = req.body;
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
});

module.exports = router;
