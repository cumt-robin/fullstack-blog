const authMap = new Map();

authMap.set("/user/current", { role: "admin" });
authMap.set("/user/forgetpwd", { role: "admin" });

authMap.set("/article/page_admin", { role: "admin" });
authMap.set("/article/update_private", { role: "admin" });
authMap.set("/article/update_deleted", { role: "admin" });
authMap.set("/article/add", { role: "admin" });
authMap.set("/article/delete", { role: "admin" });
authMap.set("/article/publish", { role: "admin" });
authMap.set("/article/update", { role: "admin" });

authMap.set("/comment/get_not_approved", { role: "admin" });
authMap.set("/comment/page_not_approved", { role: "admin" });
authMap.set("/comment/review", { role: "admin" });
authMap.set("/comment/page_admin", { role: "admin" });
authMap.set("/comment/update", { role: "admin" });
authMap.set("/comment/delete", { role: "admin" });

authMap.set("/reply/getReplyOfCommentWaitReview", { role: "admin" });
authMap.set("/reply/getReplyOfMsgWaitReview", { role: "admin" });
authMap.set("/reply/unreviewd_reply_page", { role: "admin" });
authMap.set("/reply/review", { role: "admin" });

authMap.set("/category/admin/page", { role: "admin" });
authMap.set("/category/fuzzy", { role: "admin" });

authMap.set("/tag/admin/page", { role: "admin" });
authMap.set("/tag/fuzzy", { role: "admin" });

module.exports = authMap;
