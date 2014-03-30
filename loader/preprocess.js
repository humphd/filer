var preprocess = (function(){

  var Path = Filer.Path;

  /**
   * Look for <link> hrefs, e.g.
   *
   * <link rel="stylesheet" href="http://yandex.st/highlightjs/7.3/styles/github.min.css">
   * <link rel="stylesheet" href="compiled/demo.css">
   */
  var linkRegex = /(\<link[^>]+href\s*=\s*['"])([^'"]+)(['"])/g;

  /**
   * Look for <script>s
   *
   * <script src="http://imagesloaded.desandro.com/imagesloaded.pkgd.min.js"></script>
   * <script src="js/styleguide.js"></script>
   */
  var scriptRegex = /(\<script[^>]+src\s*=\s*['"])([^'"]+)(['"])/g;

  /**
   * Look for CSS url(...)
   *
   * background: url(http://foo.com/image.png)
   * background: url('http://foo.com/image.png')
   * background: url("../image.png")
   */
  var urlRegex = /(url\s*\(['"]?)([^)]+)(['"]?\))/g;

  function toDataURL(data, type) {
    // css - data:text/css;base64,
    // js - data:text/javascript;base64,
    // markdown, json, otf, ... - data:application/octet-stream;base64,
    // svg - data:image/svg+xml;base64,
    // png - data:image/png;base64,
    // ico - data:image/x-icon;base64,
    // jpg - data:image/jpeg;base64,
    // gif - data:image/gif;base64,
    type = type || 'application/octet-stream';
    var encoded = btoa(data);
    return 'data:' + type + ';base64,' + encoded;
  }

  function html(unprocessed, location, fs) {
    location = Path.join('/', location);
    var dir = Path.dirname(location);

    function processCSS(match, p1, p2, p3, offset, string) {
      if(/^\s*(http|https)?\:?\/\//.test(p2)) {
        return match;
      }

      var cssFilename = Path.resolve(dir, p2);
      fs.readFile(cssFilename, 'utf8', function(err, data) {
        if(err) return match;
        return toDataURL(data, 'text/css');
      });
    }

  }

  function css(unprocessed, location, fs) {

  }

  // XXXhack - something quick and dirty to prove the point
  // in the makerstrap demo/index.html context.  We need to deal with just these
  // cases:
  // <link rel="stylesheet" href="compiled/demo.css">
  // <script src="js/vendor/angular-highlightjs.min.js"></script>
  // <script src="js/styleguide.js"></script>
  return {
    html: function(unprocessed, location, fs, callback) {
      fs.readFile('/makerstrap-master/demo/compiled/demo.css', 'utf8', function(err, data) {
        if(err) return callback(err);
        var processed = unprocessed.replace('compiled/demo.css', toDataURL(data, 'text/css'));

        fs.readFile('/makerstrap-master/demo/js/vendor/angular-highlightjs.min.js', 'utf8', function(err, data) {
          if(err) return callback(err);
          processed = processed.replace('js/vendor/angular-highlightjs.min.js', toDataURL(data, 'text/javascript'));

          fs.readFile('/makerstrap-master/demo/js/styleguide.js', 'utf8', function(err, data) {
            if(err) return callback(err);
            processed = processed.replace('js/styleguide.js', toDataURL(data, 'text/javascript'));
console.log(processed);
            callback(null, processed);
          });
        });
      });
    },

    css: function(unprocessed, location, fs, callback) {

    }
  };

/**
  return {
    html: html,
    css: css
  };
**/

}());
