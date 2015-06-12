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
					'./public/css/base.css' : './public/css/base.css'
				}
			}
		},

		cssmin: {
			fonts: {
				options: {
					shorthandCompacting: false,
					roundingPrecision: -1
				},
				target: {
					files: {
						'./public/css/fonts.css': [
							'./public/css/fonts/*.css'
						]
					}
				}
			},
			prod: {
				options: {
					shorthandCompacting: false,
					roundingPrecision: -1
				},
				target: {
					files: {
						'./public/css/fonts.css': [
							'./public/css/fonts/*.css'
						]
					}
				}
			}
		},
	
		browserify: {
			dev: {
				options: {
					debug: true,
					transform: ['reactify']
				},
				src: './spark.react.js',
				dest: './public/js/bundle.js'
			},
			build: {
				options: {
					debug: false,
					transform: ['reactify']
				},
				src: './spark.react.js',
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
				tasks: ['sass:dev', 'copy:css'],
				options: {
					livereload: true,
				}
			},
			js: {
				files: ['./components/*.js', './spark.react.js', './util/*.js'],
				tasks: ['browserify:dev', 'copy:js'],
				options: {
					livereload: true,
				}
			},
			html : {
				files: ['./views/*.html'],
				options: {
					livereload: true,
				}
			}
		},

	});


	//// Grunt Modules
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-cssmin');


	//// Registered Tasks
	grunt.registerTask('default', ['watch']);
	grunt.registerTask('build', ['sass:prod', 'browserify:build', 'copy:css', 'copy:js']);
}
