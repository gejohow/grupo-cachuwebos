const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('comments.list', '/', async (ctx) => {
  const commentsList = await ctx.orm.comment.findAll();
  await ctx.render('comments/index', {
    commentsList,
  });
});

module.exports = router;
