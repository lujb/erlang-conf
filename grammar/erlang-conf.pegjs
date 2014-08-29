{
  var escapeChars = {
    'b': 8,
    'd': 127,
    'e': 27,
    'f': 12,
    'n': 10,
    'r': 13,
    's': 32,
    't': 9,
    'v': 11
  };
  var Ast = function(type) {
    this.type = type;
    this.length = 1;
    this.line = line();
    this.column = column();
    this[0] = text();
  }
}


start
  = nonsense? value:expression* {
    var ast = new Ast('list');
    ast.length = value.length;
    for(var i=0; i< value.length; i++) {
      ast[i] = value[i];
    }
    return ast;
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
  = '[' nonsense* terms:terms nonsense* ']' {
    var ast = new Ast('list');
    ast.length = terms.length;
    for(var i=0; i< terms.length; i++) {
      ast[i] = terms[i];
    }
    return ast;
  }
  / '[' nonsense* ']' {
    var ast = new Ast('list');
    ast.length = 0;
    delete ast[0];
    return ast;
  }

tuple
  = '{' nonsense* terms:terms nonsense* '}' {
    var ast = new Ast('tuple');
    ast.length = terms.length;
    for(var i=0; i< terms.length; i++) {
      ast[i] = terms[i];
    }
    return ast;
  }
  / '{' nonsense* '}' {
    var ast = new Ast('tuple');
    ast.length = 0;
    delete ast[0];
    return ast;
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
    var ast = new Ast('integer');
    ast[0] = parseInt(int.join(''), base);
    return ast;
  }
  / integer '.' [0-9]+ {
    var ast = new Ast('float');
    ast[0] = parseFloat(text());
    return ast;
  }
  / int:integer {
    var ast = new Ast('integer');
    ast[0] = int;
    return ast;
  }
  / '$' escape:'\\'? char:ascii {
    var val;
    var ast = new Ast('integer');
    if (escape && escapeChars[char]) {
      val = escapeChars[char];
    } else {
      val = char.charCodeAt(0);
    }
    ast[0] = val;
    return ast;
  }

integer
  = '0'/ [1-9][0-9]* {
    return parseInt(text(), 10)
  }

string
  = '"' value:[^"]* '"' {
    var ast = new Ast('string');
    ast[0] = value.join('');
    return ast;
  }

binstr
  = '<<' value:string '>>' {
    var ast = new Ast('binstr');
    ast[0] = value[0];
    return ast;
  }

atom
  = "'" value:[^']+ "'" {
    var ast = new Ast('atom');
    ast.quoted = true;
    ast[0] = value.join('');
    return ast;
  } 
  / [a-z]+ [a-zA-Z0-9_@]* {
    return new Ast('atom');
  }
_
  = nl/ws

nl
  = '\n'/'\r\n'

ws
  = [ \t]

ascii
  = [!"#$%&'()*+,-./0-9:;<=>?@A-Z\[\\\]\^_`a-z{|}~]
