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
					'public/css/base.css' : 'public/css/sass/base.scss'
				}
			},
			build: {
				options: {
					style: 'compressed'
				},
				files: {
					'public/css/base.css' : 'public/css/sass/base.scss'
				}
			}
		},

		uglify: {
			build: {
				files: {
					'./public/js/bundle.min.js': './public/js/bundle.js'
				}
			}
		},

		nodemon: {
			dev: {
				script: 'server.js',
				options: {
					watch: ['server.js', 'routes.js']
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
					'./public/js/bundle.js': './app.js'
				}
			},
			build: {
				options: {
					debug: false,
					// transform: ['reactify', 'uglify:build']
				},
				files: {
					'./public/js/bundle.js': './app.js'
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
				files: ['./components/*.js', './util/*.js', './app.js'],
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
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');


	//// Registered Tasks
	grunt.registerTask('default', ['watch']);
	grunt.registerTask('server', ['nodemon:dev']);

}