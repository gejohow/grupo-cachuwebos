const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function loadNegotiation(ctx, next) {
  ctx.state.negotiation = await ctx.orm.negotiation.findByPk(ctx.params.id, {
    include: [{
      model: ctx.orm.publication,
      as: 'publications',
      required: false,
      // Pass in the Product attributes that you want to retrieve
      attributes: ['id', 'name'],
      through: {
        // This block of code allows you to retrieve the properties of the join table
        model: ctx.orm.publicationNegotiation,
        as: 'publicationNegotiation',
        attributes: ['qty'],
      },
    }],
  });
  return next();
}

router.get('negotiations.list', '/', async (ctx) => {
  const negotiationsList = await ctx.orm.negotiation.findAll();
  await ctx.render('negotiations/index', {
    negotiationsList,
    newNegotiationPath: ctx.router.url('negotiations.new'),
    editNegotiationPath: (negotiation) => ctx.router.url('negotiations.edit', { id: negotiation.id }),
    deleteNegotiationPath: (negotiation) => ctx.router.url('negotiations.delete', { id: negotiation.id }),
    viewNegotiationPath: (negotiation) => ctx.router.url('negotiations.view', { id: negotiation.id }),
  });
});

router.get('negotiations.view', '/:id/view', loadNegotiation, async (ctx) => {
  const { negotiation } = ctx.state;
  //  const publicationsList = await ctx.orm.publication.findAll({
  //   where: {userId: {in: [negotiation.user1,negotiation.user2]}}
  //   },
  // });
  const publicationsList = await ctx.orm.publication.findAll();
  await ctx.render('negotiations/view', {
    negotiation,
    publicationsList,
    // publicationsNot,
    editNegotiationPath: (editedNegotiation) => ctx.router.url('negotiations.edit', { id: editedNegotiation.id }),
    deleteNegotiationPath: (deletedNegotiation) => ctx.router.url('negotiations.delete', { id: deletedNegotiation.id }),
    deletePublicationPath: (publication) => ctx.router.url('negotiations.publication.delete', { id: negotiation.id, publicationId: publication.id }),
    addPublicationPath: (publication) => ctx.router.url('negotiations.publication.add', { id: negotiation.id, publicationId: publication.id }),
  });
});

router.get('negotiations.new', '/new', async (ctx) => {
  const negotiation = ctx.orm.negotiation.build();
  const publicationsList = await ctx.orm.publication.findAll();
  await ctx.render('negotiations/new', {
    negotiation,
    publicationsList,
    submitNegotiationPath: ctx.router.url('negotiations.create'),
  });
});

router.post('negotiations.create', '/', async (ctx) => {
  const negotiation = ctx.orm.negotiation.build(ctx.request.body);
  const publicationNegotiation1 = ctx.orm.publicationNegotiation.build();
  const publicationNegotiation2 = ctx.orm.publicationNegotiation.build();
  try {
    await negotiation.save({ fields: ['user1', 'user2', 'objects1', 'objects2'] });
    publicationNegotiation1.publicationId = ctx.request.body.objects1;
    publicationNegotiation1.negotiationId = negotiation.id;
    await publicationNegotiation1.save();
    publicationNegotiation2.publicationId = ctx.request.body.objects2;
    publicationNegotiation2.negotiationId = negotiation.id;
    await publicationNegotiation2.save();
    ctx.redirect(ctx.router.url('negotiations.list'));
  } catch (validationError) {
    const publicationsList = await ctx.orm.publication.findAll();
    await ctx.render('negotiations/new', {
      negotiation,
      publicationsList,
      errors: validationError.errors,
      submitNegotiationPath: ctx.router.url('negotiations.create'),
    });
  }
});

router.get('negotiations.edit', '/:id/edit', loadNegotiation, async (ctx) => {
  const { negotiation } = ctx.state;
  const publicationsList = await ctx.orm.publication.findAll();
  await ctx.render('negotiations/edit', {
    negotiation,
    publicationsList,
    submitNegotiationPath: ctx.router.url('negotiations.update', { id: negotiation.id }),
  });
});

router.patch('negotiations.update', '/:id', loadNegotiation, async (ctx) => {
  const { negotiation } = ctx.state;
  const publicationNegotiation1 = ctx.orm.publicationNegotiation.build();
  const publicationNegotiation2 = ctx.orm.publicationNegotiation.build();
  try {
    const {
      user1, user2, objects1, objects2,
    } = ctx.request.body;
    await negotiation.update({
      user1, user2, objects1, objects2,
    });
    publicationNegotiation1.publicationId = ctx.request.body.objects1;
    publicationNegotiation1.negotiationId = negotiation.id;
    await publicationNegotiation1.save();
    publicationNegotiation2.publicationId = ctx.request.body.objects2;
    publicationNegotiation2.negotiationId = negotiation.id;
    await publicationNegotiation2.save();
    ctx.redirect(ctx.router.url('negotiations.list'));
  } catch (validationError) {
    const publicationsList = await ctx.orm.publication.findAll();
    await ctx.render('negotiations/edit', {
      negotiation,
      publicationsList,
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

router.del('negotiations.publication.delete', '/:id/publications/:publicationId', loadNegotiation, async (ctx) => {
  const publication = await ctx.orm.publication.findByPk(ctx.params.publicationId);
  const { negotiation } = ctx.state;
  negotiation.removePublication(publication);
  ctx.redirect(ctx.router.url('negotiations.view', { id: ctx.params.id }));
});

router.del('negotiations.publication.add', '/:id/publications/:publicationId', loadNegotiation, async (ctx) => {
  const publicationNegotiation = ctx.orm.publicationNegotiation.build();
  const { negotiation } = ctx.state;
  publicationNegotiation.publicationId = ctx.params.publicationId;
  publicationNegotiation.negotiationId = negotiation.id;
  await publicationNegotiation.save();
  ctx.redirect(ctx.router.url('negotiations.view', { id: ctx.params.id }));
});

module.exports = router;
