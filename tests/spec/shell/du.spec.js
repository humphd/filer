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

  it('should return sum total of all sizes for all files in directory recursively', function(done) {
    var fs = util.fs();
    var shell = fs.Shell();

    var contents = "a";
    var contents2 = "bb";
    var contents3 = "ccc";
    var contents4 = "dddd";
    var contents5 = "eeeee";

    fs.mkdir('/dir', function(err) {
      if(err) throw err;

      fs.writeFile('/file', contents, function(err) {
        if(err) throw err;

        fs.writeFile('/file2', contents2, function(err) {
          if(err) throw err;

          fs.mkdir('/dir/dir2', function(err) {
            if(err) throw err;

            fs.writeFile('/dir/dir2/file3', contents3, function(err) {
              if(err) throw err;

              fs.writeFile('/dir/dir2/file4', contents4, function(err) {
                if(err) throw err;

                fs.mkdir('/dir/dir2/dir3', function(err) {
                  if(err) throw err;

                  fs.writeFile('/dir/dir2/dir3/file5', contents5, function(err) {
                    if(err) throw err;
                    shell.du('/', function(err, list) {
                      expect(err).not.to.exist;

                      expect(list.total).to.equal(15);

                      expect(list.entries.length).to.equal(9);

                      expect(list.entries[0].path).to.equal('/');

                      expect(list.entries[1].path).to.equal('/dir/dir2/file3');
                      expect(list.entries[1].size).to.equal(3);

                      expect(list.entries[2].path).to.equal('/dir/dir2/file4');
                      expect(list.entries[2].size).to.equal(4);

                      expect(list.entries[3].path).to.equal('/dir/dir2/dir3/file5');
                      expect(list.entries[3].size).to.equal(5);

                      expect(list.entries[4].path).to.equal('/dir/dir2/dir3');

                      expect(list.entries[5].path).to.equal('/dir/dir2');

                      expect(list.entries[6].path).to.equal('/dir');

                      expect(list.entries[7].path).to.equal('/file');
                      expect(list.entries[7].size).to.equal(1);

                      expect(list.entries[8].path).to.equal('/file2');
                      expect(list.entries[8].size).to.equal(2);

                      done();
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });

  it('should return depth-first list of all entries in the directory followed by the directory itself', function(done) {
    var fs = util.fs();
    var shell = fs.Shell();

    var contents = "a";

    fs.mkdir('/dir', function(err) {
      if(err) throw err;

      fs.writeFile('/file', contents, function(err) {
        if(err) throw err;

        fs.writeFile('/file2', contents, function(err) {
          if(err) throw err;

          fs.mkdir('/dir/dir2', function(err) {
            if(err) throw err;

            fs.writeFile('/dir/dir2/file3', contents, function(err) {
              if(err) throw err;

              fs.writeFile('/dir/dir2/file4', contents, function(err) {
                if(err) throw err;

                fs.mkdir('/dir/dir2/dir3', function(err) {
                  if(err) throw err;

                  fs.writeFile('/dir/dir2/dir3/file5', contents, function(err) {
                    if(err) throw err;
                    shell.du('/', function(err, list) {
                      expect(err).not.to.exist;

                      expect(list.entries[1].path).to.equal('/dir/dir2/file3');
                      expect(list.entries[2].path).to.equal('/dir/dir2/file4');
                      expect(list.entries[3].path).to.equal('/dir/dir2/dir3/file5');
                      expect(list.entries[4].path).to.equal('/dir/dir2/dir3');
                      expect(list.entries[5].path).to.equal('/dir/dir2');
                      expect(list.entries[6].path).to.equal('/dir');
                      expect(list.entries[7].path).to.equal('/file');
                      expect(list.entries[8].path).to.equal('/file2');
                      expect(list.entries[0].path).to.equal('/');

                      done();
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});