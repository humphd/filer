var Constants = require('./constants.js');
var NODE_TYPE_FILE = require('./constants.js').NODE_TYPE_FILE;
var NODE_TYPE_DIRECTORY = require('./constants.js').NODE_TYPE_DIRECTORY;
var NODE_TYPE_SYMBOLIC_LINK = require('./constants.js').NODE_TYPE_SYMBOLIC_LINK;

function Stats(fileNode, devName) {
  this.node = fileNode.id;
  this.type = fileNode.type;
  this.name = fileNode.name;
  this.dev = devName;
  this.size = fileNode.size;
  this.nlinks = fileNode.nlinks;
  this.atime = fileNode.atime;
  this.mtime = fileNode.mtime;
  this.ctime = fileNode.ctime;
  this.mode = fileNode.mode;
  this.uid = fileNode.uid;
  this.gid = fileNode.gid;
  // Expose extra Plan 9 identifier too
  this.qid = {
    type: fileNode.q_type,
    version: fileNode.q_version,
    path: fileNode.q_path
  };
}

Stats.prototype.isFile = function() {
  return this.type === NODE_TYPE_FILE;
};

Stats.prototype.isDirectory = function() {
  return this.type === NODE_TYPE_DIRECTORY;
};

Stats.prototype.isSymbolicLink = function() {
  return this.type === NODE_TYPE_SYMBOLIC_LINK;
};

// These will always be false in Filer.
Stats.prototype.isSocket          =
Stats.prototype.isFIFO            =
Stats.prototype.isCharacterDevice =
Stats.prototype.isBlockDevice     =
function() {
  return false;
};

module.exports = Stats;
