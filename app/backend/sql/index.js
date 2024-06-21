const article = require('./article.js');
const user = require('./user.js');
const comment = require('./comment.js');
const reply = require('./reply.js');
const tag = require('./tag.js');
const category = require('./category.js');
const banner = require('./banner.js');

module.exports = {
    ...article,
    ...user,
    ...comment,
    ...reply,
    ...tag,
    ...category,
    ...banner
}