'use strict';

let request = require('supertest'),
    should = require('should'),
    server, app;

describe('loading express', () => {
  beforeEach( () => {
    app = require('../app');
    server = app.listen(3000);
  });
  afterEach( done => {
    server.close(done);
  });
  it('responds to /', function testSlash(done) {
  request(server)
    .get('/')
    .expect(200, done);
  });
  it('404 everything else', function testPath(done) {
    request(server)
      .get('/foo/bar')
      .expect(404, done);
  });
});

describe('upload', () =>  {
    it('a file to validate IP\'s', done => {
      request(server)
        .post('/')
        .attach('fileUpload', './spec/ip_validate.txt')
        .expect(200, done);
    });
});