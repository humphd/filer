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

  it('should return the size of current dir when dirs argument is absent', function(done) {
    var fs = util.fs();
    var shell = fs.Shell();

    shell.du(null, function(err, list) {

      expect(err).not.to.exist;
      expect(list.length).to.equal(1);

      var item0 = list[0];
      expect(item0.path).to.equal('/');
      expect(item0.size).to.equal(0);

      done();
    });
  });


  it('should return the size of a simple dir', function(done) {
    var fs = util.fs();
    var shell = fs.Shell();

    fs.mkdir('/dir', function(err) {
      if(err) throw err;

      shell.du('dir', function(err, list) {
        expect(err).not.to.exist;
        expect(list.length).to.equal(1);

        var item0 = list[0];
        expect(item0.path).to.equal('/dir');
        expect(item0.size).to.equal(0);

        done();
      });
    });
  });

  it('should return the size of a simple file', function(done) {
    var fs = util.fs();
    var shell = fs.Shell();
    var contents = "a";

    fs.writeFile('/file', contents, function(err) {
      if(err) throw err;

      shell.du('file', function(err, list) {
        expect(err).not.to.exist;
        expect(list.length).to.equal(1);

        var item0 = list[0];
        expect(item0.path).to.equal('/file');
        expect(item0.size).to.equal(1);

        done();
      });
    });
  });

  it('should return the size of a simple dir', function(done) {
    var fs = util.fs();
    var shell = fs.Shell();

    fs.mkdir('/dir', function(err) {
      if(err) throw err;

      shell.du('dir', function(err, list) {
        expect(err).not.to.exist;
        expect(list.length).to.equal(1);

        var item0 = list[0];
        expect(item0.path).to.equal('/dir');
        expect(item0.size).to.equal(0);

        done();
      });
    });
  });


  it('should return the size of sub dirs and current dir', function(done) {
    var fs = util.fs();
    var shell = fs.Shell();

    fs.mkdir('/dir', function(err) {
      if(err) throw err;

      fs.mkdir('/dir/dir2', function(err) {
        if(err) throw err;

        shell.du(null, function(err, list) {
          expect(err).not.to.exist;
          expect(list.length).to.equal(3);

          list.forEach(function(item, i, arr) {
            switch(item.path) {
              case '/dir':
              expect(item.size).to.equal(0);
              break;
              case '/dir/dir2':
              expect(item.size).to.equal(0);
              break;
              case '/':
              expect(item.size).to.equal(0);
              break;
              default:
                // shouldn't happen
                expect(true).to.be.false;
                break;
              }
              if(i === arr.length -1) {
                done();
              }
            });
        });
      });
    });
  });


  it('should return the sizes of all dirs', function(done) {
    var fs = util.fs();
    var shell = fs.Shell();
    var contents = "ccc";
    var contents2 = 'bbbbb';

    fs.mkdir('/dir', function(err) {
      if(err) throw err;

      fs.mkdir('/dir2', function(err) {
        if(err) throw err;

        fs.mkdir('/dir2/dir3', function(err) {
          if(err) throw err;

          fs.writeFile('/dir/file', contents, function(err) {
            if(err) throw err;

            fs.writeFile('/dir2/file2', contents2, function(err) {
              if(err) throw err;

              shell.du(null, function(err, list) {
                expect(err).not.to.exist;
                expect(list.length).to.equal(6);

                list.forEach(function(item, i, arr) {
                  switch(item.path) {
                    case '/dir':
                    expect(item.size).to.equal(3);
                    break;
                    case '/dir2':
                    expect(item.size).to.equal(5);
                    break;
                    case '/dir2/dir3':
                    expect(item.size).to.equal(0);
                    break;
                    case '/dir/file':
                    expect(item.size).to.equal(3);
                    break;
                    case '/dir2/file2':
                    expect(item.size).to.equal(5);
                    break;
                    case '/':
                    expect(item.size).to.equal(8);
                    break;

                    default:
                    // shouldn't happen
                    expect(true).to.be.false;
                    break;
                  }

                  if(i === arr.length -1) {
                    done();
                  }
                });
              });
            });
          });
        });
      });
    });
  });
});