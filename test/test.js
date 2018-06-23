const chai = require('chai');
const request = require('supertest');
const expect = chai.expect;

describe('MathJax server API integration tests', function() {
  var server;
  beforeEach(function() { server = require('../app'); });

  describe('AsciiMath endpoint tests', function() {
    describe('POST /api/v1/ascii', function() {
      it('responds to post', function(done) {
        request(server).post('/api/v1/ascii').expect(200, done);
      });
    });
  });
});
