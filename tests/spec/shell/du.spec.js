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
    
  /*By default, the du utility shall write to standard output the size of the file 
  space allocated to, and the size of the file space allocated to each subdirectory
  of, the file hierarchy rooted in each of the specified files. By default, when a
  symbolic link is encountered on the command line or in the file hierarchy, du shall
  count the size of the symbolic link (rather than the file referenced in the link), 
  and shall not follow th elink to another portion of the file hierarchy. The size of 
  the file space allocated to a file or type directory shall be defined as the sum of
  total space allocated to all files in the file hierarchy rooted in the directory 
  plus the space allocated to the directory itself. 
  
  When du cannot stat() files or stat() or read directories, it shall report an error 
  condition and the final exit status is affected. Files with multiple links shall be 
  counted and written for only one entry. The directory entry that is selected in the 
  report is unspecified. By default, file sizes shall be written in 512-byte units, 
  rounded up to the next 512-byte unit. 
  
  */
    
  it('should get the correct disk usage for a file', function(done){
    var fs = util.fs();
    var sh = fs.Shell();
    
    //Create a buffer and allocate 10 bytes
    var buf = new Filer.Buffer(10);
    //Fill buffer
    buf.fill(1);
    fs.writeFile('/file', buf, function(err) {
        if(err) throw err;
        //Call du on file
        sh.du('/file', function(err, byteCount) {
            expect(err).not.to.exist;
            expect(byteCount).to.equal(10);
            done();
        });
    });
  });

  it('should do something', function(done) {
    var fs = util.fs();
    var sh = fs.Shell();

    var buf = new Filer.Buffer(10);
    buf.fill(6);
    fs.writeFile('/file', function(err) {
      if(err) throw err;
      
      sh.wc('/file', {bytes: true}, function(err, sizes) {
        expect(err).not.to.exist;
        expect(sizes.bytes).to.equal(10);
        done();
      });
    });
  });

  it('should get correct number of bytes, words, lines, characters for a file', function(done) {
    var fs = util.fs();
    var sh = fs.Shell();

    var file = 'She sells sea-shells on the sea-shore.\n' +
               'The shells she sells are sea-shells, I\'m sure.\n' +
               'For if she sells sea-shells on the sea-shore\n' +
               'Then I\'m sure she sells sea-shore shells.';
    
    fs.writeFile('/file', file, function(err) {
      if(err) throw err;
      
      sh.wc('/file', function(err, counts) {
        expect(err).not.to.exist;
        expect(counts.bytes).to.equal(172);
        expect(counts.lines).to.equal(3);
        expect(counts.words).to.equal(40);
        expect(counts.characters).to.equal(172);
        done();
      });
    });
  });

  it('should get correct number of bytes, characters for multi-byte file', function(done) {
    var fs = util.fs();
    var sh = fs.Shell();

    // Multi-byte Euro symbol - http://en.wikipedia.org/wiki/UTF-8#Examples
    var file = '€';
    
    fs.writeFile('/file', file, function(err) {
      if(err) throw err;
      
      sh.wc('/file', {bytes: true, characters: true}, function(err, counts) {
        expect(err).not.to.exist;
        expect(counts.bytes).to.equal(3);
        expect(counts.characters).to.equal(1);
        done();
      });
    });
  });

  it('should get error if trying to wc a dir path', function(done) {
    var fs = util.fs();
    var sh = fs.Shell();

    sh.wc('/', {bytes: true}, function(err, counts) {
      expect(err.code).to.equal('EISDIR');
      done();
    });
  });

});