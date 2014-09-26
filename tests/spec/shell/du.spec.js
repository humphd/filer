var Filer = require('../../..');
var util = require('../../lib/test-utils.js');
var expect = require('chai').expect;
 
describe('FileSystemShell.du', function() {
  beforeEach(util.setup);
  afterEach(util.cleanup);
 
  it('should be a function', function(done){
    var fs = util.fs();
    var shell = fs.Shell();
 
    expect(typeof shell.du).to.equal('function');
 
    done();
  })
 
  it('should return the current directory properly if run without the first argument', function(done){
    var fs = util.fs();
    var shell = fs.Shell();
 
    // Step 1: Run the du command without the first argument,
    //         expecting a report on `/`
    shell.du(function(err, data) {
      if(err) throw err;
 
      expect(data).to.exist;
      expect(data.total).to.exist;
      expect(typeof data.total).to.equal('number');
      expect(data.total).to.equal(4096);
 
      expect(entries).to.exist;
      expect(entries.length).to.equal(1);
      expect(entries[0]['/']).to.equal(4096);
 
      done();
    });
  });
 
  it('should return properly if run on an empty directory', function(done) {
    var fs = util.fs();
    var shell = fs.Shell();
 
    // Step 1: Make a directory to test in
    fs.mkdir('/dir', function(err) {
      if(err) throw err;
 
      // Step 2: Run the du command
      shell.du('/dir', function(err, data) {
        if(err) throw err;
 
        expect(data).to.exist;
        expect(data.total).to.exist;
        expect(typeof data.total).to.equal('number');
        expect(data.total).to.equal(0);
 
        expect(entries).to.exist;
        expect(entries.length).to.equal(1);
        expect(entries[0]['/dir']).to.equal(0);
 
        done();
      });
    });
  });
 
  it('should return properly if run inside an empty directory', function(done) {
    var fs = util.fs();
    var shell = fs.Shell();
 
    // Step 1: Make a directory to test in
    fs.mkdir('/dir', function(err) {
      if(err) throw err;
 
      // Step 2: Checkout to the directory
      shell.cd('/dir', function(err) {
        if(err) throw err;
 
        // Step 2: Run the du command
        shell.du(function(err, data) {
          if(err) throw err;
 
          expect(data).to.exist;
          expect(data.total).to.exist;
          expect(typeof data.total).to.equal('number');
          expect(data.total).to.equal(0);
 
          expect(entries).to.exist;
          expect(entries.length).to.equal(1);
          expect(entries[0]['/dir']).to.exist;
          expect(entries[0]['/dir']).to.equal(0);
 
          done();
        });
      })
    });
  });
 
  it('should return properly if run on a specific file', function(done){
    var fs = util.fs();
    var shell = fs.Shell();
    var contents = "hello world";
 
    // Step 1: Create file
    fs.writeFile('/testFile', contents, function(err) {
      if(err) throw err;
 
      // Step 2: Run `du` on file
      shell.du('/testFile', function(err, data) {
        if(err) throw err;
 
        expect(data).to.exist;
        expect(data.total).to.exist;
        expect(typeof data.total).to.equal('number');
        expect(data.total).to.equal(12);
 
        expect(entries).to.exist;
        expect(entries.length).to.equal(1);
        expect(entries[0]['/testFile']).to.exist;
        expect(entries[0]['/testFile']).to.equal(12);
 
        done();
      });
    });
  });
 
  it('should return properly if run on a directory containing a single file', function(done){
    var fs = util.fs();
    var shell = fs.Shell();
    var contents = "hello world";
 
    // Step 1: Create directory
    fs.mkdir('/dir', function(err) {
      if(err) throw err;
 
      // Step 2: Create file inside directory
      fs.writeFile('/dir/testFile', contents, function(err) {
        if(err) throw err;
 
        // Step 2: Run `du` on file
        shell.du('/dir', function(err, data) {
          if(err) throw err;
 
          expect(data).to.exist;
          expect(data.total).to.exist;
          expect(typeof data.total).to.equal('number');
          expect(data.total).to.equal(4096 + 12);
 
          expect(entries).to.exist;
          expect(entries.length).to.equal(1);
          expect(entries[0]['/dir']).to.exist;
          expect(entries[0]['/dir']).to.equal(4096 + 12);
          expect(entries[0]['/dir/testFile']).to.exist;
          expect(entries[0]['/dir/testFile']).to.equal(12);
 
          done();
        });
      });
    });
  });
 
  it('should return properly if run inside a directory containing a single file', function(done){
    var fs = util.fs();
    var shell = fs.Shell();
    var contents = "hello world";
 
    // Step 1: Create directory
    fs.mkdir('/dir', function(err) {
      if(err) throw err;
 
      // Step 2: Create file inside directory
      fs.writeFile('/dir/testFile', contents, function(err) {
        if(err) throw err;
 
        // Step 3: Change to the new directory
        shell.cd('/dir', function(err){
          if(err) throw err;
 
          // Step 4: Run `du`
          shell.du(function(err, data) {
            if(err) throw err;
 
            expect(data).to.exist;
            expect(data.total).to.exist;
            expect(typeof data.total).to.equal('number');
            expect(data.total).to.equal(4096 + 12);
 
            expect(entries).to.exist;
            expect(entries.length).to.equal(1);
            expect(entries[0]['/dir']).to.exist;
            expect(entries[0]['/dir']).to.equal(4096 + 12);
            expect(entries[0]['/dir/testFile']).to.exist;
            expect(entries[0]['/dir/testFile']).to.equal(12);
 
            done();
          });
        });
      });
    });
  })
 
  it('should return properly if run on a directory containing multiple files', function(done){
    var fs = util.fs();
    var shell = fs.Shell();
    var contents = "hello world";
    var contents2 = "hello Kieran";
 
    // Step 1: Create directory
    fs.mkdir('/dir', function(err) {
      if(err) throw err;
 
      // Step 2: Create file inside directory
      fs.writeFile('/dir/testFile', contents, function(err) {
        if(err) throw err;
 
        fs.writeFile('/dir/testFile2', contents2, function(err){
          if(err) throw err;
 
          // Step 3: Run `du`
          shell.du('/dir', function(err, data) {
            if(err) throw err;
 
            expect(data).to.exist;
            expect(data.total).to.exist;
            expect(typeof data.total).to.equal('number');
            expect(data.total).to.equal(4096 + 12 + 13);
 
            expect(entries).to.exist;
            expect(entries.length).to.equal(1);
            expect(entries[0]['/dir']).to.exist;
            expect(entries[0]['/dir']).to.equal(4096 + 12 + 13);
            expect(entries[0]['/dir/testFile']).to.exist;
            expect(entries[0]['/dir/testFile']).to.equal(12);
            expect(entries[0]['/dir/testFile2']).to.exist;
            expect(entries[0]['/dir/testFile2']).to.equal(13);
 
            done();
          });
        });
      });
    });
  });
 
  it('should return properly if run inside a directory containing multiple files', function(done){
    var fs = util.fs();
    var shell = fs.Shell();
    var contents = "hello world";
    var contents2 = "hello Kieran";
 
    // Step 1: Create directory
    fs.mkdir('/dir', function(err) {
      if(err) throw err;
 
      // Step 2: Create file inside directory
      fs.writeFile('/dir/testFile', contents, function(err) {
        if(err) throw err;
 
        fs.writeFile('/dir/testFile2', contents2, function(err){
          if(err) throw err;
 
          // Step 3: Run `du`
          shell.cd('/dir', function(err){
            if (err) throw err;
            // Step 3: Run `du`
            shell.du(function(err, data) {
              if(err) throw err;
 
              expect(data).to.exist;
              expect(data.total).to.exist;
              expect(typeof data.total).to.equal('number');
              expect(data.total).to.equal(4096 + 12 + 13);
 
              expect(entries).to.exist;
              expect(entries.length).to.equal(1);
              expect(entries[0]['/dir']).to.exist;
              expect(entries[0]['/dir']).to.equal(4096 + 12 + 13);
              expect(entries[0]['/dir/testFile']).to.exist;
              expect(entries[0]['/dir/testFile']).to.equal(12);
              expect(entries[0]['/dir/testFile2']).to.exist;
              expect(entries[0]['/dir/testFile2']).to.equal(13);
 
              done();
            });
          });
        });
      });
    });
  });
});