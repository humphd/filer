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

  it('should return size of a given file', function(done) {
    var fs = util.fs();
    var shell = fs.Shell();

    fs.writeFile('/file', 'New file', function(err) {
      if(err) throw err;

      shell.du('/file', function(err, sizes) {
        expect(err).not.to.exist;
        expect(sizes.total).to.equal(8);
        done();
      });
    });
  });
  
  it('should return size 0 for an empty directory', function(done) {
    var fs = util.fs();
    var shell = fs.Shell();

    fs.mkdir('/dir', 'New dir.', function(err) {
      if(err) throw err;

      shell.du('/dir', function(err, sizes) {
        expect(err).not.to.exist;
        expect(sizes).to.exist;
        expect(sizes.total).to.equal(0);
        done();
      });
    });
  });
  
  it('should return an error for an invalid path', function(done) {
    var shell = util.fs().Shell();

    shell.du('/file1.cpp', function(err, sizes) {
      expect(err).to.exist;
      expect(err.code).to.equal('ENOENT');
      expect(sizes).not.to.exist;
      done();
    });
  });
  
  it('should fail when argument is absent', function(done) {
    var fs = util.fs();
    var shell = fs.Shell();

    shell.du(null, function(error, arg) {
      expect(error).to.exist;
      expect(error.code).to.equal("EINVAL");
      expect(arg).not.to.exist;
      done();
    });
  });
  
  it('should return sizes in a nested file system structure', function(done) {
    var fs = util.fs();
    var shell = fs.Shell();

    fs.mkdir('/dir1', function(err) {
      if(err) throw err;
      fs.mkdir('/dir2', function(err) {
        if(err) throw err;
        shell.mkdirp('/dir3/dir4', function(err) {
          if(err) throw err;
		  fs.writeFile('/dir1/file1', 'New file', function(err) {
            if(err) throw err;
            fs.symlink('/dir1/file1', '/dir2/link1', function(err) {
              if(err) throw err;
              fs.writeFile('/dir2/file2', 'Another new file', function(err) {
                if(err) throw err;
		        shell.du('/', function(err, sizes) {
                  expect(err).not.to.exist;
                  expect(sizes).to.exist;
                  expect(sizes.total).to.equal(35);
                  done();
                });
              });
            });
          });
        });  
      });
    });
  });

  it('should return  size of a symbolic link for a file', function(done) {
    var fs = util.fs();
    var shell = fs.Shell();

    fs.writeFile('/file', 'New file.', function(err) {
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
  
  it('should return  size of a symbolic link for a dir', function(done) {
    var fs = util.fs();
    var shell = fs.Shell();

    fs.mkdir('/dir1', function(err) {
      if(err) throw err;

      fs.symlink('/dir123', '/newlink', function(err) {
        if(err) throw err;

        shell.du('/newlink', function(err, sizes) {
          expect(err).not.to.exist;
          expect(sizes).to.exist;
          expect(sizes.total).to.equal(7);
          done();
        });
      });
    });
  });
});
