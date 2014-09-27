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
  
  it('should return an error if no path was provided', function(done){
    var fs = util.fs();
    var shell = fs.Shell();
      shell.du('', function(error, sizes) {
      expect(error).to.exist;
      expect(sizes).not.to.exist;
      expect(error.code).to.equal("EINVAL");
      done();
    });

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

   var expected = [{path: '/tmpfile', size: 11}];

   fs.writeFile('/tmpfile', 'Hello World', function(err) {
     

     shell.du('/tmpfile', function(err, sizes) {
       expect(err).not.to.exist;
       expect(sizes.entries).to.deep.equal(expected);
       expect(sizes.total).to.equal(11);
       done();
     });
   });
 });


 it('should return with an empty dir', function(done) {
   var fs = util.fs();
   var shell = fs.Shell();

   var expectedResult = [{path: '/dir1', size: 0}];

   fs.mkdir('/dir1', function(err) {
   

       shell.du('/dir1', function(err, sizes) {
       expect(err).not.to.exist;
       expect(sizes).to.exist;
       expect(sizes.entries).to.deep.equal(expectedResult);
       expect(sizes.total).to.equal(0);
       done();
    });
   });
 });


 it('should return the size of the directory', function(done) {
   var fs = util.fs();
   var shell = fs.Shell();

   var expectedResult = [{path: '/dir1/file1', size: 11},
                         {path: '/dir1', size: 11}];

   fs.mkdir('/dir1', function(err) {
   
   fs.writeFile('/dir1/file1', 'Hello World', function(err) {

       shell.du('/dir1', function(err, sizes) {
       expect(err).not.to.exist;
       expect(sizes).to.exist;
       expect(sizes.entries).to.deep.equal(expectedResult);
       expect(sizes.total).to.equal(11);
       done();
      });
    });
   });
 });


});

