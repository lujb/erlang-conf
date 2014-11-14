exports.parse = require('./lib/parser').parse;

exports.stringify = function(term) {
  var out = '';

  for (var i=0; i< term.length; i++) {
    var stringifier = getStringifier(term[i].type);
    if (i!==0) {
      out += '\n\n';
    }
    out += stringifier.call({indt: 0}, term[i]);
    out += '.';
  }

  return out;

  function list(term) {
    var out = indent(this, term.length) + '[';

    for (var i=0; i< term.length; i++) {
      var stringifier = getStringifier(term[i].type);
      if (i!==0) {
        out += ', ';
      }
      out += stringifier.call({indt: this.indt+1, i:i}, term[i]);
    }
    out += ']';

    return out;
  }
  function tuple(term) {
    var out = indent(this, term.length) + '{';
    for (var i=0; i< term.length; i++) {
      var stringifier = getStringifier(term[i].type);
      if (i !== 0) {
        out += ', ';
      }
      out += stringifier.call({indt: this.indt+1, i:i}, term[i]);
    }
    out += '}';
    return out;
  }
  function atom(term) {
    var out = term[0];

    if (/^[a-z][a-zA-Z0-9_@]*$/.test(out)) {
      return out;
    } else {
      return "'" + out + "'";
    }
  }
  function integer(term, out) {
    return term[0];
  }
  function string(term, out) {
    return '"' + term[0] + '"';
  }
  function boolean(term, out) {
    return term[0];
  }

  function getStringifier(type) {
    return eval(type);
  }

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
