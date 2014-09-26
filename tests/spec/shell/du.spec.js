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
  
  it('should return an error if the path does not exist', function(done) {
    var fs = util.fs();
    var shell = fs.Shell();

    shell.du('/tmp/myfile.txt', function(error, sizes) {
      expect(error).to.exist;
      expect(sizes).not.to.exist;
      expect(error.code).to.equal("ENOENT");
      done();
    });
  });

 it('should return the size of a file', function(done) {
   var fs = util.fs();
   var shell = fs.Shell();

   var expected = [{path: '/nonexistantfile', size: 11}];

   fs.writeFile('/nonexistantfile', 'Hello World', function(err) {
     if(err) throw err;

     shell.du('/nonexistantfile', function(err, sizes) {
       expect(err).not.to.exist;
       expect(sizes.entries).to.deep.equal(expected);
       expect(sizes.total).to.equal(11);
       done();
     });
   });
 });


});

