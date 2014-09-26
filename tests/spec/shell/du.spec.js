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

  it('should return the disk usage of current dir', function(done) {
    var fs = util.fs();
    var shell = fs.Shell();
    var contents = "a";
    var contents2 = "bbbb";

    fs.writeFile('/file1', contents, function(err) {
      if(err) throw err;

      fs.writeFile('/file2', contents2, function(err) {
        if(err) throw err;

        shell.du('/', function(err, sizes) {
        expect(err).not.to.exist;
        var item = sizes;
        expect(item.results.length).to.equal(2);
        
        expect(item.totalsize).to.equal(5);
         
        expect(item.results[0].path).to.equal('/file1');
        expect(item.results[0].size).to.equal(1);
             
        expect(item.results[1].path).to.equal('/file2');    
        expect(item.results[1].size).to.equal(4);
             
        done();
        });
      });
    });
  });

  it('should return the disk usage of files under a dir', function(done) {
    var fs = util.fs();
    var shell = fs.Shell();
    var contents = "a";
    var contents2 = "This is a test";
    var contents3 = "This is a file inside a directory";

    fs.writeFile('/file1', contents, function(err) {
      if(err) throw err;

      fs.mkdir('/dir', function(err) {  
        if(err) throw err;
        
        fs.writeFile('/file2', contents2, function(err) {
          if(err) throw err;

            fs.writeFile('/dir/file3', contents3, function(err) {
              if(err) throw err;
                
                fs.mkdir('/dir/dir2', function(err) {  
                  if(err) throw err;
                    
                    fs.writeFile('/dir/dir2/file4', contents3, function(err) {
                      if(err) throw err;
                         
                      shell.du('/', function(err, sizes) {
                      expect(err).not.to.exist;
                      var item = sizes;
                      expect(item.results.length).to.equal(6);

                      expect(item.totalsize).to.equal(81);

                      expect(item.results[0].path).to.equal('/file1');
                      expect(item.results[0].size).to.equal(1);

                      expect(item.results[1].path).to.equal('/dir');    
                      expect(item.results[1].size).to.equal(0);

                      expect(item.results[2].path).to.equal('/dir/file3');    
                      expect(item.results[2].size).to.equal(33);    

                      expect(item.results[3].path).to.equal('/dir/dir2');    
                      expect(item.results[3].size).to.equal(0);
                                    
                      expect(item.results[4].path).to.equal('/dir/dir2/file4');    
                      expect(item.results[4].size).to.equal(33);    
                                    
                      expect(item.results[5].path).to.equal('/file2');    
                      expect(item.results[5].size).to.equal(14);

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
    