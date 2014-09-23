var Filer = require('../../..');
var util = require('../../lib/test-utils.js');
var expect = require('chai').expect;

describe('FileSystemShell.du', function() {
  beforeEach(util.setup);
  afterEach(util.cleanup);

  it('should be a function', function() {
    var shell = util.shell();
    expect(shell.du).to.be.a('function');
  });

  it('should fail when dirs argument is absent', function(done) {
    var fs = util.fs();
    var shell = fs.Shell();

    shell.cat(null, function(error, list) {
      expect(error).to.exist;
      expect(error.code).to.equal("EINVAL");
      expect(list).not.to.exist;
      done();
    });
  });

  it('should return the contents of a simple dir', function(done) {
    var fs = util.fs();
    var shell = fs.Shell();
    var contents = "a";
    var contents2 = "bb";

    fs.writeFile('/file', contents, function(err) {
      if(err) throw err;

      fs.writeFile('/file2', contents2, function(err) {
        if(err) throw err;

        shell.du('/', function(err, list) {
          expect(err).not.to.exist;
          expect(list.length).to.equal(2);

          var item0 = list[0];
          expect(item0.filepath).to.equal('file');
          expect(item0.size).to.equal(1);

          var item1 = list[1];
          expect(item1.filepath).to.equal('file2');
          expect(item1.size).to.equal(2);

          done();
        });
      });
    });
  });

  it('should return the contents of a simple dir', function(done) {
    var fs = util.fs();
    var shell = fs.Shell();
    var contents = "a";
    var contents2 = "bb";

    fs.writeFile('/file', contents, function(err) {
      if(err) throw err;

      fs.writeFile('/file2', contents2, function(err) {
        if(err) throw err;

        shell.du('/', function(err, list) {
          expect(err).not.to.exist;
          expect(list.length).to.equal(2);

          var item0 = list[0];
          expect(item0.filepath).to.equal('file');
          expect(item0.size).to.equal(1);

          var item1 = list[1];
          expect(item1.filepath).to.equal('file2');
          expect(item1.size).to.equal(2);

          done();
        });
      });
    });
  });

});
