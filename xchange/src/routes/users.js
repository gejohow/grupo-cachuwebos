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
    newUserPath: ctx.router.url('users.new'),
    editUserPath: (user) => ctx.router.url('users.edit', { id: user.id }),
    deleteUserPath: (user) => ctx.router.url('users.delete', { id: user.id }),
    viewUserPath: (user) => ctx.router.url('users.view', { id: user.id }),
  });
});


router.get('users.view', '/:id/view', loadUser, async (ctx) => {
	const { user } = ctx.state;
	await ctx.render('users/view', {
    user,
    editUserPath: (editedUser) => ctx.router.url('users.edit', { id: editedUser.id }),
    deleteUserPath: (deletedUser) => ctx.router.url('users.delete', { id: deletedUser.id }),
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

router.get('users.edit', '/:id/edit', loadUser, async (ctx) => {
  const { user } = ctx.state;
  await ctx.render('users/edit', {
    user,
    submitUserPath: ctx.router.url('users.update', { id: user.id }),
  });
});

router.patch('users.update', '/:id', loadUser, async (ctx) => {
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
      submitUserPath: ctx.router.url('users.update', { id: user.id }),
    });
  }
});

router.del('users.delete', '/:id', loadUser, async (ctx) => {
  const { user } = ctx.state;
  await user.destroy();
  ctx.redirect(ctx.router.url('users.list'));
});


module.exports = router;