const KoaRouter = require('koa-router');

const router = KoaRouter();

async function loadUser(ctx, next) {
	ctx.state.user = await ctx.orm.user.findOne({
		where: { id: ctx.params.id },
	});
	return next();
}

router.get('users.list', '/', async (ctx) => {
	const usersList = await ctx.orm.user.findAll();
  await ctx.render('users/index', {
    usersList,
  });
});

router.get('users.view', '/:id/view', loadUser, async (ctx) => {
	const { user } = ctx.state;
	await ctx.render('users/view', {
    user,
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
  // escribir funcion hacer un const con lat y long... hacer el mimso save de favoritos
  try {
    await user.save({
      fields: [
      	'username',
        'firstname',
        'lastname',
        'password',
      ],
    });
    ctx.redirect(ctx.router.url('session.new'));
  } catch (validationError) {
    console.log(validationError);
    await ctx.render('users/new', {
      user,
      error: validationError.errors,
      submitUserPath: ctx.router.url('users.create'),
    });
  }
});

module.exports = router;