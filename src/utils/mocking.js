const uuidv1 = require('uuid/v1');

function mocker(mock) {
  const token = uuidv1();

  mock.onGet('/status').reply(200, {
    operating: true,
    latency: Math.floor(Math.random() * 100 + 30)
  });

  mock.onPost('/user/login').reply(200, {
    username: 'GalvinGao',
    token: token
  });

  mock.onGet('/user/logout').reply(201);

  mock.onPost('/sponsor/order').reply(200, {
    orderId: 2019000000000001,
    qrContent: 'https://qr.alipay.com/FhfjiNFeihq9324nFh'
  });

  mock.onGet('/sponsor/order/2019000000000001/status').reply(200, {
    status: 'payed'
  });

  // mock.onPost('/auth/validate').reply(401, {
  //   code: 444
  // });

  mock.onPost('/settings/nickname').reply(201)

  //mock.onGet('/')
}

export default mocker
