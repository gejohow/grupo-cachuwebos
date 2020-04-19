const KoaRouter = require('koa-router');

const hello = require('./routes/hello');
const index = require('./routes/index');
const negotiations = require('./routes/negotiations');
const publications = require('./routes/publications');
// const comments = require('./routes/comments');
const users = require('./routes/users');

const router = new KoaRouter();

router.use('/', index.routes());
router.use('/hello', hello.routes());
router.use('/negotiations', negotiations.routes());
router.use('/publications', publications.routes());
router.use('/users', users.routes());

module.exports = router;
