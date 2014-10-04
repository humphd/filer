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

  it('should fail when files argument is absent', function(done) {
    var fs = util.fs();
    var shell = fs.Shell();

    shell.du(null, function(error, data) {
      expect(error).to.exist;
      expect(error.code).to.equal("EINVAL");
      expect(data).not.to.exist;
      done();
    });
  });
  
  it('should return the size of a simple file', function(done){
	var fs = util.fs();
    var shell = fs.Shell();
    var contents = "a";
    
	fs.writeFile('/file',contents, function(err) {
		if(err) throw err;
		
		shell.du('/', function(err,list) {
			expect(err).not.to.exist;
			expect(list.length).to.equal(1);
	
			var item0=list[0];
			expect(item0.path).to.equal('file');
			expect(item0.size).to.equal(1);
			
			done();
		});//end shell.du
	});//end write file
  });//end test
  
  it('should return the values of shallow contents of a dir tree', function(done) {
    var fs = util.fs();
    var shell = fs.Shell();
    var contents = "a";

    fs.mkdir('/dir', function(err) {
      if(err) throw err;

      fs.mkdir('/dir/dir2', function(err) {
        if(err) throw err;

        fs.writeFile('/dir/file', contents, function(err) {
          if(err) throw err;

          fs.writeFile('/dir/file2', contents, function(err) {
            if(err) throw err;

            shell.du('/dir', function(err, list) {
			
              expect(err).not.to.exist;
              expect(list.length).to.equal(3);
			 

              // We shouldn't rely on the order we'll get the listing
              list.forEach(function(item, i, arr) {
                switch(item.path) {
                case 'dir2':
                  //expect(item.links).to.equal(1);
                  expect(item.size).to.be.a('number');                  
                  expect(item.type).to.equal('DIRECTORY');
                  //expect(item.contents).not.to.exist;
                  break;
                case 'file':
                case 'file2':
                  //expect(item.links).to.equal(1);
                  expect(item.size).to.equal(1);
                  //expect(item.modified).to.be.a('number');
                  expect(item.type).to.equal('FILE');
                  //expect(item.contents).not.to.exist;
                  break;
                default:
                  // shouldn't happen
                  expect(true).to.be.false;
                  break;
                }

                if(i === arr.length -1) {
                  done();
                }
              }); //end for
            });//du call
          });//writefile2
        });//writefile
      });//mkdir2
    });//mkdir1
  });//end test
  
  it('should return the deep data contents of a dir tree', function(done) {
    var fs = util.fs();
    var shell = fs.Shell();
    var contents = "a";

    fs.mkdir('/dir', function(err) {
      if(err) throw err;

      fs.mkdir('/dir/dir2', function(err) {
        if(err) throw err;

        fs.writeFile('/dir/dir2/file', contents, function(err) {
          if(err) throw err;

          fs.writeFile('/dir/file', contents, function(err) {
            if(err) throw err;

            fs.writeFile('/dir/file2', contents, function(err) {
              if(err) throw err;

              shell.du('/dir', { recursive: true }, function(err, list) {
                expect(err).not.to.exist;
                expect(list.length).to.equal(3);

                // We shouldn't rely on the order we'll get the listing
                list.forEach(function(item, i, arr) {
                  switch(item.path) {
                  case 'dir2':                  
                    expect(item.size).to.be.a('number');                   
                    expect(item.type).to.equal('DIRECTORY');
                    expect(item.contents).to.exist;
                    expect(item.contents.length).to.equal(1);
                    var contents0 = item.contents[0];
                    expect(contents0.path).to.equal('file');
                    expect(contents0.size).to.equal(1);                    
                    expect(contents0.type).to.equal('FILE');
                    expect(contents0.contents).not.to.exist;
                    break;
                  case 'file':
                  case 'file2':                    
                    expect(item.size).to.equal(1);
                    expect(item.type).to.equal('FILE');
                    expect(item.contents).not.to.exist;
                    break;
                  default:
                    // shouldn't happen
                    expect(true).to.be.false;
                    break;
                  }

                  if(i === arr.length -1) {
                    done();
                  }
                });//end for
              }); //end du
            });//end write dir/file 2
          });//end write dir/file1
        }); //end write dir/dir2/file
      }); //end make dir/dir2
    }); //end make dir
  });//end test
  
});//end du tests