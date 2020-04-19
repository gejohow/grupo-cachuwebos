const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function loadNegotiation(ctx, next) {
  ctx.state.negotiation = await ctx.orm.negotiation.findByPk(ctx.params.id);
  return next();
}

router.get('negotiations.list', '/', async (ctx) => {
  const negotiationsList = await ctx.orm.negotiation.findAll();
  await ctx.render('negotiations/index', {
    negotiationsList,
    newNegotiationPath: ctx.router.url('negotiations.new'),
    editNegotiationPath: (negotiation) => ctx.router.url('negotiations.edit', { id: negotiation.id }),
    deleteNegotiationPath: (negotiation) => ctx.router.url('negotiations.delete', { id: negotiation.id }),
  });
});

router.get('negotiations.new', '/new', async (ctx) => {
  const negotiation = ctx.orm.course.build();
  await ctx.render('negotiations/new', {
    negotiation,
    submitNegotiationPath: ctx.router.url('negotiations.create'),
  });
});

router.post('negotiations.create', '/', async (ctx) => {
  const negotiation = ctx.orm.negotiation.build(ctx.request.body);
  try {
    await negotiation.save({ fields: ['user1', 'user2', 'objects1', 'objects2'] });
    ctx.redirect(ctx.router.url('negotiations.list'));
  } catch (validationError) {
    await ctx.render('negotiations.new', {
      negotiation,
      errors: validationError.errors,
      submitNegotiationPath: ctx.router.url('negotiations.create'),
    });
  }
});

router.get('negotiations.edit', '/:id/edit', loadNegotiation, async (ctx) => {
  const { negotiation } = ctx.state;
  await ctx.render('negotiations/edit', {
    negotiation,
    submitNegotiationPath: ctx.router.url('negotiations.update', { id: negotiation.id }),
  });
});

router.patch('negotiations.update', '/:id', loadNegotiation, async (ctx) => {
  const { negotiation } = ctx.state;
  try {
    const {
      user1, user2, objects1, objects2,
    } = ctx.request.body;
    await negotiation.update({
      user1, user2, objects1, objects2,
    });
    ctx.redirect(ctx.router.url('negotiations.list'));
  } catch (validationError) {
    await ctx.render('negotiations/edit', {
      negotiation,
      errors: validationError.errors,
      submitNegotiationPath: ctx.router.url('negotiations.update', { id: negotiation.id }),
    });
  }
});

router.del('negotiations.delete', '/:id', loadNegotiation, async (ctx) => {
  const { negotiation } = ctx.state;
  await negotiation.destroy();
  ctx.redirect(ctx.router.url('negotiations.list'));
});

module.exports = router;
