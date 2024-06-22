const express = require('express');
const router = express.Router();
const indexSQL = require('../sql');
const dbUtils = require('../utils/db');

/**
 * @description 获得所有PC banner
 */
router.get('/pc', function(req, res, next) {
    dbUtils.query(indexSQL.GetPcBanners).then(({ results }) => {
        if (results) {
            res.send({
                code: '0',
                data: results
            });
        } else {
            res.send({
                code: '013001',
                data: []
            });
        }
    })
});

/**
 * @description 获得所有小程序 banner
 */
router.get('/weapp', function(req, res, next) {
    dbUtils.query(indexSQL.GetWeappBanners).then(({ results }) => {
        if (results) {
            res.send({
                code: '0',
                data: results
            });
        } else {
            res.send({
                code: '013002',
                data: []
            });
        }
    })
});

module.exports = router;