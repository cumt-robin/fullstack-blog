const BaseController = require('../controllers/base');
const ValidatorController = require('../controllers/validator');
const UserController = require('../controllers/user');
const BannerController = require('../controllers/banner');
const ArticleController = require('../controllers/article');
const TagController = require('../controllers/tag');
const CategoryController = require('../controllers/category');
const CommentController = require('../controllers/comment');
const ReplyController = require('../controllers/reply');
const ChatgptController = require('../controllers/chatgpt');

module.exports = function(app) {
	app.use(BaseController);
	app.use('/validator', ValidatorController);
	app.use('/user', UserController);
	app.use('/banner', BannerController);
	app.use('/article', ArticleController);
	app.use('/tag', TagController);
	app.use('/category', CategoryController);
	app.use('/comment', CommentController);
	app.use('/reply', ReplyController);
	app.use('/chatgpt', ChatgptController);
};