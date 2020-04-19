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
    where: {userUsername: user.username},
  });
	await ctx.render('users/view', {
    user,
    editUserPath: (editedUser) => ctx.router.url('users.edit', { username: editedUser.username }),
    deleteUserPath: (deletedUser) => ctx.router.url('users.delete', { username: deletedUser.username }),
    reviewsList,
    newReviewPath: ctx.router.url('users.reviews.new', { username: user.username }),
    editReviewPath: (review) => ctx.router.url('users.reviews.edit', { username: user.username, reviewId: review.id }),
    deleteReviewPath: (review) => ctx.router.url('users.reviews.delete', { username: user.username, reviewId: review.id }),
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

router.get('users.reviews.new', '/:username/reviews', loadUser, async (ctx) => {
  const review = ctx.orm.review.build();
  const { user } = ctx.state;
  await ctx.render('reviews/new', {
    review,
    userUsername: user.username,
    submitReviewPath: ctx.router.url('users.reviews.create', { username: user.username }),
  });
});

router.post('users.reviews.create', '/:username', loadUser, async (ctx) => {
  const review = ctx.orm.review.build(ctx.request.body);
  const { user } = ctx.state;
  review.userUsername = user.username;
  try {
    await review.save({ fields: ['description', 'puntuation', 'userUsername'] });
    ctx.redirect(ctx.router.url('users.view', { username: user.username }));
  } catch (validationError) {
    await ctx.render('reviews/new', {
      review,
      userUsername: user.username,
      errors: validationError.errors,
      submitReviewPath: ctx.router.url('users.reviews.create', { username: user.username }),
    });
  }
});

router.get('users.reviews.edit', '/:username/reviews/:reviewId/edit', loadUser, async (ctx) => {
  const { user } = ctx.state;
  const review = await ctx.orm.review.findOne({
    where: { id: ctx.params.reviewId },
  });
  review.userUsername = user.username;
  await ctx.render('reviews/edit', {
    review,
    userUsername: user.username,
    submitReviewPath: ctx.router.url('users.reviews.update', { username: user.username, reviewId: review.id }),
  });
});

router.patch('users.reviews.update', '/:username/reviews/:reviewId', loadUser, async (ctx) => {
  const { user } = ctx.state;
  const review = await ctx.orm.review.findOne({
    where: { id: ctx.params.reviewId },
  });
  review.userUsername = user.username;
  try {
    const { description, puntuation } = ctx.request.body;
    await review.update({ description, puntuation });
    ctx.redirect(ctx.router.url('reviews.list'));
  } catch (validationError) {
    await ctx.render('reviews/edit', {
      review,
      errors: validationError.errors,
      submitReviewPath: ctx.router.url('users.reviews.update', { username: user.username, reviewId: ctx.params.reviewId }),
    });
  }
});

router.del('users.reviews.delete', '/:username/reviews/:reviewId', loadUser, async (ctx) => {
  const { user } = ctx.state;
  const review = await ctx.orm.review.findOne({
    where: { id: ctx.params.reviewId },
  })
  await review.destroy();
  ctx.redirect(ctx.router.url('users.view', { username: user.username }));
});

module.exports = router;