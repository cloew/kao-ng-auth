module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        spider_script: {
            options: {
                sourcemap: false
            },
            compile: {
                files: [{
                    expand: true,
                    src: ['*.spider'],
                    dest: 'dist/',
                    ext: '.js'
                }]
            }
        }
    });
    grunt.loadNpmTasks('grunt-spider-script');

    // Default task(s).
    grunt.registerTask('default', ['spider_script']);
};