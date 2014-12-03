_parse = require('./lib/parser').parse;

exports.parse = function(content, cb) {
  if (cb) {
    var term, err = null;
    try {
      term = _parse(content);
    } catch (e) { err = e; }
    cb(err, term);
  } else {
    return _parse(content);
  }
}

exports.stringify = function(term) {
  var out = '';
  var stringifiers = {};

  stringifiers.list = function(term) {
    var out = indent(this, term.length) + '[';

    for (var i=0; i< term.length; i++) {
      var stringifier = stringifiers[term[i].type];
      if (i!==0) {
        out += ', ';
      }
      out += stringifier.call({indt: this.indt+1, i:i}, term[i]);
    }
    out += ']';

    return out;
  }
  stringifiers.tuple = function(term) {
    var out = indent(this, term.length) + '{';
    for (var i=0; i< term.length; i++) {
      var stringifier = stringifiers[term[i].type];
      if (i !== 0) {
        out += ', ';
      }
      out += stringifier.call({indt: this.indt+1, i:i}, term[i]);
    }
    out += '}';
    return out;
  }
  stringifiers.atom = function(term) {
    var out = term[0];

    if (/^[a-z][a-zA-Z0-9_@]*$/.test(out)) {
      return out;
    } else {
      return "'" + out + "'";
    }
  }
  stringifiers.integer = function(term, out) {
    return term[0];
  }
  stringifiers.float = function(term, out) {
    return term[0];
  }
  stringifiers.string = function(term, out) {
    return '"' + term[0] + '"';
  }
  stringifiers.binstr = function(term, out) {
    return '<<"' + term[0] + '">>';
  }
  stringifiers.boolean = function(term, out) {
    return term[0];
  }

  for (var i=0; i< term.length; i++) {
    console.log('want:', term[i].type);
    var stringifier = stringifiers[term[i].type];
    if (i!==0) {
      out += '\n\n';
    }
    out += stringifier.call({indt: 0}, term[i]);
    out += '.';
  }

  return out;

  function indent(o, len) {
    if (o.indt!==0 && o.i!==0 && len>0) {
      var out = '\n';

      for (var i=0; i<o.indt; i++) out += ' ';
      return out;
    } else {
      return '';
    }
  }
}
