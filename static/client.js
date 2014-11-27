(function () {
  'use strict';

  var socket = io.connect('http://localhost:8080'),
      preview = document.getElementById('preview'),

      name = 'VandA',
      format = 'opentype',
      ext = 'otf',
      baseUrl = '/' + name + '.' + ext;

  function generate (family, url) {
    return "\n" +
      "@font-face {\n" +
        "  font-family: '" + family + "';\n" +
        "  src: url('" + url + "') format(" + format + ");\n" +
      "}\n";
  }

  function createStyle (id) {
    var family = [name, id].join('_'),
        url = [baseUrl, 'v=' + id].join('?'),
        oldStyle = document.getElementsByTagName('style')[0],
        style = document.createElement('style');

    style.appendChild(document.createTextNode(generate(family, url)));

    document.head.appendChild(style);
    document.head.removeChild(oldStyle);

    return family;
  }

  socket.on('file::change', function (data) {
    var family = createStyle(data);
    preview.style['font-family'] = family;
  });

  window.onload = function () {
    preview.focus();
  };
})();