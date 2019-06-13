const uuidv1 = require('uuid/v1');

function mocker(mock) {
  const token = uuidv1();

  mock.onGet('/status').reply(200, {
    operating: true,
    latency: Math.floor(Math.random() * 100 + 30)
  });

  mock.onGet('/auth/params').reply(200, {
    publicKey: "-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDlOJu6TyygqxfWT7eLtGDwajtN\nFOb9I5XRb6khyfD1Yt3YiCgQWMNW649887VGJiGr/L5i2osbl8C9+WJTeucF+S76\nxFxdU6jE0NQ+Z+zEdhUTooNRaY5nZiu5PgDB0ED/ZKBUSLKL7eibMxZtMlUDHjm4\ngwQco1KRMDSmXSMkDwIDAQAB\n-----END PUBLIC KEY-----"
  });

  mock.onPost('/auth/validate').reply(202, {
    username: 'q (mock)',
    token: token
  })

  //mock.onGet('/')
}

export default mocker
