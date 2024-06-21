module.exports = {
    // 检查分类是否存在
    CheckCategory: 'SELECT * FROM category WHERE category_name = ?',
    // 查询所有分类
    QueryAllCategories: 'SELECT * FROM category',
    GetCategoryCount: 'SELECT COUNT(*) AS count FROM category',
    // 查询所有被关联的分类及其数量
    QueryCategoryAndCount: 'SELECT c.*, COUNT(*) AS category_count FROM category c\
        LEFT JOIN article_category a_c ON c.id = a_c.category_id\
        LEFT JOIN article a ON a.id = a_c.article_id\
        WHERE a.private = 0 AND a.deleted = 0\
        GROUP BY c.id',
    // 插入分类表
    AddCategories: 'INSERT ignore into category (category_name) values (?)',
    GetCategoryAdminPage: 'SELECT SQL_CALC_FOUND_ROWS c.*, GROUP_CONCAT(a_c.article_id) AS article_ids FROM category c\
        LEFT JOIN article_category a_c ON a_c.category_id = c.id\
        GROUP BY c.id\
        LIMIT ?, ?;\
        SELECT FOUND_ROWS() AS total;',
    AdminUpdateCategory: 'UPDATE category SET ? WHERE id = ?',
}
