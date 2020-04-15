const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function loadPublication(ctx, next) {
  ctx.state.publication = await ctx.orm.publication.findByPk(ctx.params.id);
  return next();
}


router.get('publications.list', '/', async (ctx) => {
  const publicationsList = await ctx.orm.publication.findAll();
  await ctx.render('publications/index', {
    publicationsList,
    newPublicationPath: ctx.router.url('publications.new'),
    editPublicationPath: (publication) => ctx.router.url('publications.edit', { id: publication.id }),
    deletePublicationPath: (publication) => ctx.router.url('publications.delete', { id: publication.id }),
    viewPublicationPath: (publication) => ctx.router.url('publications.view', { id: publication.id }),
  });
});

router.get('publications.view', '/:id/view', loadPublication, async (ctx) => {
	const { publication } = ctx.state;
	await ctx.render('publications/view', {
    publication,
  });
});

router.get('publications.new', '/new', async (ctx) => {
  const publication = ctx.orm.publication.build();
  await ctx.render('publications/new', {
    publication,
    submitPublicationPath: ctx.router.url('publications.create'),
  });
});

router.post('publications.create', '/', async (ctx) => {
  const publication = ctx.orm.publication.build(ctx.request.body);
  try {
    await publication.save({ fields: ['name', 'description', 'image', 'state', 'type', 'negotiated'] });
    ctx.redirect(ctx.router.url('publications.list'));
  } catch (validationError) {
    await ctx.render('publications/new', {
      publication,
      errors: validationError.errors,
      submitPublicationPath: ctx.router.url('publications.create'),
    });
  }
});

router.get('publications.edit', '/:id/edit', loadPublication, async (ctx) => {
  const { publication } = ctx.state;
  await ctx.render('publications/edit', {
    publication,
    submitPublicationPath: ctx.router.url('publications.update', { id: publication.id }),
  });
});

router.patch('publications.update', '/:id', loadPublication, async (ctx) => {
  const { publication } = ctx.state;
  try {
    const {
      name, description, image, state, type, negotiated,
    } = ctx.request.body;
    await publication.update({
      name, description, image, state, type, negotiated,
    });
    ctx.redirect(ctx.router.url('publications.list'));
  } catch (validationError) {
    await ctx.render('publications/edit', {
      publication,
      errors: validationError.errors,
      submitPublicationPath: ctx.router.url('publications.update', { id: publication.id }),
    });
  }
});

router.del('publications.delete', '/:id', loadPublication, async (ctx) => {
  const { publication } = ctx.state;
  await publication.destroy();
  ctx.redirect(ctx.router.url('publications.list'));
});

module.exports = router;
