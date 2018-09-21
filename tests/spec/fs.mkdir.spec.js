var util = require('../lib/test-utils.js');
var expect = require('chai').expect;

describe('fs.mkdir', function() {
  beforeEach(util.setup);
  afterEach(util.cleanup);

  it('should be a function', function() {
    var fs = util.fs();
    expect(fs.mkdir).to.be.a('function');
  });

  it('should return an error if part of the parent path does not exist', function(done) {
    var fs = util.fs();

    fs.mkdir('/tmp/mydir', function(error) {
      expect(error).to.exist;
      expect(error.code).to.equal('ENOENT');
      done();
    });
  });

  it('should create a dir if passed a mode only (recursive:false default) and path does not include a parent', function(done) {
    var fs = util.fs();

    fs.mkdir('/tmp', '777', function(error) {
      expect(error).not.to.exist;

      fs.stat('/tmp', function(error, stats) {
        expect(error).not.to.exist;
        expect(stats).to.exist;
        expect(stats.type).to.equal('DIRECTORY');

        done();
      });
    });
  });

  it('should return an error if passed a mode only (recursive:false default) and path includes parent that does not exist', function(done) {
    var fs = util.fs();

    fs.mkdir('/tmp/mydir', '777', function(error) {
      expect(error).to.exist;
      expect(error.code).to.equal('ENOENT');
      done();
    });
  });

  it('(promises) should return an error if passed a mode only (recursive:false default) and path includes parent that does not exist', function() {
    var fsPromises = util.fs().promises;

    return fsPromises
      .mkdir('/tmp/mydir', '777')
      .then(() => {
        expect.fail('This should not happen');
      })
      .catch(function(error) {
        expect(error).to.exist;
        expect(error.code).to.equal('ENOENT');  
      });
  });



  it('should create parent dir parts if recursive:true is set options', function(done) {
    var fs = util.fs();

    fs.mkdir('/tmp/mydir', {recursive: true}, function(error) {
      expect(error).not.to.exist;

      fs.stat('/tmp', function(error, stats) {
        expect(error).not.to.exist;
        expect(stats).to.exist;
        expect(stats.type).to.equal('DIRECTORY');

        fs.stat('/tmp/mydir', function(error, stats) {
          expect(error).not.to.exist;
          expect(stats).to.exist;
          expect(stats.type).to.equal('DIRECTORY');
          done();
        });
      });
    });
  });

  it('should return an error if the path already exists', function(done) {
    var fs = util.fs();

    fs.mkdir('/', function(error) {
      expect(error).to.exist;
      expect(error.code).to.equal('EEXIST');
      done();
    });
  });

  it('should make a new directory', function(done) {
    var fs = util.fs();

    fs.mkdir('/tmp', function(error) {
      expect(error).not.to.exist;
      if(error) throw error;

      fs.stat('/tmp', function(error, stats) {
        expect(error).not.to.exist;
        expect(stats).to.exist;
        expect(stats.type).to.equal('DIRECTORY');
        done();
      });
    });
  });
});
