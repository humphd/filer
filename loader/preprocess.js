var preprocess = (function(){



  /**
   * DOMParser HTML extension
   * 2012-09-04, https://gist.github.com/1129031
   *
   * By Eli Grey, http://eligrey.com
   * Public domain.
   * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
   */
  (function(DOMParser) {
    "use strict";

    var
    DOMParser_proto = DOMParser.prototype
    , real_parseFromString = DOMParser_proto.parseFromString
    ;

    // Firefox/Opera/IE throw errors on unsupported types
    try {
      // WebKit returns null on unsupported types
      if ((new DOMParser).parseFromString("", "text/html")) {
        // text/html parsing is natively supported
      return;
      }
    } catch (ex) {}

    DOMParser_proto.parseFromString = function(markup, type) {
      if (/^\s*text\/html\s*(?:;|$)/i.test(type)) {
        var
        doc = document.implementation.createHTMLDocument("")
        ;
        if (markup.toLowerCase().indexOf('<!doctype') > -1) {
          doc.documentElement.innerHTML = markup;
        }
        else {
          doc.body.innerHTML = markup;
        }
        return doc;
      } else {
        return real_parseFromString.apply(this, arguments);
      }
    };
  }(DOMParser));



  var Path = Filer.Path;

  function mimeFromExt(ext) {
    switch(ext) {
      case '.css':
        return 'text/css';
      case '.js':
        return 'text/javascript';
      case '.svg':
        return 'image/svg+xml';
      case '.png':
        return 'image/png';
      case '.ico':
        return 'image/x-icon';
      case '.jpg':
      case '.jpeg':
        return 'image.jpeg';
      case '.gif':
        return 'image/gif';
    }
    return 'application/octet-stream';
  }

  function toDataURL(data, type) {
    var encoded = btoa(data);
    return 'data:' + type + ';base64,' + encoded;
  }

  function html(unprocessed, location, fs) {
    location = Path.join('/', location);
    var dir = Path.dirname(location);
    var parser = new DOMParser();
    var doc = parser.parseFromString(unprocessed, 'text/html');

    function elements(type, urlType, mime, callback) {
      var elems = doc.querySelectorAll(type);
      var count = 1;
      function cb(err) {
        console.log('err', err, count, elems.length);
        count++;
        if(count === elems.length - 1) {
          callback();
        }
      }

      async.eachSeries(elems, function(elem, cb) {
        // Skip any links for protocols (we only want relative paths)
        var url = elem.getAttribute(urlType);
        if(!url || /\/\//.test(url)) {
          return cb();
        }

        var path = Path.resolve(dir, url);
        fs.exists(path, function(found) {
          if(!found) {
            return cb();
          }
          fs.readFile(path, 'utf8', function(err, data) {
            if(err) return cb(err);
            mime = mime || mimeFromExt(Path.extname(path));
            elem[urlType] = toDataURL(data, mime);
            cb();
          });
        });
      }, function(err) {
        if(err) {
          console.log('err', err);
        }
        callback();
      });
    }

    // Replace links with file contents from fs
    async.series([
      function links(callback) {
        elements('link', 'href', 'text/css', callback);
      },
      function imgs(callback) {
        elements('img', 'src', null, callback);
      },
      function scripts(callback) {
        elements('script', 'src', 'text/javascript', callback);
      }
    ], function callback(err, result) {
      document.write(doc.documentElement.innerHTML);
    });
  }

  function css(unprocessed, location, fs) {
    // TODO
  }

  function image(unprocessed, location, fs) {
    var ext = Path.extname(location);
    var mime = mimeFromExt(ext);
    unprocessed = escape(encodeURIComponent(unprocessed));
    var html = '<html><head><title>' + location + '</title></head><body>' + 
               '<img src="' + toDataURL(unprocessed, mime) + '"></body></html>';
    console.log(html);
    document.write(html);
  }

  return {
    html: html,
    css: css,
    image: image
  };

}());
