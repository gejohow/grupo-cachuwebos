const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('negotiations.list', '/', async (ctx) => {
  const negotiationsList = await ctx.orm.negotiation.findAll();
  await ctx.render('negotiations/index', {
    negotiationsList,
  });
});


module.exports = router;
