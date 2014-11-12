exports.parse = require('./lib/parser').parse;

exports.stringify = function(term) {
  return list(term, true);

  function list(term, isTop) {
    var out='';

    if (!isTop) {
     out = '[';
    }
    for (var i=0; i< term.length; i++) {
      var stringifier = getStringifier(term[i].type);
      if (i !== 0 && !isTop) {
        out += ' ';
      }
      out += stringifier.call(null, term[i]);
      if (i !== (term.length-1)) {
        if (!isTop) {
          out += ',';
        } else {
          out += '.\n';
        }
      }
    }

    if (!isTop) {
      out += ']';
    } else {
      if (term.length > 0) {
        out += '.';
      }
    }
    return out;
  }
  function tuple(term) {
    var out = '{';
    for (var i=0; i< term.length; i++) {
      var stringifier = getStringifier(term[i].type);
      if (i !== 0) {
        out += ' ';
      }
      out += stringifier.call(null, term[i]);
      if (i !== (term.length-1)) {
        out += ',';
      }
    }
    out += '}';
    return out;
  }
  function atom(term) {
    return term[0];
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
}
