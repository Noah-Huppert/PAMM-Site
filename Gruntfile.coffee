module.exports = (grunt) ->
  newerFlag = grunt.option "newer"

  newer = (tasks) ->
    if newerFlag
      if typeof tasks is "string"
        tasks = [tasks]

      newTasks = []

      for task in tasks
        newTasks.push "newer:" + task

      return newTasks
    else
      return tasks


  grunt.initConfig
    pkg: grunt.file.readJSON "package.json"

    babel:
      client:
        files: [
          expand: true
          cwd: "src/client/es6"
          src: ["**/*.js"]
          dest: "src/client/js"
          ext: ".js"
        ]
        options:
          sourceMap: true
      server:
        files: [
          expand: true
          cwd: "src/server/es6"
          src: ["**/*.js", "!secrets-template.js"]
          dest: "src/server/js"
          ext: ".js"
        ]

    less:
      styles:
        files: [
          expand: true
          cwd: "src/client/less"
          src: ["**/*.less"]
          dest: "src/client/css"
          ext: ".css"
        ]

    nodemon:
      server:
        script: "<%= pkg.main %>"
        watch: "src/server/**/*.js"

    watch:
      options:
        livereload: true
      views:
        files: "src/client/views/index.html"
      styles:
        files: "src/client/less/**/*.less"
        tasks: "styles"
      client:
        files: "src/client/es6/**/*.js"
        tasks: "client"
      server:
        files: "src/server/es6/**/*.js"
        tasks: "server"

  grunt.loadNpmTasks "grunt-babel"
  grunt.loadNpmTasks "grunt-contrib-watch"
  grunt.loadNpmTasks "grunt-newer"
  grunt.loadNpmTasks "grunt-nodemon"
  grunt.loadNpmTasks "grunt-contrib-less"

  grunt.registerTask "styles", newer "less:styles"
  grunt.registerTask "client", newer "babel:client"
  grunt.registerTask "server", newer "babel:server"
  grunt.registerTask "serve", ["nodemon:server"]

  return
