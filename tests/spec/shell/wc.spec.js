var Filer = require('../../..');
var util = require('../../lib/test-utils.js');
var expect = require('chai').expect;

describe('FileSystemShell.wc', function() {
  beforeEach(util.setup);
  afterEach(util.cleanup);

  it('should be a function', function() {
    var shell = util.shell();
    expect(shell.wc).to.be.a('function');
  });

  it('should get correct number of bytes for a file', function(done) {
    var fs = util.fs();
    var sh = fs.Shell();

    var buf = new Filer.Buffer(10);
    buf.fill(6);
    fs.writeFile('/file', buf, function(err) {
      if(err) throw err;
      
      sh.wc('/file', {bytes: true}, function(err, counts) {
        expect(err).not.to.exist;
        expect(counts.bytes).to.equal(10);
        done();
      });
    });
  });

  it('should get correct number of lines for a file', function(done) {
    var fs = util.fs();
    var sh = fs.Shell();

    var file = 'This is a line\nSo is this\nAnd This, with empty line after\n\n';
    fs.writeFile('/file', file, function(err) {
      if(err) throw err;
      
      sh.wc('/file', {lines: true}, function(err, counts) {
        expect(err).not.to.exist;
        expect(counts.lines).to.equal(4);
        done();
      });
    });
  });

  it('should get correct number of words for a file', function(done) {
    var fs = util.fs();
    var sh = fs.Shell();

    var file = 'This is a sentence with 7 words.';
    fs.writeFile('/file', file, function(err) {
      if(err) throw err;
      
      sh.wc('/file', {words: true}, function(err, counts) {
        expect(err).not.to.exist;
        expect(counts.words).to.equal(7);
        done();
      });
    });
  });

  it('should get correct number of characters for a file', function(done) {
    var fs = util.fs();
    var sh = fs.Shell();

    var file = 'This is a sentence with 33 words.';
    fs.writeFile('/file', file, function(err) {
      if(err) throw err;
      
      sh.wc('/file', {characters: true}, function(err, counts) {
        expect(err).not.to.exist;
        expect(counts.characters).to.equal(33);
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

  it('should get correct number of lines for a file with no newlines', function(done) {
    var fs = util.fs();
    var sh = fs.Shell();

    var file = 'This is a file with no newlines.';
    fs.writeFile('/file', file, function(err) {
      if(err) throw err;
      
      sh.wc('/file', {lines: true}, function(err, counts) {
        expect(err).not.to.exist;
        expect(counts.lines).to.equal(1);
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
