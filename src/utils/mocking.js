const uuidv1 = require('uuid/v1');

function mocker(mock) {
  const token = uuidv1();

  mock.onGet('/status').reply(200, {
    operating: true,
    latency: Math.floor(Math.random() * 100 + 30)
  });

  mock.onPost('/auth/validate').reply(202, {
    username: 'GalvinGao',
    token: token
  });

  mock.onPost('/settings/nickname').reply(201)

  //mock.onGet('/')
}

export default mocker
