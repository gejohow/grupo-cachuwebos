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

async function loadUserList(ctx, next) {
  ctx.state.userList = await ctx.orm.user.findAll();
  return next();
}

async function loadPublicationList(ctx, next) {
  ctx.state.publicationList = await ctx.orm.publication.findAll();
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

router.get('negotiations.view', '/:id/view', loadNegotiation, loadPublicationList, loadUserList, async (ctx) => {
  const { negotiation, publicationList, userList } = ctx.state;
  const messagesList = await ctx.orm.message.findAll({
    where: { negotiationId: negotiation.id },
  });
  await ctx.render('negotiations/view', {
    negotiation,
    publicationList,
    userList,
    editNegotiationPath: (editedNegotiation) => ctx.router.url('negotiations.edit', { id: editedNegotiation.id }),
    deleteNegotiationPath: (deletedNegotiation) => ctx.router.url('negotiations.delete', { id: deletedNegotiation.id }),
    deletePublicationPath: (publication) => ctx.router.url('negotiations.publication.delete', { id: negotiation.id, publicationId: publication.id }),
    addPublicationPath: (publication) => ctx.router.url('negotiations.publication.add', { id: negotiation.id, publicationId: publication.id }),
    messagesList,
    newMessagePath: ctx.router.url('negotiations.messages.new', { id: negotiation.id }),
    editMessagePath: (message) => ctx.router.url('negotiations.messages.edit', { id: negotiation.id, messageId: message.id }),
    deleteMessagePath: (message) => ctx.router.url('negotiations.messages.delete', { id: negotiation.id, messageId: message.id }),
  });
});

router.get('negotiations.new', '/new', loadUserList, async (ctx) => {
  const negotiation = ctx.orm.negotiation.build();
  const publicationsList = await ctx.orm.publication.findAll();
  const { userList } = ctx.state;
  await ctx.render('negotiations/new', {
    negotiation,
    publicationsList,
    userList,
    submitNegotiationPath: ctx.router.url('negotiations.create'),
  });
});

router.post('negotiations.create', '/', async (ctx) => {
  const negotiation = ctx.orm.negotiation.build(ctx.request.body);
  const publicationNegotiation1 = ctx.orm.publicationNegotiation.build();
  const publicationNegotiation2 = ctx.orm.publicationNegotiation.build();
  try {
    await negotiation.save({ fields: ['userOneId', 'userTwoId', 'objects1', 'objects2'] });
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

router.get('negotiations.edit', '/:id/edit', loadNegotiation, loadUserList, async (ctx) => {
  const { negotiation, userList } = ctx.state;
  const publicationsList = await ctx.orm.publication.findAll();
  await ctx.render('negotiations/edit', {
    negotiation,
    publicationsList,
    userList,
    submitNegotiationPath: ctx.router.url('negotiations.update', { id: negotiation.id }),
  });
});

router.patch('negotiations.update', '/:id', loadNegotiation, loadUserList, async (ctx) => {
  const { negotiation, userList } = ctx.state;
  const publicationNegotiation1 = ctx.orm.publicationNegotiation.build();
  const publicationNegotiation2 = ctx.orm.publicationNegotiation.build();
  try {
    const {
      userOneId, userTwoId, objects1, objects2,
    } = ctx.request.body;
    await negotiation.update({
      userOneId, userTwoId, objects1, objects2,
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
      userList,
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

// messages routes:

async function loadMessage(ctx, next) {
  ctx.state.message = await ctx.orm.message.findByPk(ctx.params.id);
  return next();
}

router.get('negotiations.messages.new', '/:id/messages', loadNegotiation, async (ctx) => {
  const message = ctx.orm.message.build();
  const { negotiation } = ctx.state;
  await ctx.render('/messages/new', {
    message,
    negotiationId: negotiation.id,
    submitMessagePath: ctx.router.url('negotiations.messages.create', { id: negotiation.id }),
  });
});


router.post('negotiations.messages.create', '/:id', loadNegotiation, async (ctx) => {
  const message = ctx.orm.message.build(ctx.request.body);
  const { negotiation } = ctx.state;
  message.negotiationId = negotiation.id;
  try {
    await message.save({ fields: ['description', 'negotiationId', 'userId'] });
    ctx.redirect(ctx.router.url('negotiations.view', { id: negotiation.id }));
  } catch (validationError) {
    await ctx.render('messages/new', {
      message,
      negotiationId: negotiation.id,
      errors: validationError.errors,
      submitMessagePath: ctx.router.url('negotiations.messages.create', { id: negotiation.id }),
    });
  }
});

router.get('negotiations.messages.edit', '/:id/messages/:messageId/edit', loadNegotiation, async (ctx) => {
  const { negotiation } = ctx.state;
  const message = await ctx.orm.message.findOne({
    where: { id: ctx.params.messageId },
  });
  await ctx.render('messages/edit', {
    message,
    negotiationId: negotiation.id,
    submitMessagePath: ctx.router.url('negotiations.messages.update', { id: negotiation.id, messageId: message.id }),
  });
});

router.patch('negotiations.messages.update', '/:id/messages/:messageId', loadNegotiation, async (ctx) => {
  const { negotiation } = ctx.state;
  const message = await ctx.orm.message.findOne({
    where: { id: ctx.params.messageId },
  });
  message.negotiationId = negotiation.id;
  try {
    const { description } = ctx.request.body;
    await message.update({ description });
    ctx.redirect(ctx.router.url('negotiations.view', { id: negotiation.id }));
  } catch (validationError) {
    await ctx.render('messages/edit', {
      message,
      errors: validationError.errors,
      submitMessagePath: ctx.router.url('negotiations.messages.update', { id: negotiation.id, messageId: ctx.params.messageId }),
    });
  }
});

router.del(
  'negotiations.messages.delete', '/:id/messages/:messageId', loadNegotiation,
  async (ctx) => {
    const { negotiation } = ctx.state;
    const message = await ctx.orm.message.findOne({
      where: { id: ctx.params.messageId },
    });
    await message.destroy();
    ctx.redirect(ctx.router.url('negotiations.view', { id: negotiation.id }));
  },
);

router.del('negotiations.publication.add', '/:id/publications/:publicationId', loadNegotiation, async (ctx) => {
  const publicationNegotiation = ctx.orm.publicationNegotiation.build();
  const { negotiation } = ctx.state;
  publicationNegotiation.publicationId = ctx.params.publicationId;
  publicationNegotiation.negotiationId = negotiation.id;
  await publicationNegotiation.save();
  ctx.redirect(ctx.router.url('negotiations.view', { id: ctx.params.id }));
});

module.exports = router;
