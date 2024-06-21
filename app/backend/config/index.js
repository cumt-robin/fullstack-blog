/**
 * @description 系统配置
 */

module.exports = {
    ...require('./env'),
    ...(process.env.NODE_ENV === 'production' ? require("./prod.env") : require("./dev.env"))
}