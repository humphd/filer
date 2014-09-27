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

    shell.du(null, function(error, list) {
      expect(error).to.exist;
      expect(error.code).to.equal("EINVAL");
      expect(list).not.to.exist;
      done();
    });
  });

  it('should return the size of a single file', function(done) {
    var fs = util.fs();
    var shell = fs.Shell();
    var contents = "abcde";
  
    fs.writeFile('/file', contents, function(err) {
      if(err) throw err;

      shell.du('/', function(err, result) {
        expect(err).not.to.exist;
        expect(result.entries.length).to.equal(1);

        var item0 = result.entries[0];
        expect(item0.path).to.equal('file');
        expect(item0.size).to.equal(5);
        expect(result.total).to.equal(5);
        done();
      });
    });
    
  });

  it('should return the size of file2 in dir', function(done) {
    var fs = util.fs();
    var shell = fs.Shell();
    var contents1 = "abcdefg";
    fs.mkdir('/dir', function(err) {
      if(err) throw err;
      fs.writeFile('/dir/file2', contents1, function(err) {
        if(err) throw err;
        fs.writeFile('/dir/file3',contents1,function(err){
          if(err) throw err;
          shell.du('/dir', function(err, result) {
            expect(err).not.to.exist;
            expect(result.entries.length).to.equal(2);
            expect(result.total).to.equal(14);
            expect(result.entries[0].size).to.equal(7);
            expect(result.entries[1].size).to.equal(7);
          });       
        });
      });
    });
    done();
  });

  it('should return the deep contents of a dir tree sizes', function(done) {
    var fs = util.fs();
    var shell = fs.Shell();
    var contents = "abc";

    fs.mkdir('/dir1', function(err) {
      if(err) throw err;

      fs.mkdir('/dir1/dir2', function(err) {
        if(err) throw err;

        fs.writeFile('/dir1/dir2/file1', contents, function(err) {
          if(err) throw err;

          fs.writeFile('/dir1/file2', contents, function(err) {
            if(err) throw err;

            fs.writeFile('/dir1/file3', contents, function(err) {
              if(err) throw err;

              shell.du('/dir1', function(err, result) {
                expect(err).not.to.exist;
                expect(result.entries.length).to.equal(4);
                expect(result.total).to.equal(9);
                expect(result.entries[0].path).to.equal('file1');
                expect(result.entries[1].path).to.equal('dir2');
                expect(result.entries[2].path).to.equal('file2');
                expect(result.entries[3].path).to.equal('file3');
                done();
              });
            });
          });
        });
      });
    });
  });

});
