module.exports = {
    // 查询未审核的留言下的回复
    GetReplyOfMsgWaitReview: 'SELECT r1.*, c1.content AS comment_content, r2.content AS reply_to_content FROM reply r1\
        LEFT JOIN comments c1 ON r1.comment_id = c1.id\
        JOIN reply r2 ON r1.parent_id = r2.id\
        WHERE (r1.approved = 0 AND r1.parent_id IS NOT NULL AND c1.article_id IS NULL)\
    UNION\
    SELECT r3.*, c2.content AS comment_content, NULL AS reply_to_content FROM reply r3\
        LEFT JOIN comments c2 ON (r3.comment_id = c2.id)\
        WHERE (r3.approved = 0 AND r3.parent_id IS NULL AND c2.article_id IS NULL)',
    // 分页查询未审核的留言下的回复
    QueryUnreviewedMessageReplyPage: 'SELECT SQL_CALC_FOUND_ROWS r1.*, c1.content AS comment_content, r2.content AS reply_to_content FROM reply r1\
        LEFT JOIN comments c1 ON r1.comment_id = c1.id\
        JOIN reply r2 ON r1.parent_id = r2.id\
        WHERE (r1.approved = 0 AND r1.parent_id IS NOT NULL AND c1.article_id IS NULL)\
    UNION\
    SELECT r3.*, c2.content AS comment_content, NULL AS reply_to_content FROM reply r3\
        LEFT JOIN comments c2 ON (r3.comment_id = c2.id)\
        WHERE (r3.approved = 0 AND r3.parent_id IS NULL AND c2.article_id IS NULL)\
        ORDER BY create_time DESC\
    LIMIT 0, 10;\
    SELECT FOUND_ROWS() AS total;',
    // 查询未审核的评论下的回复
    GetReplyOfCommentWaitReview: 'SELECT r1.*, c1.content AS comment_content, r2.content AS reply_to_content, a1.article_name FROM reply r1\
        LEFT JOIN comments c1 ON r1.comment_id = c1.id\
        LEFT JOIN article a1 ON a1.id = c1.article_id\
        JOIN reply r2 ON r1.parent_id = r2.id\
        WHERE (r1.approved = 0 AND r1.parent_id IS NOT NULL AND c1.article_id IS NOT NULL)\
    UNION\
    SELECT r3.*, c2.content AS comment_content, NULL AS reply_to_content, a2.article_name FROM reply r3\
        LEFT JOIN comments c2 ON (r3.comment_id = c2.id)\
        LEFT JOIN article a2 ON a2.id = c2.article_id\
        WHERE (r3.approved = 0 AND r3.parent_id IS NULL AND c2.article_id IS NOT NULL)',
    // 分页查询未审核的评论下的回复
    QueryUnreviewedCommentReplyPage: 'SELECT SQL_CALC_FOUND_ROWS r1.*, c1.content AS comment_content, r2.content AS reply_to_content, a1.article_name FROM reply r1\
        LEFT JOIN comments c1 ON r1.comment_id = c1.id\
        LEFT JOIN article a1 ON a1.id = c1.article_id\
        JOIN reply r2 ON r1.parent_id = r2.id\
        WHERE (r1.approved = 0 AND r1.parent_id IS NOT NULL AND c1.article_id IS NOT NULL)\
    UNION\
    SELECT r3.*, c2.content AS comment_content, NULL AS reply_to_content, a2.article_name FROM reply r3\
        LEFT JOIN comments c2 ON (r3.comment_id = c2.id)\
        LEFT JOIN article a2 ON a2.id = c2.article_id\
        WHERE (r3.approved = 0 AND r3.parent_id IS NULL AND c2.article_id IS NOT NULL)\
    ORDER BY create_time DESC\
    LIMIT ?, ?;\
    SELECT FOUND_ROWS() AS total;',
    // 插入回复表
    AddReply: 'INSERT IGNORE INTO reply SET ?',
    // 根据评论id查询所有审核通过的回复，这里ASC升序是为了让最早的回复在上面显示
    QueryReplyByCommentID: 'SELECT a.id, a.comment_id, a.content, a.create_time, a.nick_name, a.parent_id, a.site_url, a.device, a.avatar, b.nick_name AS reply_name FROM reply a\
        JOIN reply b ON (a.parent_id = b.id)\
        WHERE (a.comment_id = ? AND a.approved = 1)\
    UNION\
    SELECT c.id, c.comment_id, c.content, c.create_time, c.nick_name, c.parent_id, c.site_url, c.device, c.avatar, NULL AS reply_name FROM reply c\
        LEFT JOIN comments d ON c.comment_id = d.id\
        WHERE (c.parent_id IS NULL AND c.comment_id = ? AND c.approved = 1)\
        ORDER BY create_time ASC',
    // 审核回复
    UpdateApprovedByReplyID: 'UPDATE reply SET approved = ? WHERE id = ?'
}
