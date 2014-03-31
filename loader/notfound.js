function notFoundHTML(url) {
  // Stolen lovingly from Apache's default 404 
  return '<!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN">' +
         '<html><head>' +
         '<title>404 Not Found</title>' +
         '</head><body>' +
         '<h1>Not Found</h1>' +
         '<p>The requested URL ' + url + ' was not found on this server.</p>' +
         '<hr>' +
         '<address>NoHost/0.0.1 (Web) Server</address>' +
         '</body></html>';
}

function listingHTML(path, entries) {
  var Path = Filer.Path;
  var parent = Path.dirname(path);

  var header = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 3.2 Final//EN">' +
               '<html><head><title>Index of ' + path + '</title></head>' +
               '<body><h1>Index of ' + path + '</h1>' +
               '<table><tr><th><img src="icons/blank.png" alt="[ICO]"></th>' +
               '<th><a href="#">Name</a></th><th><a href="#">Last modified</a></th>' + 
               '<th><a href="#">Size</a></th><th><a href="#">Description</a></th></tr>' +
               '<tr><th colspan="5"><hr></th></tr>' +
               '<tr><td valign="top"><img src="icons/back.png" alt="[DIR]"></td>' +
               '<td><a href="?' + parent + '">Parent Directory</a>       </td><td>&nbsp;</td>' +
               '<td align="right">  - </td><td>&nbsp;</td></tr>';

  var footer = '<tr><th colspan="5"><hr></th></tr>' +
               '</table><address>NoHost/0.0.1 (Web)</address>' +
               '</body></html>';

  function formatDate(d) {
    // 20-Apr-2004 17:14
    return d.getDay() + '-' + d.getMonth() + '-' + d.getFullYear() + ' ' + d.getHours() + ':' + d.getMinutes();   
  }

  function formatSize(s) {
    var units = ['', 'K', 'M'];
    if(!s) {
      return '-';
    }
    var i = (Math.floor(Math.log(s) / Math.log(1024)))|0;
    return Math.round(s / Math.pow(1024, i), 2) + units[i];
  }

  function row(icon, alt, href, name, modified, size) {
    icon = icon || 'icons/unknown.png';
    alt = alt || '[   ]';
    modified = formatDate(new Date(modified));
    size = formatSize(size);
    return '<tr><td valign="top"><img src="' + icon + '" alt="' + alt + '"></td><td>' +
           '<a href="' + href + '">' + name + '</a>             </td>' +
           '<td align="right">' + modified + '  </td>' + 
	         '<td align="right">' + size + '</td><td>&nbsp;</td></tr>';
  }

  var rows = '';
  entries.forEach(function(entry) {
    var name = Path.basename(entry.path)
    var ext = Path.extname(entry.path);
    var href = '?' + Path.join(path, entry.path);
	  var icon;
    var alt;
    if(entry.type === 'DIRECTORY') {
      icon = 'icons/folder.png';
      alt = '[DIR]';
    } else { // file
      switch(ext) {
        case '.gif':
        case '.png':
        case '.jpg':
        case '.jpeg':
          icon = 'icons/image2.png'
          alt = '[IMG]';
          break;
        case '.htm':
        case '.html':
        default:
          icon = 'icons/text.png';
          alt = '[TXT]';
          break;
      }
    }
	  rows += row(icon, alt, href, name, entry.modified, entry.size);
  });

  return header + rows + footer;
}
