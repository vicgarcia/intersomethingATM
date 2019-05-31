module.exports = function(grunt) {

    // load plugins
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-exec');


    // configure
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        exec: {
            bower: 'bower install',
            composer: 'composer install',
            initdb: 'php initdb.php'
        },
        requirejs: {
            compile: {
                options: {
                    baseUrl: "templates/js",
                    mainConfigFile: "templates/js/main.js",
                    name: "main",
                    out: "public/main.js"
                }
            }
        },
        copy: {
            requirejs: {
                src: 'bower_components/requirejs/require.js',
                dest: 'public/require.js'
            }
        },
        watch: {
            style: {
                files: ['templates/js/*'],
                tasks: ['compile']
            }
        }
    });
    grunt.registerTask('default', []);

    grunt.registerTask('compile', [
        'requirejs',
        'copy:requirejs'
    ]);

    grunt.registerTask('build', [
        'exec:bower',
        'exec:composer',
        'exec:initdb',
        'compile'
    ]);

};
