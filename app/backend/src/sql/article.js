module.exports = {
    // 分页查询文章及总数量，并通过左连接查询出相关分类与标签
    GetPagedArticle:
        'SELECT SQL_CALC_FOUND_ROWS a.id, a.article_name, a.poster, a.read_num, a.summary, a.create_time, a.update_time, u.nick_name AS author, GROUP_CONCAT(DISTINCT c.id SEPARATOR " ") AS categoryIDs, GROUP_CONCAT(DISTINCT c.category_name SEPARATOR " ") AS categoryNames, GROUP_CONCAT(DISTINCT t.id SEPARATOR " ") AS tagIDs, GROUP_CONCAT(DISTINCT t.tag_name SEPARATOR " ") AS tagNames FROM article a\
        LEFT JOIN user u ON a.author_id = u.id\
        LEFT JOIN article_category a_c ON a.id = a_c.article_id\
        LEFT JOIN category c ON a_c.category_id = c.id\
        LEFT JOIN article_tag a_t ON a.id = a_t.article_id\
        LEFT JOIN tag t ON a_t.tag_id = t.id\
        WHERE a.private = 0 AND a.deleted = 0\
        GROUP BY a.id\
        ORDER BY a.create_time DESC LIMIT ?, ?;\
    SELECT FOUND_ROWS() AS total;',
    // admin分页查询文章及总数量，并通过左连接查询出相关分类与标签
    GetArticlePageAdmin:
        'SELECT SQL_CALC_FOUND_ROWS a.id, a.article_name, a.poster, a.read_num, a.create_time, a.update_time, a.private, a.deleted, u.nick_name AS author, GROUP_CONCAT(DISTINCT c.id SEPARATOR " ") AS categoryIDs, GROUP_CONCAT(DISTINCT c.category_name SEPARATOR " ") AS categoryNames, GROUP_CONCAT(DISTINCT t.id SEPARATOR " ") AS tagIDs, GROUP_CONCAT(DISTINCT t.tag_name SEPARATOR " ") AS tagNames FROM article a\
        LEFT JOIN user u ON a.author_id = u.id\
        LEFT JOIN article_category a_c ON a.id = a_c.article_id\
        LEFT JOIN category c ON a_c.category_id = c.id\
        LEFT JOIN article_tag a_t ON a.id = a_t.article_id\
        LEFT JOIN tag t ON a_t.tag_id = t.id\
        GROUP BY a.id\
        ORDER BY a.create_time DESC LIMIT ?, ?;\
    SELECT FOUND_ROWS() AS total;',
    // 根据ID查询文章，并通过左连接查询出相关分类与标签
    GetArticleByID:
        'SELECT a.*, u.nick_name AS author, GROUP_CONCAT(DISTINCT c.id SEPARATOR " ") AS categoryIDs, GROUP_CONCAT(DISTINCT c.category_name SEPARATOR " ") AS categoryNames, GROUP_CONCAT(DISTINCT t.id SEPARATOR " ") AS tagIDs, GROUP_CONCAT(DISTINCT t.tag_name SEPARATOR " ") AS tagNames FROM article a\
        LEFT JOIN user u ON a.author_id = u.id\
        LEFT JOIN article_category a_c ON a.id = a_c.article_id\
        LEFT JOIN category c ON a_c.category_id = c.id\
        LEFT JOIN article_tag a_t ON a.id = a_t.article_id\
        LEFT JOIN tag t ON a_t.tag_id = t.id\
        WHERE a.id = ?\
        GROUP BY a.id',
    // 通过标签名分页查询标签下的文章，并通过左连接查询出文章的相关分类与标签
    GetPagedArticleByTag:
        'SELECT SQL_CALC_FOUND_ROWS a.id, a.article_name, a.poster, a.read_num, a.summary, a.create_time, a.update_time, u.nick_name AS author, GROUP_CONCAT(DISTINCT c.id SEPARATOR " ") AS categoryIDs, GROUP_CONCAT(DISTINCT c.category_name SEPARATOR " ") AS categoryNames, GROUP_CONCAT(DISTINCT t.id SEPARATOR " ") AS tagIDs, GROUP_CONCAT(DISTINCT t.tag_name SEPARATOR " ") AS tagNames FROM article a\
        LEFT JOIN user u ON a.author_id = u.id\
        LEFT JOIN article_category a_c ON a.id = a_c.article_id\
        LEFT JOIN category c ON a_c.category_id = c.id\
        LEFT JOIN article_tag a_t ON a.id = a_t.article_id\
        LEFT JOIN tag t ON a_t.tag_id = t.id\
        WHERE a.private = 0 AND a.deleted = 0\
        GROUP BY a.id\
        having a.id = any (SELECT article_id FROM article_tag WHERE tag_id = (SELECT id FROM tag WHERE tag_name = ?))\
        ORDER BY a.create_time desc LIMIT ?, ?;\
    SELECT FOUND_ROWS() AS total;',
    // 通过分类名分页查询分类下的文章，并通过左连接查询出文章的相关分类与标签
    GetPagedArticleByCategory:
        'SELECT SQL_CALC_FOUND_ROWS a.id, a.article_name, a.poster, a.read_num, a.summary, a.create_time, a.update_time, u.nick_name AS author, GROUP_CONCAT(DISTINCT c.id SEPARATOR " ") AS categoryIDs, GROUP_CONCAT(DISTINCT c.category_name SEPARATOR " ") AS categoryNames, GROUP_CONCAT(DISTINCT t.id SEPARATOR " ") AS tagIDs, GROUP_CONCAT(DISTINCT t.tag_name SEPARATOR " ") AS tagNames FROM article a\
        LEFT JOIN user u ON a.author_id = u.id\
        LEFT JOIN article_category a_c ON a.id = a_c.article_id\
        LEFT JOIN category c ON a_c.category_id = c.id\
        LEFT JOIN article_tag a_t ON a.id = a_t.article_id\
        LEFT JOIN tag t ON a_t.tag_id = t.id\
        WHERE a.private = 0 AND a.deleted = 0\
        GROUP BY a.id\
        having a.id = any (SELECT article_id FROM article_category WHERE category_id = (SELECT id FROM category WHERE category_name = ?))\
        ORDER BY a.create_time desc LIMIT ?, ?;\
    SELECT FOUND_ROWS() AS total;',
    // 发布文章，插入article表
    PublishArticle: "INSERT INTO article (article_name, article_text, summary, author_id, poster) values (?, ?, ?, ?, ?)",
    // 根据ID更新文章阅读数
    UpdateReadSum: "UPDATE article SET read_num = read_num + 1 WHERE id = ?",
    // 更新文章信息
    UpdateArticle: "UPDATE article SET ? WHERE id = ?",
    // 根据限制数量查询阅读数排行最高的文章
    GetTopRead: "SELECT id, article_name, read_num, poster FROM article WHERE private = 0 AND deleted = 0 ORDER BY `read_num` DESC LIMIT ?",
    // 根据文章id查询上一篇和下一篇的id和article_name信息
    QueryPreAndNextArticleIds:
        "SELECT id, article_name FROM article WHERE id in ((SELECT id FROM article WHERE private = 0 AND deleted = 0 AND id < ? ORDER BY id DESC limit 1), (SELECT id FROM article WHERE private = 0 AND deleted = 0 AND id > ? ORDER BY id asc limit 1))",
    // 插入文章分类关系表
    AddArticleCategory: "INSERT INTO article_category (article_id, category_id) VALUES (?, ?)",
    // 插入文章标签关系表
    AddArticleTag: "INSERT INTO article_tag (article_id, tag_id) VALUES (?, ?)",
    // 删除文章标签关系表的记录
    DeleteArticleTag: "DELETE FROM article_tag WHERE article_id = ? AND tag_id = ?",
    // 删除文章分类关系表的记录
    DeleteArticleCategory: "DELETE FROM article_category WHERE article_id = ? AND category_id = ?",
    // 修改私密/公开
    UpdateArticlePrivate: "UPDATE article SET private = ? WHERE id = ?",
    // 逻辑删除/恢复
    UpdateArticleDeleted: "UPDATE article SET deleted = ? WHERE id = ?",
    // 删除
    DeleteArticleById: "DELETE FROM article WHERE id = ?",
};
