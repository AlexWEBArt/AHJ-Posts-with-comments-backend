const http = require('http');
const path = require('path');
const fs = require('fs');
const Koa = require('koa');
const koaBody = require('koa-body');
const koaStatic = require('koa-static');
const uuid = require('uuid');
const app = new Koa();

const { createRandomPost } = require('./js/fakerPosts');
const { createRandomComments } = require('./js/fakerPosts');

const public = path.join(__dirname, '/public')
app.use(koaStatic(public));

app.use(async (ctx, next) => {
  const origin = ctx.request.get('Origin');
  if (!origin) {
    return await next();
  }

  const headers = {'Access-Control-Allow-Origin': '*', };

  if (ctx.request.method !== 'OPTIONS') {
    ctx.response.set({...headers});
    try {
      return await next();
    } catch (e) {
      e.headers = {...e.headers, ...headers};
      throw e;
    }
  }

  if (ctx.request.get('Access-Control-Request-Method')) {
    ctx.response.set({
      ...headers,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH',
    });
    
    if (ctx.request.get('Access-Control-Request-Headers')) {
      ctx.response.set('Access-Control-Allow-Headers', ctx.request.get('Access-Control-Request-Headers'))
    }
    
    ctx.response.status = 204;  
  }
});

app.use(koaBody({
  text: true,
  urlencoded: true,
  miltipart: true,
  json: true,
}));

const Router = require('koa-router');
const router = new Router();

const usersPosts = [];

router.get('/posts/latest', async (ctx, next) => {

  Array.from({ length: 1 }).forEach(() => {
    usersPosts.push(createRandomPost());
  });

  const {id, authorId, title, author, avatar, image, created} = usersPosts[usersPosts.length - 1]

  const responseMessage = {
    "status": "ok",
    "data": [{
      id,
      authorId,
      title,
      author,
      avatar,
      image,
      created,
    }]
  }

  ctx.response.body = responseMessage;
  
  next();
});

router.get('/posts/comments/latest', async (ctx, next) => {
  const id = ctx.request.query.id;

  const reqestPost = usersPosts.filter(item => item.id !== id);
  reqestPost.comments = [];
  
  Array.from({ length: 1 }).forEach(() => {
    reqestPost.comments.push(createRandomComments(reqestPost.id));
  });

  const responseMessage = {
    "status": "ok",
    "data": reqestPost.comments
  }

  ctx.response.body = responseMessage;
  
  next();
});

app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 7071;
const server = http.createServer(app.callback())

server.listen(port, (err) => {
  if (err) {
    console.log(err);

    return;
  }
  console.log('Server is listening to ' + port);
});;
