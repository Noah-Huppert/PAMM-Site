module.exports = function(grunt){
    grunt.initConfig({
        sass:{
            compile: {
                files: [{
                    expand: true,
                    cwd: "src/client/styles/scss",
                    src: ["*.scss"],
                    dest: "src/client/styles/css",
                    ext: ".css"
                }]
            }
        },
        browserify: {
            compile: {
                files: [{
                    expand: true,
                    cwd: "src/client/scripts/jsx",
                    src: ["**/*.jsx"],
                    dest: "src/client/scripts/js",
                    ext: ".js"
                }],
                options: {
                    transform: ["reactify"]
                }
            }
        },
        watch: {
            jsx: {
                files: ["src/client/scripts/jsx/**/*.jsx"],
                tasks: ["browserify:compile"]
            },
            scss: {
                files: ["src/client/styles/scss/*.scss"],
                tasks: ["sass:compile"]
            }
        }
    });
    
    grunt.loadNpmTasks("grunt-contrib-sass");
    grunt.loadNpmTasks("grunt-browserify");
    grunt.loadNpmTasks("grunt-contrib-watch");
    
    grunt.registerTask("default", ["browserify:compile", "sass:compile"]);
};