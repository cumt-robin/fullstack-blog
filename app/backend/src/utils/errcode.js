// ${module}${feature}${errtype}
module.exports = {
    DB: {
        CONNECT_EXCEPTION: {
            code: "-1",
            msg: "数据库连接异常"
        }
    },
    AUTH: {
        UNAUTHORIZED: {
            code: "000001",
            msg: "对不起，您还未获得授权"
        },
        AUTHORIZE_EXPIRED: {
            code: "000002",
            msg: "授权已过期"
        },
        FORBIDDEN: {
            code: "000003",
            msg: "抱歉，您没有权限访问该内容"
        }
    },
    ARTICLE: {
        TOP_READ_EMPTY: {
            code: "009001",
            msg: "阅读排行榜为空"
        },
        NEIGHBORS_EMPTY: {
            code: "011001",
            msg: "上一篇或下一篇查询失败"
        }
    }
}