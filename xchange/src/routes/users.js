const KoaRouter = require('koa-router');

const router = KoaRouter();

async function loadUser(ctx, next) {
	ctx.state.user = await ctx.orm.user.findOne({
		where: { username: ctx.params.username },
	});
	return next();
}

router.get('users.list', '/', async (ctx) => {
	const usersList = await ctx.orm.user.findAll();
  await ctx.render('users/index', {
    usersList,
    newUserPath: ctx.router.url('users.new'),
    editUserPath: (user) => ctx.router.url('users.edit', { username: user.username }),
    deleteUserPath: (user) => ctx.router.url('users.delete', { username: user.username }),
    viewUserPath: (user) => ctx.router.url('users.view', { username: user.username }),
  });
});


router.get('users.view', '/:username/view', loadUser, async (ctx) => {
	const { user } = ctx.state;
  const reviewsList = ctx.orm.review.findAll({
    where: {userId: user.id},
  });
	await ctx.render('users/view', {
    user,
    editUserPath: (editedUser) => ctx.router.url('users.edit', { username: editedUser.username }),
    deleteUserPath: (deletedUser) => ctx.router.url('users.delete', { username: deletedUser.username }),
    reviewsList,
    newReviewPath: ctx.router.url('users.reviews.new', { id: user.id }),
    editReviewPath: (review) => ctx.router.url('users.reviews.edit', { id: user.id, reviewId: review.id }),
    deleteReviewPath: (review) => ctx.router.url('users.reviews.delete', { id: user.id, reviewId: review.id }),
  });
});


router.get('users.new', '/new', async (ctx) => {
	const user = await ctx.orm.user.build();
  await ctx.render('users/new', {
    user,
    submitUserPath: ctx.router.url('users.create'),
  });
});

router.post('users.create', '/', async (ctx) => {
  const user = ctx.orm.user.build(ctx.request.body);
  try {
    await user.save({
      fields: [
      	'username',
        'firstName',
        'lastName',
        'password',
      ],
    });
    ctx.redirect(ctx.router.url('users.list'));
  } catch (validationError) {
    console.log(validationError);
    await ctx.render('users/new', {
      user,
      error: validationError.errors,
      submitUserPath: ctx.router.url('users.create'),
    });
  }
});

router.get('users.edit', '/:username/edit', loadUser, async (ctx) => {
  const { user } = ctx.state;
  await ctx.render('users/edit', {
    user,
    submitUserPath: ctx.router.url('users.update', { username: user.username }),
  });
});

router.patch('users.update', '/:username', loadUser, async (ctx) => {
  const { user } = ctx.state;
  try {
    const {
      username, firstName, lastName, password,
    } = ctx.request.body;
    await user.update({
      username, firstName, lastName, password,
    });
    ctx.redirect(ctx.router.url('users.list'));
  } catch (validationError) {
    await ctx.render('users/edit', {
      user,
      errors: validationError.errors,
      submitUserPath: ctx.router.url('users.update', { username: user.username }),
    });
  }
});

router.del('users.delete', '/:username', loadUser, async (ctx) => {
  const { user } = ctx.state;
  await user.destroy();
  ctx.redirect(ctx.router.url('users.list'));
});


// Reviews routes:

async function loadReview(ctx, next) {
  ctx.state.review = await ctx.orm.review.findByPk(ctx.params.id);
  return next();
}

router.get('reviews.list', '/', async (ctx) => {
  const reviewsList = await ctx.orm.review.findAll();
  await ctx.render('reviews/index', {
    reviewsList,
    newReviewPath: ctx.router.url('reviews.new'),
    editReviewPath: (review) => ctx.router.url('reviews.edit', { id: review.id }),
    deleteReviewPath: (review) => ctx.router.url('reviews.delete', { id: review.id }),
  });
});

router.get('users.reviews.new', '/:id/reviews', loadUser, async (ctx) => {
  const review = ctx.orm.review.build();
  const { user } = ctx.state;
  await ctx.render('reviews/new', {
    review,
    userId: user.id,
    submitReviewPath: ctx.router.url('users.reviews.create', { id: user.id }),
  });
});

router.post('users.reviews.create', '/:id', loadUser, async (ctx) => {
  const review = ctx.orm.review.build(ctx.request.body);
  const { user } = ctx.state;
  review.userId = user.id;
  try {
    await review.save({ fields: ['description', 'puntuation', 'userId'] });
    ctx.redirect(ctx.router.url('users.view', { id: user.id }));
  } catch (validationError) {
    await ctx.render('reviews/new', {
      review,
      userId: user.id,
      errors: validationError.errors,
      submitReviewPath: ctx.router.url('users.reviews.create', { id: user.id }),
    });
  }
});

router.get('users.reviews.edit', '/:id/reviews/:reviewId/edit', loadUser, async (ctx) => {
  const { user } = ctx.state;
  const review = await ctx.orm.review.findOne({
    where: { id: ctx.params.reviewId },
  });
  review.userId = user.id;
  await ctx.render('reviews/edit', {
    review,
    userId: user.id,
    submitReviewPath: ctx.router.url('users.reviews.update', { id: user.id, reviewId: review.id }),
  });
});

router.patch('users.reviews.update', '/:id/reviews/:reviewId', loadUser, async (ctx) => {
  const { user } = ctx.state;
  const review = await ctx.orm.review.findOne({
    where: { id: ctx.params.reviewId },
  });
  review.userId = user.id;
  try {
    const { description, puntuation } = ctx.request.body;
    await review.update({ description, puntuation });
    ctx.redirect(ctx.router.url('reviews.list'));
  } catch (validationError) {
    await ctx.render('reviews/edit', {
      review,
      errors: validationError.errors,
      submitReviewPath: ctx.router.url('users.reviews.update', { id: user.id, reviewId: ctx.params.reviewId }),
    });
  }
});

router.del('users.reviews.delete', '/:id/reviews/:reviewId', loadUser, async (ctx) => {
  const { user } = ctx.state;
  const review = await ctx.orm.review.findOne({
    where: { id: ctx.params.reviewId },
  })
  await review.destroy();
  ctx.redirect(ctx.router.url('users.view', { id: user.id }));
});

module.exports = router;