module.exports = {
    // 查询所有审核通过的留言
    GetMessagesApproved: 'SELECT SQL_CALC_FOUND_ROWS id, article_id, content, create_time, nick_name, site_url, avatar, device FROM comments\
        WHERE article_id IS NULL AND approved = 1 AND deleted = 0\
        ORDER BY create_time DESC\
        LIMIT ?, ?;\
    SELECT FOUND_ROWS() AS total;',
    // 查询所有未审核的留言
    QueryMessagesNotApproved: 'SELECT * FROM comments WHERE article_id IS NULL AND approved = 0 AND deleted = 0 ORDER BY create_time DESC',
    // 分页查询未审核的留言
    QueryNotApprovedPageMessage: 'SELECT SQL_CALC_FOUND_ROWS * FROM comments\
        WHERE article_id IS NULL AND approved = 0 AND deleted = 0\
        ORDER BY create_time DESC LIMIT ?, ?;\
    SELECT FOUND_ROWS() AS total;',
    // 根据所有未审核的文章评论
    QueryCommentsNotApproved: 'SELECT c.*, a.article_name FROM comments c\
        LEFT JOIN article a ON c.article_id = a.id\
        WHERE c.article_id IS NOT NULL AND c.approved = 0 AND c.deleted = 0\
        ORDER BY c.create_time DESC',
    // 分页查询未审核的评论
    QueryNotApprovedPageComment: 'SELECT SQL_CALC_FOUND_ROWS c.*, a.article_name FROM comments c\
	    LEFT JOIN article a ON c.article_id = a.id\
	    WHERE c.article_id IS NOT NULL AND c.approved = 0 AND c.deleted = 0 ORDER BY c.create_time DESC LIMIT ?, ?;\
    SELECT FOUND_ROWS() AS total;',
    // 根据文章id查询审核通过的评论
    GetCommentsByArticleID: 'SELECT SQL_CALC_FOUND_ROWS id, article_id, content, create_time, nick_name, site_url, avatar, device FROM comments\
        WHERE article_id = ? AND approved = 1 AND deleted = 0\
        ORDER BY create_time DESC\
        LIMIT ?, ?;\
    SELECT FOUND_ROWS() AS total;',
    // 审核评论
    UpdateApprovedByCommentID: 'UPDATE comments SET approved = ? WHERE id = ?',
    // 获取留言人数
    QueryPeopleCountOfMessage: 'SELECT DISTINCT nick_name FROM comments WHERE article_id IS NULL AND deleted = 0 AND approved = 1\
        UNION\
        SELECT DISTINCT nick_name FROM reply WHERE article_id IS NULL AND approved = 1',
    // 插入评论表
    CreateComment: 'INSERT IGNORE INTO comments SET ?',
    // 查询所有留言
    GetPageMessageAdmin: 'SELECT SQL_CALC_FOUND_ROWS * from comments\
        WHERE article_id IS NULL\
        ORDER BY create_time DESC LIMIT ?, ?;\
    SELECT FOUND_ROWS() AS total;',
    // 查询所有评论
    GetPageCommentAdmin: 'SELECT SQL_CALC_FOUND_ROWS c.*, a.article_name FROM comments c\
        LEFT JOIN article a ON c.article_id = a.id\
        WHERE c.article_id IS NOT NULL\
        ORDER BY c.create_time DESC LIMIT ?, ?;\
    SELECT FOUND_ROWS() AS total;',
    // 更新
    UpdateComment: 'UPDATE comments SET ? WHERE id = ?',
    // 删除
    DeleteComment: 'DELETE FROM comments WHERE id = ?',
    // 获取留言和回复的总数
    GetMsgsTotal: 'SELECT COUNT(*) AS total FROM comments WHERE article_id IS NULL AND approved = 1;\
    SELECT COUNT(*) AS total FROM reply WHERE article_id IS NULL AND approved = 1;'
}
