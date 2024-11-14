const express = require("express");

const router = express.Router();
const { query, matchedData, body } = require("express-validator");
const indexSQL = require("../sql");
const utilsHelper = require("../utils/utils");
const errcode = require("../utils/errcode");
const dbUtils = require("../utils/db");
const { validateInterceptor } = require("../utils/validate");
const { parseToken } = require("../utils/auth");

/**
 * @description 根据传入的count获取阅读排行top N的文章
 */
router.get("/top_read", [query("count").notEmpty().isNumeric().toInt(), validateInterceptor], (req, res, next) => {
    const { count } = matchedData(req);
    dbUtils.query({ sql: indexSQL.GetTopRead, values: [count] }).then(({ results }) => {
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
 * @description 分页查询文章
 */
router.get(
    "/page",
    [
        query("pageNo").optional().isNumeric().toInt().default(1),
        query("pageSize").optional().isNumeric().toInt().default(10),
        validateInterceptor,
    ],
    (req, res, next) => {
        const { pageNo, pageSize } = matchedData(req);
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
    },
);

/**
 * @description 分页查询
 */
router.get(
    "/page_admin",
    [
        query("pageNo").optional().isNumeric().toInt().default(1),
        query("pageSize").optional().isNumeric().toInt().default(10),
        validateInterceptor,
    ],
    (req, res, next) => {
        const { pageNo, pageSize } = matchedData(req);
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
    },
);

/**
 * @description 查询上一篇和下一篇文章的id
 */
router.get("/neighbors", [query("id").notEmpty().isNumeric().toInt(), validateInterceptor], (req, res, next) => {
    const { id } = matchedData(req);
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
 * @description 上报阅读记录
 */
router.put("/update_read_num", [body("id").isInt(), validateInterceptor], (req, res, next) => {
    const { id } = matchedData(req);
    dbUtils.query({ sql: indexSQL.UpdateReadSum, values: [id] }).then(({ results }) => {
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
 * @description 修改私密/公开
 */
router.put(
    "/update_private",
    [body("id").isInt(), body("private").isIn([0, 1]).withMessage("must be 0 or 1"), validateInterceptor],
    (req, res, next) => {
        const { private: _private, id } = matchedData(req);
        dbUtils.query({ sql: indexSQL.UpdateArticlePrivate, values: [_private, id] }).then(({ results }) => {
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
    },
);

/**
 * @description 逻辑删除/恢复
 */
router.put(
    "/update_deleted",
    [body("id").isInt(), body("deleted").isIn([0, 1]).withMessage("must be 0 or 1"), validateInterceptor],
    (req, res, next) => {
        const { deleted: _deleted, id } = matchedData(req);
        dbUtils.query({ sql: indexSQL.UpdateArticleDeleted, values: [_deleted, id] }).then(({ results }) => {
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
    },
);

/**
 * @description 物理删除
 */
router.delete("/delete", [query("id").notEmpty().isNumeric().toInt(), validateInterceptor], (req, res, next) => {
    const { id } = matchedData(req);
    dbUtils.query({ sql: indexSQL.DeleteArticleById, values: [id] }).then(({ results }) => {
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
 * @description 获得文章详情
 */
router.get("/detail", [query("id").notEmpty().isNumeric().toInt(), validateInterceptor], (req, res, next) => {
    const { id } = matchedData(req);
    dbUtils.query({ sql: indexSQL.GetArticleByID, values: [id] }).then(async ({ results }) => {
        if (results && results.length > 0) {
            const data = results[0];
            if (data.private) {
                // 如果是私密的，先判断有没有token
                const currentUser = await parseToken(req);
                if (!currentUser) {
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
 * @description 根据分类名查询文章
 */
router.get(
    "/page_by_category",
    [
        query("pageNo").optional().isNumeric().toInt().default(1),
        query("pageSize").optional().isNumeric().toInt().default(10),
        query("keyword").notEmpty(),
        validateInterceptor,
    ],
    (req, res, next) => {
        const { pageNo, pageSize, keyword } = matchedData(req);

        dbUtils
            .query({
                sql: indexSQL.GetPagedArticleByCategory,
                values: [keyword, (pageNo - 1) * pageSize, pageSize, keyword],
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
    },
);

/**
 * @param {String} keyword 标签名
 * @description 根据标签名查询文章
 */
router.get(
    "/page_by_tag",
    [
        query("pageNo").optional().isNumeric().toInt().default(1),
        query("pageSize").optional().isNumeric().toInt().default(10),
        query("keyword").notEmpty(),
        validateInterceptor,
    ],
    (req, res, next) => {
        const { pageNo, pageSize, keyword } = matchedData(req);

        dbUtils.query({ sql: indexSQL.GetPagedArticleByTag, values: [keyword, (pageNo - 1) * pageSize, pageSize] }).then(({ results }) => {
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
    },
);

/**
 * @description 发表文章
 */
router.post(
    "/add",
    [
        body("articleTitle").notEmpty(),
        body("articleText").notEmpty(),
        body("summary").notEmpty(),
        body("authorId").isInt(),
        body("poster").notEmpty(),
        body("newCategories").optional().isArray(),
        body("oldCategoryIds").optional().isArray(),
        body("tags").isArray(),
        validateInterceptor,
    ],
    (req, res, next) => {
        const { articleTitle, articleText, summary, authorId, poster, newCategories, oldCategoryIds, tags } = matchedData(req);
        dbUtils.getConnection(res).then((connection) => {
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
                                    values: [articleTitle, articleText, summary, authorId, poster],
                                },
                                connection,
                                false,
                            )
                            .then(({ results }) => {
                                articleId = results.insertId;
                            });
                    },
                    children: [
                        newCategories
                            ? {
                                  // 任务1-2：如果存在新的分类，插入分类表
                                  task() {
                                      const addCategoryTaskList = newCategories.map((item) =>
                                          dbUtils.query({ sql: indexSQL.AddCategories, values: [item] }, connection, false),
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
                                                      false,
                                                  ),
                                              );
                                              return Promise.all(addArticleCategoryTaskList);
                                          },
                                      },
                                  ],
                              }
                            : null,
                        oldCategoryIds
                            ? {
                                  // 任务1-3：如果选择了旧的分类，插入文章分类关系表
                                  task() {
                                      const addArticleCategoryTaskList = oldCategoryIds.map((item) =>
                                          dbUtils.query({ sql: indexSQL.AddArticleCategory, values: [articleId, item] }, connection, false),
                                      );
                                      return Promise.all(addArticleCategoryTaskList);
                                  },
                              }
                            : null,
                        {
                            // 任务1-4：插入标签表和关系表
                            task() {
                                const addTagTaskList = tags.map((item) =>
                                    dbUtils.query({ sql: indexSQL.CheckTag, values: [item] }, connection, false).then(({ results }) => {
                                        if (results.length === 0) {
                                            // 不存在，插入标签
                                            return dbUtils
                                                .query({ sql: indexSQL.AddTags, values: [item] }, connection, false)
                                                .then(({ results }) => results);
                                        }
                                        // 存在，取得标签ID
                                        return { insertId: results[0].id };
                                    }),
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
                                            dbUtils.query({ sql: indexSQL.AddArticleTag, values: [articleId, item] }, connection, false),
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
                },
            );
        });
    },
);

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

router.put(
    "/update",
    [
        body("id").isInt(),
        body("private").isIn([0, 1]).withMessage("must be 0 or 1"),
        body("articleTitle").notEmpty(),
        body("articleText").notEmpty(),
        body("summary").notEmpty(),
        body("poster").notEmpty(),
        body("deleteTagIDs").optional().isArray(),
        body("newTags").optional().isArray(),
        body("deleteCategoryIDs").optional().isArray(),
        body("newCategories").optional().isArray(),
        body("relatedCategoryIDs").optional().isArray(),
        validateInterceptor,
    ],
    (req, res, next) => {
        const {
            id,
            articleTitle,
            articleText,
            summary,
            private: _private,
            poster,
            deleteTagIDs,
            newTags,
            deleteCategoryIDs,
            newCategories,
            relatedCategoryIDs,
        } = matchedData(req);
        dbUtils.getConnection(res).then((connection) => {
            let tagIDs = [];
            let categoryIDs = [];
            const allTaskList = [
                {
                    // 任务1
                    task() {
                        const updateArticleParam = {
                            article_name: articleTitle,
                            // XSS防护
                            article_text: articleText,
                            poster,
                            summary,
                            private: _private,
                            update_time: new Date(),
                        };
                        return dbUtils.query({ sql: indexSQL.UpdateArticle, values: [updateArticleParam, id] }, connection, false);
                    },
                },
                deleteTagIDs
                    ? {
                          // 任务2
                          task() {
                              const deleteArticleTagTaskList = deleteTagIDs.map((item) =>
                                  dbUtils.query({ sql: indexSQL.DeleteArticleTag, values: [id, item] }, connection, false),
                              );
                              return Promise.all(deleteArticleTagTaskList);
                          },
                      }
                    : null,
                newTags
                    ? {
                          // 任务3
                          task() {
                              const addTagTaskList = newTags.map((item) =>
                                  dbUtils.query({ sql: indexSQL.CheckTag, values: [item] }, connection, false).then(({ results }) => {
                                      if (results.length === 0) {
                                          // 不存在，插入标签
                                          return dbUtils
                                              .query({ sql: indexSQL.AddTags, values: [item] }, connection, false)
                                              .then(({ results }) => results);
                                      }
                                      // 存在，取得标签ID
                                      return { insertId: results[0].id };
                                  }),
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
                                          dbUtils.query({ sql: indexSQL.AddArticleTag, values: [id, item] }, connection, false),
                                      );
                                      return Promise.all(addArticleTagTaskList);
                                  },
                              },
                          ],
                      }
                    : null,
                deleteCategoryIDs
                    ? {
                          // 任务4
                          task() {
                              const deleteArticleCategoryTaskList = deleteCategoryIDs.map((item) =>
                                  dbUtils.query({ sql: indexSQL.DeleteArticleCategory, values: [id, item] }, connection, false),
                              );
                              return Promise.all(deleteArticleCategoryTaskList);
                          },
                      }
                    : null,
                newCategories
                    ? {
                          // 任务5
                          task() {
                              const addCategoryTaskList = newCategories.map((item) =>
                                  dbUtils.query({ sql: indexSQL.CheckCategory, values: [item] }, connection, false).then(({ results }) => {
                                      if (results.length === 0) {
                                          // 不存在，插入分类
                                          return dbUtils
                                              .query({ sql: indexSQL.AddCategories, values: [item] }, connection, false)
                                              .then(({ results }) => results);
                                      }
                                      // 存在，取得分类ID
                                      return { insertId: results[0].id };
                                  }),
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
                                          dbUtils.query({ sql: indexSQL.AddArticleCategory, values: [id, item] }, connection, false),
                                      );
                                      return Promise.all(addArticleCategoryTaskList);
                                  },
                              },
                          ],
                      }
                    : null,
                relatedCategoryIDs
                    ? {
                          // 任务6
                          task() {
                              const relateTaskList = relatedCategoryIDs.map((item) =>
                                  dbUtils.query({ sql: indexSQL.AddArticleCategory, values: [id, item] }, connection, false),
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
                },
            );
        });
    },
);

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
