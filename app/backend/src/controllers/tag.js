const express = require('express');
const router = express.Router();
const indexSQL = require('../sql');
const dbUtils = require('../utils/db');
const { omit } = require('lodash');

/**
 * @param {Number} getCount 是否需要同时查出每个分类下的文章数量
 * @description 查询分类
 */
router.get('/all', function(req, res, next) {
    const sql = req.query.getCount ? indexSQL.QueryTagAndCount : indexSQL.QueryAllTags;
    dbUtils.query(sql).then(({ results }) => {
        if (results) {
            res.send({
                code: '0',
                data: results
            })
        } else {
            res.send({
                code: '010001',
                data: []
            })
        }
    })
});

/**
 * @description 获得标签下的文章数量
 */
router.get('/article_count', function(req, res, next) {
    dbUtils.query(indexSQL.GetArticleSum).then(({ results }) => {
        if (results) {
            res.send({
                code: '0',
                data: results
            });
        } else {
            res.send({
                code: '010002',
                data: []
            });
        }
    })
});

/**
 * 管理员分页获取
 */
router.get('/admin/page', function(req, res, next) {
    const params = req.query;
    const pageNo = Number(params.pageNo || 1);
    const pageSize = Number(params.pageSize || 10);
    const sqlParams = [(pageNo - 1) * pageSize, pageSize]
    dbUtils.query({ sql: indexSQL.GetTagAdminPage, values: sqlParams }).then(({ results }) => {
        if (results) {
            const list = results[0].map(item => {
                return {
                    ...omit(item, 'article_ids'),
                    article_count: item.article_ids ? item.article_ids.split(',').length : 0
                }
            });
            res.send({
                code: '0',
                data: list,
                total: results[1][0]['total']
            });
        } else {
            res.send({
                code: '010003',
                data: []
            });
        }
    })
});

module.exports = router;