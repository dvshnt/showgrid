module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		copy: {
			fonts: {
            	expand: true,
				cwd: 'public/css/fonts/webfonts',
				src: ['**'],
				dest: '../static/showgrid/css/webfonts',
			},
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

		concat: {
			basic: {
				src: ['public/css/fonts/*.css'],
				dest: 'public/css/font.css'
			},
		},

		// SASS Compilation
		sass: {
			dev: {
				options: {
					style: 'expanded'
				},
				files: {
					'./public/css/base.css' : './public/css/sass/base.scss',
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
						],
						'./public/css/base.css': [
							'./public/css/base.css'
						],
					}
				}
			}
		},
	
		browserify: {
			dev: {
				options: {
					debug: true,
					transform: ['babelify']
				},
				src: './index.js',
				dest: './public/js/bundle.js'
			},
			build: {
				options: {
					debug: false,
					transform: ['babelify']
				},
				src: './index.js',
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
				files: [
					'./components/*.js', './containers/*.js', 
					'./store/*.js', './reducers/*.js', 
					'./actions/*.js', './index.js', './util/*.js', 
					'./middleware/*.js', './schemas/*.js'
				],
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
	grunt.loadNpmTasks('grunt-contrib-concat');


	//// Registered Tasks
	grunt.registerTask('default', ['watch']);
	grunt.registerTask('build', ['sass:prod', 'concat:basic', 'browserify:build', 'copy:fonts', 'cssmin:prod', 'copy:css', 'uglify:build', 'copy:js']);
}
