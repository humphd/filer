var Filer = require('../../..');
var util = require('../../lib/test-utils.js');
var expect = require('chai').expect;

describe('FileSystemShell.du', function() 
{
  beforeEach(util.setup);
  afterEach(util.cleanup);

  it('should be a function', function() 
  {
    var shell = util.shell();
    expect(shell.du).to.be.a('function');
  });

  it('should fail when du`s argument is absent', function(done) 
  {
    var fs = util.fs();
    var shell = util.shell();

    shell.du(null, function(error, sizes) 
	{
      expect(error).to.exist;
      expect(error.code).to.equal("EINVAL");
      expect(sizes).not.to.exist;
      done();
    });
  });
  
  it('should return file size', function(done)	
  {
   var fs = util.fs();
   var shell = util.shell();

	// Example 1: du called on a file (or symlink'ed file) path
	fs.writeFile ('/testFile1', "13 characters", function(err){
	if(err) throw err;
		
	  shell.du('/testFile1', function(err, sizes) {
		expect(err).not.to.exist;
		expect(sizes.total).to.equal(13);		
		done();			
	  });
	});
  });
  it('should return 0 for an empty dir', function(done) 
  {
    var shell = util.shell();
    var fs = util.fs();
	
	fs.mkdir('/dir', 'new dir', function(err) 	{
	  if(err) throw err;
		
	  shell.du('/dir', function(err, sizes)
	  {
	  expect(err).not.to.exist;
	  expect(sizes).to.exist;
	  expect(sizes.total).to.equal(0);
	  done();
	  });
	});
  });
  
  it('should return dir and child dir with size 0 ', function(done) 
  {
    var shell = util.shell();
    var fs = util.fs();
	
	shell.mkdirp('/dir1/dir2', function(err) {
	  if(err) throw err;{
	    shell.du('/dir1', function(err, sizes){
		  expect(err).not.to.exist;
		  expect(sizes).to.exist;
		  expect(sizes.total).to.equal(0);
		  done();
		});
	  };
	});
  });
  
  it('should return the size of nested directory', function(done) 
  {
    var shell = util.shell();
    var fs = util.fs();
	
	shell.mkdirp('/dir1/dir2', function(err) {
	  if(err) throw err;
		
	  fs.writeFile ('/dir1/dir2/testFile1', "13 characters", function(err)
	  {
	    shell.du('/dir1', function(err, sizes)
		{
		  expect(err).not.to.exist;
		  expect(sizes).to.exist;
		  expect(sizes.total).to.equal(13);
		  done();
		});
	  });
	});
  });
  
  it('should return the size of a symbolic link', function(done) 
  {
    var fs = util.fs();
    var shell = util.shell();

    fs.writeFile('/file', 'Big new file has more than 8 characters.', function(err) {
      if(err) throw err;

      fs.symlink('/file', '/newlink', function(err) {
        if(err) throw err;

        shell.du('/newlink', function(err, sizes) {
          expect(err).not.to.exist;
          expect(sizes).to.exist;
          expect(sizes.total).to.equal(5);
          done();
        });
      });
    });
   });
  
  it('should return the size of a symbolic link to a directory', function(done) 
  {
    var fs = util.fs();
    var shell = util.shell();

    fs.mkdir('/dir1', function(err) {
      if(err) throw err;

      fs.symlink('/dir1', '/newlink', function(err) {
        if(err) throw err;

        shell.du('/newlink', function(err, sizes) {
          expect(err).not.to.exist;
          expect(sizes).to.exist;
          expect(sizes.total).to.equal(5);
          done();
        });
      });
    });
  });
 });
