module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		copy: {
			css: {
				expand: true,
				flatten: true,
				cwd: 'public/css/',
				src: ['*.css', '*.css.map'],
				dest: '../static/showgrid/css/',
			},
			js: {
				expand: true,
				cwd: 'public/js/',
				src: '*.js',
				dest: '../static/showgrid/js/',
			},
		},

		// SASS Compilation
		sass: {
			dev: {
				options: {
					style: 'expanded'
				},
				files: {
					'./public/css/base.css' : './public/css/sass/base.scss'
				}
			},
			prod: {
				options: {
					style: 'compressed'
				},
				files: {
					'./public/css/base.css' : './public/css/sass/base.scss'
				}
			}
		},
		
		browserify: {
			dev: {
				options: {
					debug: true,
					transform: ['reactify']
				},
				src: './app.react.js',
				dest: './public/js/bundle.js'
			},
			build: {
				options: {
					debug: false,
					transform: ['reactify']
				},
				src: './app.react.js',
				dest: './public/js/bundle.js'
			}
		},

		uglify: {
			build: {
				src: './public/js/bundle.js',
				dest: './public/js/bundle.min.js'
			}
		},

		watch: { 
			css: {
				files: './public/css/sass/*.scss', 
				tasks: ['sass:dev', 'copy:css']
			},
			js: {
				files: ['./components/*.js', './app.react.js', './util/*.js'],
				tasks: ['browserify:dev', 'copy:js']
			},
			html : {
				files: ['./views/*.html']
			}
		},

	});


	//// Grunt Modules
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');


	//// Registered Tasks
	grunt.registerTask('default', ['watch']);
	grunt.registerTask('build', ['sass:prod', 'browserify:build', 'copy:css', 'copy:js']);
}
