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
  
  it('should return an error if the file does not exist', function(done) {
    var fs = util.fs();
    var shell = fs.Shell();

    shell.du('/tmp/myfile.txt', function(error, sizes) {
      expect(error).to.exist;
      expect(sizes).not.to.exist;
      expect(error.code).to.equal("ENOENT");
      done();
    });
  });

  /* Not yet implemented
  it('should return an error if the path does not exist', function(done) {
    var fs = util.fs();

    fs.du('/tmp/mydir', function(error, files) {
      expect(error).to.exist;
      expect(error.code).to.equal("ENOENT");
      expect(files).not.to.exist;
      done();
    });
  });
  */
});