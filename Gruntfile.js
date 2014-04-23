module.exports = function(grunt) {

    grunt.initConfig({
        exec: {
            generate_js_from_grammar: {
                command: 'pegjs ./grammar/erlang_conf.pegjs ./erlang_conf.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-exec');

    grunt.registerTask('make', ['exec']);

    // paring test.conf
    grunt.registerTask('default', 'paring test.conf', function() {
        var fs = require('fs');
        var conf = require('./erlang_conf');

        var filename = './test.conf'
        var data = fs.readFileSync(filename, {'encoding': 'utf8'});

        var data2 = conf.parse(data);
        console.log(data2);
        grunt.log.write('parsing test.conf...').ok();
    });


};