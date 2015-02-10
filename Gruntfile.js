module.exports = function(grunt) {
	grunt.initConfig({
		less: {
			compile: {
				files: [{
					expand: true,
					cwd: "src/client/styles/less",
					src: ["*.less"],
					dest: "src/client/styles/css",
					ext: ".css"
				}]
			}
		},
		browserify: {
			compile: {
				files: {
					"src/client/scripts/js/app.js": "src/client/scripts/jsx/app.jsx"
				},
				options: {
					transform: ["reactify"],
					external: ["React", "Backbone", "_", "mui"]
				}
			}
		},
		clean: {
			css: ["src/client/styles/css"],
			js: ["src/client/scripts/js"]
		},
		watch: {
			jsx: {
				files: ["src/client/scripts/jsx/**/*.jsx"],
				tasks: ["jsx"]
			},
			less: {
				files: ["src/client/styles/less/*.less"],
				tasks: ["styles"]
			}
		}
	});

	grunt.loadNpmTasks("grunt-contrib-less");
	grunt.loadNpmTasks("grunt-browserify");
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-watch");

	grunt.registerTask("default", ["jsx", "less"]);
	grunt.registerTask("jsx", ["clean:js", "browserify:compile"]);
	grunt.registerTask("styles", ["clean:css", "less:compile"]);
};
