var Filer = require('../../..');
var util = require('../../lib/test-utils.js');
var expect = require('chai').expect;

describe('FileSystemShell.du', function() {
  beforeEach(util.setup);
  afterEach(util.cleanup);

  function duAssertions(err, sizes, expectedSizes, expectedTotal, done) {
    done = done || function() {};
    expect(err).not.to.exist;
    expect(sizes).to.exist;
    expect(sizes.entries).to.deep.equal(expectedSizes);
    expect(sizes.total).to.equal(expectedTotal);
    done();
  }

  it('should be a function', function() {
    var shell = util.shell();
    expect(shell.du).to.be.a('function');
  });

  it('should fail when no path is passed in', function(done) {
    var shell = util.shell();

    shell.du(null, function(err, sizes) {
      expect(err).to.exist;
      expect(err.code).to.equal('EINVAL');
      expect(sizes).not.to.exist;
      done();
    });
  });

  it('should return the size of the root node as 0', function(done) {
    var shell = util.fs().Shell();
    var expectedResult = [{path: '/', size: 0}]

    shell.du('/', function(err, sizes) {
      duAssertions(err, sizes, expectedResult, 0, done);
    });
  });

  it('should return and error for a non-existent path', function(done) {
    var shell = util.fs().Shell();

    shell.du('/file1.txt', function(err, sizes) {
      expect(err).to.exist;
      expect(err.code).to.equal('ENOENT');
      expect(sizes).not.to.exist;
      done();
    });
  });

  it('should return the size of a file', function(done) {
    var fs = util.fs();
    var shell = fs.Shell();
    var expectedResult = [{path: '/file1', size: 15}];

    fs.writeFile('/file1', 'This is a file.', function(err) {
      if(err) throw err;

      shell.du('/file1', function(err, sizes) {
        duAssertions(err, sizes, expectedResult, 15, done);
      });
    });
  });

  it('should return the size of a symlink', function(done) {
    var fs = util.fs();
    var shell = fs.Shell();
    // The size will be the size of the data contained in
    // the sy,link which is the path referenced by it
    var expectedResult = [{path: '/link1', size: 6}];

    fs.writeFile('/file1', 'This is a file.', function(err) {
      if(err) throw err;

      fs.symlink('/file1', '/link1', function(err) {
        if(err) throw err;

        shell.du('/link1', function(err, sizes) {
          duAssertions(err, sizes, expectedResult, 6, done);
        });
      });
    });
  });

  it('should return the size of the file referenced by the symlink when `links=true` is passed in', function(done) {
    var fs = util.fs();
    var shell = fs.Shell();
    var expectedResult = [{path: '/link1', size: 15}];

    fs.writeFile('/file1', 'This is a file.', function(err) {
      if(err) throw err;

      fs.symlink('/file1', '/link1', function(err) {
        if(err) throw err;

        shell.du('/link1', {links: true}, function(err, sizes) {
          duAssertions(err, sizes, expectedResult, 15, done);
        });
      });
    });
  });

  it('should return size 0 for an empty directory', function(done) {
    var fs = util.fs();
    var shell = fs.Shell();
    var expectedResult = [{path: '/dir1', size: 0}];

    fs.mkdir('/dir1', function(err) {
      if(err) throw err;

      shell.du('/dir1', function(err, sizes) {
        duAssertions(err, sizes, expectedResult, 0, done);
      });
    });
  });

  it('should return the size of the contents of a non-empty directory', function(done) {
    var fs = util.fs();
    var shell = fs.Shell();
    var expectedResult = [{path: '/dir1/file1', size: 15},
                          {path: '/dir1', size: 15}];

    fs.mkdir('/dir1', function(err) {
      if(err) throw err;

      fs.writeFile('/dir1/file1', 'This is a file.', function(err) {
        if(err) throw err;

        shell.du('/dir1', function(err, sizes) {
          duAssertions(err, sizes, expectedResult, 15, done);
        });
      });
    });
  });

  it('should return sizes in kb when passed the `kb` format', function(done) {
    var fs = util.fs();
    var shell = fs.Shell();
    var expectedResult = [{path: '/dir1/file1', size: 0.015},
                          {path: '/dir1', size: 0.015}];
    
    fs.mkdir('/dir1', function(err) {
      if(err) throw err;

      fs.writeFile('/dir1/file1', 'This is a file.', function(err) {
        if(err) throw err;

        shell.du('/dir1', {format: 'kb'}, function(err, sizes) {
          duAssertions(err, sizes, expectedResult, 0.015, done);
        });
      });
    });
  });

  it('should return sizes in mb when passed the `mb` format', function(done) {
    var fs = util.fs();
    var shell = fs.Shell();
    var expectedResult = [{path: '/dir1/file1', size: 0.000015},
                          {path: '/dir1', size: 0.000015}];
    
    fs.mkdir('/dir1', function(err) {
      if(err) throw err;

      fs.writeFile('/dir1/file1', 'This is a file.', function(err) {
        if(err) throw err;

        shell.du('/dir1', {format: 'mb'}, function(err, sizes) {
          duAssertions(err, sizes, expectedResult, 0.000015, done);
        });
      });
    });
  });

  it('should return sizes in gb when passed the `gb` format', function(done) {
    var fs = util.fs();
    var shell = fs.Shell();
    var expectedResult = [{path: '/dir1/file1', size: 0.000000015},
                          {path: '/dir1', size: 0.000000015}];
    
    fs.mkdir('/dir1', function(err) {
      if(err) throw err;

      fs.writeFile('/dir1/file1', 'This is a file.', function(err) {
        if(err) throw err;

        shell.du('/dir1', {format: 'gb'}, function(err, sizes) {
          duAssertions(err, sizes, expectedResult, 0.000000015, done);
        });
      });
    });
  });

  it('should return sizes in a nested filesystem structure', function(done) {
    var fs = util.fs();
    var shell = fs.Shell();
    var expectedResult = [{path: '/dir1/file1', size: 15},
                          {path: '/dir1', size: 15},
                          {path: '/dir2/link1', size: 11},
                          {path: '/dir2/file2', size: 21},
                          {path: '/dir2', size: 32},
                          {path: '/dir3/dir4', size: 0},
                          {path: '/dir3', size: 0},
                          {path: '/', size: 47}];

    function createFilesAndLinks(callback) {
      fs.writeFile('/dir1/file1', 'This is a file.', function(err) {
        if(err) throw err;
        fs.symlink('/dir1/file1', '/dir2/link1', function(err) {
          if(err) throw err;
          fs.writeFile('/dir2/file2', 'This is another file.', function(err) {
            if(err) throw err;
            callback();
          });
        });
      });
    }

    function createDirectories(callback) {
      fs.mkdir('/dir1', function(err) {
        if(err) throw err;
        fs.mkdir('/dir2', function(err) {
          if(err) throw err;
          shell.mkdirp('/dir3/dir4', function(err) {
            if(err) throw err;
            callback();
          });
        });
      });
    }

    createDirectories(function() {
      createFilesAndLinks(function() {
        shell.du('/', function(err, sizes) {
          duAssertions(err, sizes, expectedResult, 47, done);
        });
      });
    });
  });
});
