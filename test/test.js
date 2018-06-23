const chai = require('chai');
const request = require('supertest');
const expect = chai.expect;
const assert = chai.assert;
process.env.SLACK_TOKEN = "abc";

describe('MathJax server unit tests', function() {
  it('accepts an image service', function(done) {
    var server = require('../app');
    assert.notExists(server.imageService);
    server.setImageService({});
    assert.exists(server.imageService);
    done();
  });
  it('accepts a rendering service', function(done) {
    var server = require('../app');
    assert.notExists(server.renderingService);
    server.setRenderingService({});
    assert.exists(server.renderingService);
    done();
  });
});

describe('MathJax server API integration tests', function() {
  var server;
  const imgUrl = "https://example.com/path/to/image/png";

  const createImageService = function() {
    return {
      storeCalled : false,
      storeArg : null,
      storeImage : function(arg) {
        storeCalled = true;
        storeArg = arg;
        return imgUrl;
      }
    };
  };

  const createRenderingService = function() {
    return {
      renderCalled : false,
      renderArg : null,
      render : function(arg) {
        this.renderCalled = true;
        this.renderArg = arg;
        return 'image';
      }
    };
  };

  beforeEach(function() {
    server = require('../app');
    server.setRenderingService(createRenderingService());
    server.setImageService(createImageService());
  });

  describe('AsciiMath endpoint tests', function() {
    describe('POST /api/v1/ascii/slack', function() {
      it('responds to post with JSON', function(done) {
        request(server)
            .post('/api/v1/ascii/slack')
            .expect('Content-Type', /json/, done);
      });
      it('returns error on empty request', function(done) {
        request(server)
            .post('/api/v1/ascii/slack')
            .expect(400, {error : 'request body was empty'}, done);
      });
      it('returns error when token doesn\'t match', function(done) {
        request(server)
            .post('/api/v1/ascii/slack')
            .send('token=a')
            .expect(403, {error : 'invalid token'}, done);
      });
      it('returns error message when text field is missing', function(done) {
        request(server)
            .post('/api/v1/ascii/slack')
            .send('token=abc')
            .expect(400, {error : 'missing text field in request body'}, done);
      });
      it('returns ephemeral message when text is an empty string',
         function(done) {
           request(server)
               .post('/api/v1/ascii/slack')
               .send('token=abc')
               .send('text=')
               .expect(200, {
                 response_type : "ephemeral",
                 text : 'Please provide an AsciiMath formula to render'
               },
                       done);
         });
    });
  });
});
