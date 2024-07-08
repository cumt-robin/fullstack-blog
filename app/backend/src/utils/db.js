const mysql = require("mysql2");
const config = require("../config");
const errcode = require("./errcode");

const pool = mysql.createPool({
    multipleStatements: true,
    waitForConnections: true,
    charset: "UTF8MB4_UNICODE_CI",
    ...config.mysql,
});

pool.on("connection", (connection) => {
    // console.log('取得连接');
});

pool.on("release", (connection) => {
    // console.log('释放了连接');
});

pool.on("error", (err) => {
    console.error(err);
});

/**
 * 获取 mysql connection，可以携带 res 对象，方便在连接异常时自动响应错误
 * @param {import("express").Response} res
 */
function getConnection(res) {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                // not connected!
                console.error(err);
                if (res) {
                    res.send({
                        ...errcode.AUTH.UNAUTHORIZED,
                    });
                }
                throw err;
            } else {
                resolve(connection);
            }
        });
    });
}

/**
 * 执行 mysql 查询语句，自动 release connection
 * @param {string | import("mysql2").QueryOptions} options
 * @param {import("mysql2").PoolConnection} connection
 * @param {boolean} release
 * @returns
 */
function execQuery(options, connection, release = true) {
    return new Promise((resolve, reject) => {
        // Use the connection
        connection.query(options, (error, results, fields) => {
            // When done with the connection, release it.
            if (release) {
                // 可以手动选择不 release，复用 connection，在事务结束再 release
                connection.release();
            }

            if (error) {
                // Handle error after the release.
                throw error;
            } else {
                resolve({
                    results,
                    fields,
                });
            }
        });
    });
}

/**
 * 执行 mysql 查询语句
 * @param {string | import("mysql2").QueryOptions} options 支持 sql string 和 options 两种形式调用，如果要传参数，必须使用 options 对象，options.sql 是 sql 语句，options.values 是参数数组。
 * @param {import("mysql2").PoolConnection} connection 如果传入 connect 直接使用
 * @param {boolean} release 执行 query 后，是否自动 release
 */
function query(options, connection, release) {
    if (connection) {
        return execQuery(options, connection, release);
    }
    return getConnection().then((connection) => execQuery(options, connection, release));
}

/**
 * 执行事务，自动 commit 和 rollback
 * @param {import("mysql2").PoolConnection} connection
 * @param {Promise} task
 * @returns
 */
function execTransaction(connection, task) {
    return new Promise((resolve, reject) => {
        connection.beginTransaction((err) => {
            if (err) {
                reject(err);
            }
            task.then(
                (resp) => {
                    connection.commit((err) => {
                        if (err) {
                            connection.rollback(() => {
                                reject(err);
                            });
                        } else {
                            resolve(resp);
                        }
                    });
                },
                (err) => {
                    connection.rollback(() => {
                        reject(err);
                    });
                }
            ).catch((err) => {
                connection.rollback(() => {
                    reject(err);
                });
            });
        });
    }).finally(() => {
        connection.release();
    });
}

module.exports.getConnection = getConnection;
module.exports.query = query;
module.exports.execTransaction = execTransaction;
