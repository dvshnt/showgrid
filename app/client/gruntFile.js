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
					'./public/css/base.css' : './public/css/sass/base.scss'
				}
			},
			build: {
				options: {
					style: 'compressed'
				},
				files: {
					'./public/css/base.css' : './public/css/sass/base.scss'
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

		browserify: {
			dev: {
				options: {
					debug: true,
					transform: ['reactify']
				},
				files: {
					'./public/js/bundle.js': './app.react.js'
				}
			},
			build: {
				options: {
					debug: false,
					// transform: ['reactify', 'uglify:build']
				},
				files: {
					'./public/js/bundle.js': './app.react.js'
				}
			}
		},

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

		watch: { 
			css: {
				files: './public/css/sass/*.scss', 
				tasks: ['sass:dev', 'copy:css']
			},
			js: {
				files: ['./components/*.js', './app.react.js'],
				tasks: ['browserify:dev', 'copy:js']
			},
			html : {
				files: ['./views/*.html']
			}
		},

	});


	//// Grunt Modules
	//grunt.loadNpmTasks('reactify');
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');


	//// Registered Tasks
	grunt.registerTask('default', ['watch']);

}