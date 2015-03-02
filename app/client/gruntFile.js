module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		// SASS Compilation
		sass: {
			dev: {
				options: {
					style: 'expanded'
				},
				files: {
					'../static/showgrid/css/base.css' : './public/css/sass/base.scss'
				}
			},
			build: {
				options: {
					style: 'compressed'
				},
				files: {
					'../static/showgrid/css/base.css' : './public/css/sass/base.scss'
				}
			}
		},

		uglify: {
			build: {
				files: {
					'../static/showgrid/js/bundle.min.js': '../static/showgrid/js/bundle.js'
				}
			}
		},

		browserify: {
			dev: {
				options: {
					debug: true,
					transform: ['reactify']
				},
				files: {
					'../static/showgrid/js/bundle.js': './app.jsx'
				}
			},
			build: {
				options: {
					debug: false,
					// transform: ['reactify', 'uglify:build']
				},
				files: {
					'../static/showgrid/js/bundle.js': './app.jsx'
				}
			}
		},

		watch: { 
			css: {
				files: './public/css/sass/*.sass', 
				tasks: ['sass:dev'],
				options: {
					livereload: true
				}
			},
			js: {
				files: ['./components/*.js', './app.js'],
				tasks: ['browserify:dev'],
				options: {
					livereload: true
				}
			},
			html : {
				files: ['./views/*.html'],
				options: {
					livereload: true
				}
			}
		},

	});


	//// Grunt Modules
	//grunt.loadNpmTasks('reactify');
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');


	//// Registered Tasks
	grunt.registerTask('default', ['watch']);

}