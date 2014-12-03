module.exports = function(grunt) {

    grunt.initConfig({
        exec: {
            generate_js_from_grammar: {
                command: 'pegjs ./grammar/erlang-conf.pegjs ./lib/parser.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-exec');

    grunt.registerTask('make', ['exec']);

    // paring test.conf
    grunt.registerTask('default', 'paring test.conf', function() {
        var fs = require('fs');
        var conf = require('./erlang-conf');

        var filename = './test.conf'
        var data = fs.readFileSync(filename, {'encoding': 'utf8'});
        var term = conf.parse(data);
        console.log(JSON.stringify(term, 0, 4));
        console.log(conf.stringify(term));

        grunt.log.write('parsing test.conf...').ok();
    });


};
