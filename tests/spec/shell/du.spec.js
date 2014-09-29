var Filer = require('../../..');
var util = require('../../lib/test-utils.js');
var expect = require('chai').expect;

describe('FileSystemShell.du', function() {
  beforeEach(util.setup);
  afterEach(util.cleanup);

  it('should be a function', function() {
    var sh = util.shell();
    expect(sh.du).to.be.a('function');
  });
    
  it('should get the correct disk usage for a file', function(done){
    var fs = util.fs();
    var sh = fs.Shell();
    
    //Create a buffer and allocate 10 bytes
    var buf = new Filer.Buffer(10);
    buf.fill(1);
    
    fs.writeFile('/file', buf, function(err) {
      if(err) throw err;
      //Call du on file
      sh.du('/file', function(err, entries) {
        expect(err).not.to.exist;
        expect(entries.total).to.equal(10);
        done();
      });
    });
  });

  it('should get the correct disk usage for a directory', function(done) {
    var fs = util.fs();
    var sh = fs.Shell();

    var buf = new Filer.Buffer(10);
    buf.fill(6);
    
    fs.mkdir('/test_dir', function(err){
      if(err) throw err;

      fs.writeFile('/test_dir/file2', buf, function(err){
        if(err) throw err;

        fs.writeFile('/test_dir/file1', buf, function(err){
          if(err) throw err;

          sh.du('/test_dir', function(error, sizes){
            expect(error).not.to.exist;
            expect(sizes.total).to.equal(20);
            done();
          });
        });
      });
    });
  });
  
  it('should be called on the current pwd if no path is provided', function(done) {
    var fs = util.fs();
    var sh = fs.Shell();
    
    var buf = new Filer.Buffer(10);
    buf.fill(6);
    
    fs.writeFile('/testFile', buf, function(err) {
      if(err) throw err;
      
      sh.du(null, function(err, sizes) {
        expect(sizes.total).to.equal(10);
        expect(err).not.to.exist;
        done();
      });
    });
  });
  
  
  it('should get the correct usage for multiple directories', function(done) 
  {
    var fs = util.fs();
    var sh = fs.Shell();
    
    var buf = new Filer.Buffer(10);
    buf.fill(6);
    
    fs.mkdir('/test_dir1', function(err){
      if(err) throw err;
      
      fs.mkdir('/test_dir1/test_dir2', function(err){
        if(err) throw err;
        
          fs.mkdir('/test_dir1/test_dir3', function(err){
            if(err) throw err;
            
            fs.writeFile('/test_dir1/test_dir2/file1', buf, function(err){
              if(err) throw err;
              
              fs.writeFile('/test_dir1/test_dir3/file2', buf, function(err){
                sh.du('/test_dir1', function(error, sizes) {
                  console.log(error + sizes.total);
                  expect(error).not.to.exist;
                  expect(sizes.total).to.equal(20);
                  done();
                });
              });
            });
          });
      });
    });
  });
  
  it('should get the correct usage for a nested directory', function(done){
    var fs = util.fs();
    var sh = fs.Shell();
    
    var buf = new Filer.Buffer(10);
    buf.fill('a');
    
    fs.mkdir('/test_dir1', function(err){
      if(err) throw err;
      
      fs.mkdir('/test_dir1/test_dir2', function(err){
        if(err) throw err;
        
        fs.writeFile('/test_dir1/test_dir2/file1', buf, function(err){
          if(err) throw err;
          
          sh.du('/test_dir1', function(err, sizes){
            expect(err).not.to.exist;
            expect(sizes.total).to.equal(10);
            done();
          });
        });
      });
    });
  });
  
  it('should get the correct usage for multiple directories', function(done) {
    var fs = util.fs();
    var sh = fs.Shell();
    
    var buf = new Filer.Buffer(10);
    buf.fill('a');
    
    fs.mkdir('/test_dir1', function(err){
      if(err) throw err;
      
      fs.mkdir('/test_dir1/test_dir2', function(err){
        if(err) throw err;
        
        fs.writeFile('/test_dir1/file1', buf, function(err){
          if(err) throw err;
          
          fs.writeFile('/test_dir1/test_dir2/file2', buf, function(err){
            if(err) throw err;
            
            sh.du('/test_dir1', function(err, sizes) {
              expect(err).not.to.exist;
              expect(sizes.total).to.equal(20);
              done();
            });
          });
        });
      });
    });
  });

  it('should fail if the path provided does not exist', function(done) {
    var fs = util.fs();
    var sh = fs.Shell();
    
    sh.du('/nothing_here', function(error, sizes){
      expect(error).to.exist;
    });
    done();
  });
  

});