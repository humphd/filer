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

    shell.cat(null, function(err, sizes) {
      expect(err).to.exist;
      expect(err.code).to.equal("EINVAL");
      expect(sizes).not.to.exist;
      done();
    });
  });

  it('should return 0 as the root directory size', function(done) {
    var fs = util.fs();
    var shell = fs.Shell();

    shell.du("/", function(err, sizes) {
      expect(err).not.to.exist;
      expect(sizes).to.exist;
      expect(sizes.entries).to.exist;
      expect(sizes.total).to.equal(0);
      expect(sizes.entries.length).to.equal(0);
      expect(sizes.entries).to.deep.equal([]);
      done();
    });
  });

  it('should return an error for a non-existent path', function(done) {
    var fs = util.fs();
    var shell = fs.Shell();
 
    shell.du('/file00.txt', function(err, sizes) {
      expect(err).to.exist;
      expect(err.code).to.equal('ENOENT');
      expect(sizes).not.to.exist;
      done();
    });
  });

  it('should return the total sizes of two files under root directory and each of their size', function(done) {
    var fs = util.fs();
    var shell = fs.Shell();
    var contents1 = "a";
    var contents2 = "bb";

    fs.writeFile('/file1', contents1, function(err) {
      if(err) throw err;

      fs.writeFile('/file2', contents2, function(err) {
        if(err) throw err;

        shell.du('/', function(err, sizes) {
          expect(err).not.to.exist;
          expect(sizes.total).to.equal(3);
          expect(sizes.entries.length).to.equal(2);
          expect(sizes.entries).to.deep.equal([{path:'/file1',size:1},{path:'/file2',size:2}]);
          done();
        });
      });
    });
  });

  it('should return the size of each path and the total size of all paths under a dir tree', function(done) {
    var fs = util.fs();
    var shell = fs.Shell();
    var contents = "a";
    var longcontents = "0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789";
    fs.mkdir('/dir', function(err) {
      if(err) throw err;

      fs.mkdir('/dir/dir2', function(err) {
        if(err) throw err;
        fs.writeFile('/dir/dir2/file0', longcontents, function(err) {
          if(err) throw err;
          fs.writeFile('/dir/file1', contents, function(err) {
            if(err) throw err;

            fs.writeFile('/dir/file2', contents, function(err) {
              if(err) throw err;

              shell.du('/dir', function(err, sizes) {
                expect(err).not.to.exist;
                expect(sizes.entries.length).to.equal(4);
                expect(sizes.total).to.equal(102);
                expect(sizes.entries).to.deep.equal([
                  {path:'/dir/dir2/file0',size:100},{path:'/dir/dir2',size:0},
                  {path:'/dir/file1',size:1},{path:'/dir/file2',size:1}                  
                ]);
                done();
              });
            });
          });
        });
      });
    });
  });

  it('should return the readable size of each path and the readable total size of all paths under a dir tree', function(done) {
    var fs = util.fs();
    var shell = fs.Shell();
    var contents = "a";
    var longcontents = "01234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789";
    fs.mkdir('/dir', function(err) {
      if(err) throw err;

      fs.mkdir('/dir/dir2', function(err) {
        if(err) throw err;
        fs.writeFile('/dir/dir2/file0', longcontents, function(err) {
          if(err) throw err;
          fs.writeFile('/dir/file1', contents, function(err) {
            if(err) throw err;

            fs.writeFile('/dir/file2', contents, function(err) {
              if(err) throw err;

              shell.du('/dir', { unit: true }, function(err, sizes) {
                expect(err).not.to.exist;
                expect(sizes.entries.length).to.equal(4);
                expect(sizes.total).to.equal('1 KB');
                expect(sizes.entries).to.deep.equal([
                  {path:'/dir/dir2/file0',size:'1 KB'},{path:'/dir/dir2',size:'0 Byte'},
                  {path:'/dir/file1',size:'1 Bytes'},{path:'/dir/file2',size:'1 Bytes'}                 
                ]);
                done();
              });
            });
          });
        });
      });
    });
  });
});
