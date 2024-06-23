const express = require("express");

const router = express.Router();
const indexSQL = require("../sql");
const utilsHelper = require("../utils/utils");
const errcode = require("../utils/errcode");
const dbUtils = require("../utils/db");

/**
 * @param {Number} count 查询数量
 * @description 根据传入的count获取阅读排行top N的文章
 */
router.get("/top_read", (req, res, next) => {
    const params = req.query;
    dbUtils.query({ sql: indexSQL.GetTopRead, values: [Number(params.count)] }).then(({ results }) => {
        if (results) {
            res.send({
                code: "0",
                data: results,
            });
        } else {
            res.send({
                ...errcode.ARTICLE.TOP_READ_EMPTY,
                data: [],
            });
        }
    });
});

/**
 * @param {Number} pageNo 页码数
 * @param {Number} pageSize 一页数量
 * @description 分页查询文章
 */
router.get("/page", (req, res, next) => {
    const pageNo = Number(req.query.pageNo || 1);
    const pageSize = Number(req.query.pageSize || 10);
    dbUtils.query({ sql: indexSQL.GetPagedArticle, values: [(pageNo - 1) * pageSize, pageSize] }).then(({ results }) => {
        if (results) {
            results[0].forEach(handleCategoryAndTag);
            res.send({
                code: "0",
                data: results[0],
                total: results[1][0].total,
            });
        } else {
            res.send({
                code: "003001",
                data: [],
            });
        }
    });
});

/**
 * @description 分页查询
 */
router.get("/page_admin", (req, res, next) => {
    const params = req.query;
    const pageNo = Number(params.pageNo || 1);
    const pageSize = Number(params.pageSize || 10);
    dbUtils.query({ sql: indexSQL.GetArticlePageAdmin, values: [(pageNo - 1) * pageSize, pageSize] }).then(({ results }) => {
        if (results) {
            // 查询成功
            results[0].forEach(handleCategoryAndTag);
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
});

/**
 * @param {Number} id 当前文章的id
 * @description 查询上一篇和下一篇文章的id
 */
router.get("/neighbors", (req, res, next) => {
    const id = Number(req.query.id);
    dbUtils.query({ sql: indexSQL.QueryPreAndNextArticleIds, values: [id, id] }).then(({ results }) => {
        if (results) {
            res.send({
                code: "0",
                data: results,
            });
        } else {
            res.send({
                ...errcode.ARTICLE.NEIGHBORS_EMPTY,
                data: [],
            });
        }
    });
});

/**
 * @param {Number} articleId 当前文章的id
 * @description 上报阅读记录
 */
router.put("/update_read_num", (req, res, next) => {
    dbUtils.query({ sql: indexSQL.UpdateReadSum, values: [req.body.id] }).then(({ results }) => {
        if (results) {
            res.send({
                code: "0",
            });
        } else {
            res.send({
                code: "008001",
            });
        }
    });
});

/**
 * @param {Number} articleId 当前文章的id
 * @description 修改私密/公开
 */
router.put("/update_private", (req, res, next) => {
    const params = req.body;
    dbUtils.query({ sql: indexSQL.UpdateArticlePrivate, values: [params.private, params.id] }).then(({ results }) => {
        if (results) {
            res.send({
                code: "0",
            });
        } else {
            res.send({
                code: "008002",
            });
        }
    });
});

/**
 * @param {Number} articleId 当前文章的id
 * @description 逻辑删除/恢复
 */
router.put("/update_deleted", (req, res, next) => {
    const params = req.body;
    dbUtils.query({ sql: indexSQL.UpdateArticleDeleted, values: [params.deleted, params.id] }).then(({ results }) => {
        if (results) {
            res.send({
                code: "0",
            });
        } else {
            res.send({
                code: "008001",
            });
        }
    });
});

/**
 * @param {Number} articleId 当前文章的id
 * @description 物理删除
 */
router.delete("/delete", (req, res, next) => {
    const params = req.query;
    dbUtils.query({ sql: indexSQL.DeleteArticleById, values: [params.id] }).then(({ results }) => {
        if (results) {
            res.send({
                code: "0",
            });
        } else {
            res.send({
                code: "008001",
            });
        }
    });
});

/**
 * @param {Number} id 当前文章的id
 * @description 获得文章详情
 */
router.get("/detail", (req, res, next) => {
    const params = req.query;
    dbUtils.query({ sql: indexSQL.GetArticleByID, values: [Number(params.id)] }).then(({ results }) => {
        if (results && results.length > 0) {
            const data = results[0];
            if (data.private) {
                // 如果是私密的，先判断有没有token
                if (!req.cookies.token) {
                    return res.send({
                        ...errcode.AUTH.FORBIDDEN,
                    });
                }
                // TODO: 还需要在这里判断token是否是有效的
                handleCategoryAndTag(data);
                res.send({
                    code: "0",
                    data,
                });
            } else {
                handleCategoryAndTag(data);
                res.send({
                    code: "0",
                    data,
                });
            }
        } else {
            res.send({
                code: "004001",
                data: null,
            });
        }
    });
});

/**
 * @param {String} keyword 分类名
 * @description 根据分类名查询文章
 */
router.get("/page_by_category", (req, res, next) => {
    const pageNo = Number(req.query.pageNo || 1);
    const pageSize = Number(req.query.pageSize || 10);
    dbUtils
        .query({
            sql: indexSQL.GetPagedArticleByCategory,
            values: [req.query.keyword, (pageNo - 1) * pageSize, pageSize, req.query.keyword],
        })
        .then(({ results }) => {
            if (results) {
                results[0].forEach(handleCategoryAndTag);
                res.send({
                    code: "0",
                    data: results[0],
                    total: results[1][0].total,
                });
            } else {
                res.send({
                    code: "003001",
                    data: [],
                });
            }
        });
});

/**
 * @param {String} keyword 标签名
 * @description 根据标签名查询文章
 */
router.get("/page_by_tag", (req, res, next) => {
    const pageNo = Number(req.query.pageNo || 1);
    const pageSize = Number(req.query.pageSize || 10);
    dbUtils
        .query({ sql: indexSQL.GetPagedArticleByTag, values: [req.query.keyword, (pageNo - 1) * pageSize, pageSize] })
        .then(({ results }) => {
            if (results) {
                results[0].forEach(handleCategoryAndTag);
                res.send({
                    code: "0",
                    data: results[0],
                    total: results[1][0].total,
                });
            } else {
                res.send({
                    code: "003001",
                    data: [],
                });
            }
        });
});

/**
 * @description 发表文章
 */
router.post("/add", (req, res, next) => {
    dbUtils.getConnection(res).then((connection) => {
        const params = req.body;
        let articleId;
        let newCategoryIds = [];
        let tagIDs = [];
        const allTaskList = [
            {
                // 任务1：插入文章表
                task() {
                    return dbUtils
                        .query(
                            {
                                sql: indexSQL.PublishArticle,
                                values: [params.articleTitle, params.articleText, params.summary, params.authorId, params.poster],
                            },
                            connection,
                            false
                        )
                        .then(({ results }) => {
                            articleId = results.insertId;
                        });
                },
                children: [
                    params.newCategories
                        ? {
                              // 任务1-2：如果存在新的分类，插入分类表
                              task() {
                                  const addCategoryTaskList = params.newCategories.map((item) =>
                                      dbUtils.query({ sql: indexSQL.AddCategories, values: [item] }, connection, false)
                                  );
                                  // 循环插入
                                  return Promise.all(addCategoryTaskList).then((ress) => {
                                      newCategoryIds = ress.map((res) => res.results.insertId);
                                  });
                              },
                              children: [
                                  {
                                      // 任务1-2-1：插入文章分类关系表
                                      task() {
                                          const addArticleCategoryTaskList = newCategoryIds.map((item) =>
                                              dbUtils.query(
                                                  { sql: indexSQL.AddArticleCategory, values: [articleId, item] },
                                                  connection,
                                                  false
                                              )
                                          );
                                          return Promise.all(addArticleCategoryTaskList);
                                      },
                                  },
                              ],
                          }
                        : null,
                    params.oldCategoryIds
                        ? {
                              // 任务1-3：如果选择了旧的分类，插入文章分类关系表
                              task() {
                                  const addArticleCategoryTaskList = params.oldCategoryIds.map((item) =>
                                      dbUtils.query({ sql: indexSQL.AddArticleCategory, values: [articleId, item] }, connection, false)
                                  );
                                  return Promise.all(addArticleCategoryTaskList);
                              },
                          }
                        : null,
                    {
                        // 任务1-4：插入标签表和关系表
                        task() {
                            const addTagTaskList = params.tags.map((item) =>
                                dbUtils.query({ sql: indexSQL.CheckTag, values: [item] }, connection, false).then(({ results }) => {
                                    if (results.length === 0) {
                                        // 不存在，插入标签
                                        return dbUtils
                                            .query({ sql: indexSQL.AddTags, values: [item] }, connection, false)
                                            .then(({ results }) => results);
                                    }
                                    // 存在，取得标签ID
                                    return { insertId: results[0].id };
                                })
                            );
                            return Promise.all(addTagTaskList).then((ress) => {
                                tagIDs = ress.map((res) => res.insertId);
                            });
                        },
                        children: [
                            {
                                // 任务1-4-1：插入文章标签关系表
                                task() {
                                    const addArticleTagTaskList = tagIDs.map((item) =>
                                        dbUtils.query({ sql: indexSQL.AddArticleTag, values: [articleId, item] }, connection, false)
                                    );
                                    return Promise.all(addArticleTagTaskList);
                                },
                            },
                        ],
                    },
                ],
            },
        ];
        const handledTaskList = utilsHelper.handlePromiseList(allTaskList);
        dbUtils.execTransaction(connection, handledTaskList).then(
            (ress) => {
                res.send({
                    code: "0",
                });
            },
            (err) => {
                // 插入失败
                res.send({
                    code: "002001",
                    msg: "发布失败",
                });
            }
        );
    });
});

/**
 *
 * @description 更新博客信息
 * 任务1：更新博客的标题，内容，摘要，封面，更新时间等信息；
 * 任务2：根据id和deleteTagIDs删除article_tag关系表中的相关记录；
 * 任务3：根据newTags添加新的tag，3-1：并在article_tag表中关联上；
 * 任务4：根据id和deleteCategoryIDs删除article_category关系表中的相关记录；
 * 任务5：根据newCategories添加新的分类，5-1：并在关系表中关联上；
 * 任务6：根据id和relatedCategoryIDs新增分类关联
 */

router.put("/update", (req, res, next) => {
    dbUtils.getConnection(res).then((connection) => {
        const params = req.body;
        let tagIDs = [];
        let categoryIDs = [];
        const allTaskList = [
            {
                // 任务1
                task() {
                    const updateArticleParam = {
                        article_name: params.articleTitle,
                        // XSS防护
                        article_text: params.articleText,
                        poster: params.poster,
                        summary: params.summary,
                        private: params.private,
                        update_time: new Date(),
                    };
                    return dbUtils.query({ sql: indexSQL.UpdateArticle, values: [updateArticleParam, params.id] }, connection, false);
                },
            },
            params.deleteTagIDs
                ? {
                      // 任务2
                      task() {
                          const deleteArticleTagTaskList = params.deleteTagIDs.map((item) =>
                              dbUtils.query({ sql: indexSQL.DeleteArticleTag, values: [params.id, item] }, connection, false)
                          );
                          return Promise.all(deleteArticleTagTaskList);
                      },
                  }
                : null,
            params.newTags
                ? {
                      // 任务3
                      task() {
                          const addTagTaskList = params.newTags.map((item) =>
                              dbUtils.query({ sql: indexSQL.CheckTag, values: [item] }, connection, false).then(({ results }) => {
                                  if (results.length === 0) {
                                      // 不存在，插入标签
                                      return dbUtils
                                          .query({ sql: indexSQL.AddTags, values: [item] }, connection, false)
                                          .then(({ results }) => results);
                                  }
                                  // 存在，取得标签ID
                                  return { insertId: results[0].id };
                              })
                          );
                          return Promise.all(addTagTaskList).then((ress) => {
                              tagIDs = ress.map((res) => res.insertId);
                          });
                      },
                      children: [
                          {
                              // 任务3-1：插入文章标签关系表
                              task() {
                                  const addArticleTagTaskList = tagIDs.map((item) =>
                                      dbUtils.query({ sql: indexSQL.AddArticleTag, values: [params.id, item] }, connection, false)
                                  );
                                  return Promise.all(addArticleTagTaskList);
                              },
                          },
                      ],
                  }
                : null,
            params.deleteCategoryIDs
                ? {
                      // 任务4
                      task() {
                          const deleteArticleCategoryTaskList = params.deleteCategoryIDs.map((item) =>
                              dbUtils.query({ sql: indexSQL.DeleteArticleCategory, values: [params.id, item] }, connection, false)
                          );
                          return Promise.all(deleteArticleCategoryTaskList);
                      },
                  }
                : null,
            params.newCategories
                ? {
                      // 任务5
                      task() {
                          const addCategoryTaskList = params.tags.map((item) =>
                              dbUtils.query({ sql: indexSQL.CheckCategory, values: [item] }, connection, false).then(({ results }) => {
                                  if (results.length === 0) {
                                      // 不存在，插入分类
                                      return dbUtils
                                          .query({ sql: indexSQL.AddCategories, values: [item] }, connection, false)
                                          .then(({ results }) => results);
                                  }
                                  // 存在，取得分类ID
                                  return { insertId: results[0].id };
                              })
                          );
                          return Promise.all(addCategoryTaskList).then((ress) => {
                              categoryIDs = ress.map((res) => res.insertId);
                          });
                      },
                      children: [
                          {
                              // 任务5-1：插入文章分类关系表
                              task() {
                                  const addArticleCategoryTaskList = categoryIDs.map((item) =>
                                      dbUtils.query({ sql: indexSQL.AddArticleCategory, values: [params.id, item] }, connection, false)
                                  );
                                  return Promise.all(addArticleCategoryTaskList);
                              },
                          },
                      ],
                  }
                : null,
            params.relatedCategoryIDs
                ? {
                      // 任务6
                      task() {
                          const relateTaskList = params.relatedCategoryIDs.map((item) =>
                              dbUtils.query({ sql: indexSQL.AddArticleCategory, values: [params.id, item] }, connection, false)
                          );
                          return Promise.all(relateTaskList);
                      },
                  }
                : null,
        ];
        const handledTaskList = utilsHelper.handlePromiseList(allTaskList);
        dbUtils.execTransaction(connection, handledTaskList).then(
            (ress) => {
                res.send({
                    code: "0",
                });
            },
            (err) => {
                // 插入失败
                res.send({
                    code: "002001",
                    msg: "更新失败",
                });
            }
        );
    });
});

/**
 *
 * @param {Obeject} item 单篇博客数据处理
 * @description 处理分类和标签信息
 */
function handleCategoryAndTag(item) {
    // 处理分类
    const categoryIDs = item.categoryIDs.split(" ").map((id) => +id);
    const categoryNames = item.categoryNames.split(" ");
    item.categories = categoryIDs.map((cateID, index) => ({
        id: cateID,
        categoryName: categoryNames[index],
    }));
    delete item.categoryIDs;
    delete item.categoryNames;
    // 处理标签
    const tagIDs = item.tagIDs.split(" ").map((id) => +id);
    const tagNames = item.tagNames.split(" ");
    item.tags = tagIDs.map((tagID, index) => ({
        id: tagID,
        tagName: tagNames[index],
    }));
    delete item.tagIDs;
    delete item.tagNames;
}

module.exports = router;
