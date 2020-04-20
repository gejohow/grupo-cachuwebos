const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function loadPublication(ctx, next) {
  ctx.state.publication = await ctx.orm.publication.findByPk(ctx.params.id);
  return next();
}

async function loadUserList(ctx, next) {
  ctx.state.userList = await ctx.orm.user.findAll();
  return next();
}

router.get('publications.list', '/', loadUserList, async (ctx) => {
  const publicationsList = await ctx.orm.publication.findAll();
  const { userList } = ctx.state;
  await ctx.render('publications/index', {
    publicationsList,
    userList,
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
    newCommentPath: ctx.router.url('publications.comments.new', { id: publication.id }),
    editCommentPath: (comment) => ctx.router.url('publications.comments.edit', { id: publication.id, commentId: comment.id }),
    deleteCommentPath: (comment) => ctx.router.url('publications.comments.delete', { id: publication.id, commentId: comment.id }),
  });
});

router.get('publications.new', '/new', loadUserList, async (ctx) => {
  const publication = ctx.orm.publication.build();
  const { userList } = ctx.state;
  await ctx.render('publications/new', {
    publication,
    userList,
    submitPublicationPath: ctx.router.url('publications.create'),
  });
});

router.post('publications.create', '/', loadUserList, async (ctx) => {
  const publication = ctx.orm.publication.build(ctx.request.body);
  const { userList } = ctx.state;
  try {
    await publication.save({ fields: ['name', 'description', 'image', 'state', 'type', 'negotiated', 'userId'] });
    ctx.redirect(ctx.router.url('publications.list'));
  } catch (validationError) {
    await ctx.render('publications/new', {
      publication,
      userList,
      errors: validationError.errors,
      submitPublicationPath: ctx.router.url('publications.create'),
    });
  }
});

router.get('publications.edit', '/:id/edit', loadPublication, async (ctx) => {
  const { publication } = ctx.state;
  const userList = await ctx.orm.user.findAll();
  await ctx.render('publications/edit', {
    publication,
    userList,
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
    const userList = await ctx.orm.user.findAll();
    await ctx.render('publications/edit', {
      publication,
      userList,
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

// comments routes:

async function loadComment(ctx, next) {
  ctx.state.comment = await ctx.orm.comment.findByPk(ctx.params.id);
  return next();
}

router.get('publications.comments.new', '/:id/comments', loadPublication, async (ctx) => {
  const comment = ctx.orm.comment.build();
  const { publication } = ctx.state;
  await ctx.render('/comments/new', {
    comment,
    publicationId: publication.id,
    submitCommentPath: ctx.router.url('publications.comments.create', { id: publication.id }),
  });
});


router.post('publications.comments.create', '/:id', loadPublication, async (ctx) => {
  const comment = ctx.orm.comment.build(ctx.request.body);
  const { publication } = ctx.state;
  comment.publicationId = publication.id;
  try {
    await comment.save({ fields: ['description', 'publicationId'] });
    ctx.redirect(ctx.router.url('publications.view', { id: publication.id }));
  } catch (validationError) {
    await ctx.render('comments/new', {
      comment,
      publicationId: publication.id,
      errors: validationError.errors,
      submitCommentPath: ctx.router.url('publications.comments.create', { id: publication.id }),
    });
  }
});

router.get('publications.comments.edit', '/:id/comments/:commentId/edit', loadPublication, async (ctx) => {
  const { publication } = ctx.state;
  const comment = await ctx.orm.comment.findOne({
    where: { id: ctx.params.commentId },
  });
  await ctx.render('comments/edit', {
    comment,
    publicationId: publication.id,
    submitCommentPath: ctx.router.url('publications.comments.update', { id: publication.id, commentId: comment.id }),
  });
});

router.patch('publications.comments.update', '/:id/comments/:commentId', loadPublication, async (ctx) => {
  const { publication } = ctx.state;
  const comment = await ctx.orm.comment.findOne({
    where: { id: ctx.params.commentId },
  });
  comment.publicationId = publication.id;
  try {
    const { description } = ctx.request.body;
    await comment.update({ description });
    ctx.redirect(ctx.router.url('publications.view', { id: publication.id }));
  } catch (validationError) {
    await ctx.render('comments/edit', {
      comment,
      errors: validationError.errors,
      submitCommentPath: ctx.router.url('publications.comments.update', { id: publication.id, commentId: ctx.params.commentId }),
    });
  }
});

router.del(
  'publications.comments.delete', '/:id/comments/:commentId', loadPublication,
  async (ctx) => {
    const { publication } = ctx.state;
    const comment = await ctx.orm.comment.findOne({
      where: { id: ctx.params.commentId },
    });
    await comment.destroy();
    ctx.redirect(ctx.router.url('publications.view', { id: publication.id }));
  },
);

module.exports = router;
