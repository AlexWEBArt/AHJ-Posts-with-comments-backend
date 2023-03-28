const { faker } = require('@faker-js/faker');
const uuid = require('uuid');

function createRandomComments(postId) {
  return {
    id: faker.datatype.uuid(),
    postId: postId,
    authorId: faker.datatype.uuid(),
    author: faker.internet.userName(),
    avatar: faker.image.avatar(),
    content: faker.lorem.paragraph(),
    created: Date.now() + Number(60000)
  };
}

function createRandomPost() {
  return {
    id: faker.datatype.uuid(),
    authorId: faker.datatype.uuid(),
    title: faker.word.adjective(),
    author: faker.internet.userName(),
    avatar: faker.image.avatar(),
    image: faker.image.cats(),
    created: Date.now(),
  };
}

// setInterval(() => {
//     Array.from({ length: 1 }).forEach(() => {
//       usersPosts.push(createRandomPost());
//     });
// }, 10000)


module.exports = { createRandomPost, createRandomComments };
// module.exports = createRandomComments;