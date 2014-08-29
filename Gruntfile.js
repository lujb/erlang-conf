module.exports = function(grunt) {

    grunt.initConfig({
        exec: {
            generate_js_from_grammar: {
                command: 'pegjs ./grammar/erlang-conf.pegjs ./erlang-conf.js'
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
        console.log(JSON.stringify(conf.parse(data), 0, 4));
        grunt.log.write('parsing test.conf...').ok();
    });


};
