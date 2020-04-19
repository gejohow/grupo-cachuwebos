const KoaRouter = require('koa-router');
const pkg = require('../../package.json');

const router = new KoaRouter();

router.get('/', async (ctx) => {
  const publications = await ctx.orm.publication.findAll();
  await ctx.render('index', {
    appVersion: pkg.version,
    publications,
    viewPublicationPath: (publication) => ctx.router.url('publications.view', { id: publication.id }),
    PublicationsPath: ctx.router.url('publications.list'),
    newPublicationPath: ctx.router.url('publications.new'),
  });
});

module.exports = router;
