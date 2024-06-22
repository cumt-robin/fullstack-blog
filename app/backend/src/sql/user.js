module.exports = {
    // 根据用户名和密码查询用户
    QueryByUserNameAndPwd: 'SELECT u.id, u.role_id, u.user_name, u.avatar, u.last_login_time, r.role_name FROM user u\
        LEFT JOIN role r ON r.id = u.role_id\
        WHERE u.user_name = ? AND u.password = ?',
    // 查询所有用户的相关信息
    QueryAllUsers: 'SELECT `id`, `role_id`, `user_name`, `avatar`, `last_login_time` FROM user',
    // 根据用户id更新登录时间
    UpdateUserById: 'UPDATE user SET ? WHERE id = ?',
    // 查询当前用户
    GetCurrentUser: 'SELECT u.id, u.role_id, u.user_name, u.avatar, u.last_login_time, r.role_name FROM user u\
        LEFT JOIN role r ON r.id = u.role_id\
        WHERE u.token = ?'
}
