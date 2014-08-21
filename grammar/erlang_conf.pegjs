{var escape_chars = {'b': 8, 'd': 127, 'e': 27, 'f': 12, 'n': 10, 'r': 13, 's': 32, 't': 9, 'v': 11 };}


start
  = nonsense? value:expression* {
    var result = {};
    result.type = 'list';
    result.length = value.length;
    for(var i=0; i< value.length; i++) {
      result[i] = value[i];
    }
    return result;
  }

expression
  = term:term nonsense? '.' nonsense? {
    return term;
  }

nonsense
  = (_/comment)+

comment
  = '%' [^\r\n]* {
    return 'comment';
  }

term
  = list
  / tuple
  / atom
  / string
  / number
  / binstr

list
  = '[' nonsense* ']' {
    return {'type': 'list', 'length': 0};
  }
  / '[' nonsense* terms:terms nonsense* ']' {
    var result = {};
    result.type = 'list';
    result.length = terms.length;
    for(var i=0; i< terms.length; i++) {
      result[i] = terms[i];
    }
    return result;
  }

tuple
  = '{' nonsense* '}' {
    return {'type': 'tuple', 'length': 0};
  }
  / '{' nonsense* terms:terms nonsense* '}' {
    var result = {};
    result.type = 'tuple';
    result.length = terms.length;
    for(var i=0; i< terms.length; i++) {
      result[i] = terms[i];
    }
    return result;
  }

terms
  = head:term nonsense* tail:(',' nonsense* term nonsense*)* {
    var result = [head];
    for(var i=0; i< tail.length; i++) {
      result.push(tail[i][2]);
    }
    return result;
  }

number
  = base:integer '#' int:[0-9a-zA-Z]+ {
    return parseInt(int.join(''), base);
  }
  / int:integer '.' fraction:[0-9]+ {
    fraction.unshift('.');
    return parseFloat(int+fraction.join(''));
  }
  / int:integer {
    return int;
  }
  / '$' escape:'\\'? char:ascii {
    if (escape && escape_chars[char]) {
      return escape_chars[char];
    } else {
      return char.charCodeAt(0);
    }
  }

integer
  = head:[1-9] tail:[0-9]+ {
    tail.unshift(head);
    return parseInt(tail.join(''), 10);
  }
  / value:[0-9] {
    return parseInt(value, 10);
  }

string
  = '"' value:[^"]* '"' {
    return {
      'type': 'string',
      'length': 1,
      '0': value.join('')
    };
  }

binstr
  = '<<' value:string '>>' {
    return {
      'type': 'binstr',
      'length': 1,
      '0': value[0]
    }
  }

atom
  = "'" value:[^']+ "'" {
    return value.join('');
  } 
  / value:[a-z]+[a-zA-Z0-9_@]* {
    return value.join('');
  }
_
  = ws/nl

nl
  = '\n'/'\r\n'

ws
  = [ \t]

ascii
  = [!"#$%&'()*+,-./0-9:;<=>?@A-Z\[\\\]\^_`a-z{|}~]
