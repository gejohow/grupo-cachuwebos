const KoaRouter = require('koa-router');

const hello = require('./routes/hello');
const index = require('./routes/index');
const comments = require('./routes/comments');
const publications = require('./routes/publications');

const router = new KoaRouter();

router.use('/', index.routes());
router.use('/hello', hello.routes());
router.use('/comments', comments.routes());
router.use('/publications', publications.routes());

module.exports = router;
