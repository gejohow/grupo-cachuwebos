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

router.get('users.view', '/:id', loadUser, async (ctx) => {
	const { user } = ctx.state;
	await ctx.render('users/view', {
    user,
  });
});

module.exports = router;