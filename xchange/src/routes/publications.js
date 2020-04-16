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
  const commentsList = await ctx.orm.comment.findAll({
    where: { publicationId: publication.id },
  });
  await ctx.render('publications/view', {
    publication,
    editPublicationPath: (editedPublication) => ctx.router.url('publications.edit', { id: editedPublication.id }),
    deletePublicationPath: (deletedPublication) => ctx.router.url('publications.delete', { id: deletedPublication.id }),
    commentsList,
    newCommentPath: ctx.router.url('comments.new'),
    editCommentPath: (comment) => ctx.router.url('comments.edit', { id: comment.id }),
    deleteCommentPath: (comment) => ctx.router.url('comments.delete', { id: comment.id }),
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

//comments routes:

async function loadComment(ctx, next) {
  ctx.state.comment = await ctx.orm.comment.findByPk(ctx.params.id);
  return next();
}


router.get('publications.comments.new', '/:id/comments/new',loadPublication, async (ctx) => {
  const comment = ctx.orm.comment.build();
  const { publication } = ctx.state;
  await ctx.render('/:id/comments/new', {
    comment,
    submitCommentPath: ctx.router.url('comments.create'),
  });
});

router.post('publications.comments.create', '/', async (ctx) => {
  const comment = ctx.orm.comment.build(ctx.request.body);
  try {
    await comment.save({ fields: ['description'] });
    ctx.redirect(ctx.router.url('comments.list'));
  } catch (validationError) {
    await ctx.render('comments/new', {
      comment,
      errors: validationError.errors,
      submitCommentPath: ctx.router.url('comments.create'),
    });
  }
});

router.get('comments.edit', '/:id/edit', loadComment, async (ctx) => {
  const { comment } = ctx.state;
  await ctx.render('comments/edit', {
    comment,
    submitCommentPath: ctx.router.url('comments.update', { id: comment.id }),
  });
});

router.patch('comments.update', '/:id', loadComment, async (ctx) => {
  const { comment } = ctx.state;
  try {
    const { description } = ctx.request.body;
    await comment.update({ description });
    ctx.redirect(ctx.router.url('comments.list'));
  } catch (validationError) {
    await ctx.render('comments/edit', {
      comment,
      errors: validationError.errors,
      submitCommentPath: ctx.router.url('comments.update', { id: comment.id }),
    });
  }
});

router.del('comments.delete', '/:id', loadComment, async (ctx) => {
  const { comment } = ctx.state;
  await comment.destroy();
  ctx.redirect(ctx.router.url('comments.list'));
});


module.exports = router;
