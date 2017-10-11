/* global module:false */
module.exports = function (grunt) {
    var port = grunt.option('port') || 8000;
    var root = grunt.option('root') || 'src';

    if (!Array.isArray(root)) root = [root];

    // Project configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        meta: {
            banner:
            '/*!\n' +
            ' * reveal.js <%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd, HH:MM") %>)\n' +
            ' * http://lab.hakim.se/reveal-js\n' +
            ' * MIT licensed\n' +
            ' *\n' +
            ' * Copyright (C) 2017 Hakim El Hattab, http://hakim.se\n' +
            ' */'
        },

        uglify: {
            options: {
                banner: '<%= meta.banner %>\n'
            },
            build: {
                src: 'src/js/reveal.js',
                dest: 'src/js/reveal.min.js'
            }
        },

        sass: {
            core: {
                files: {
                    'src/css/reveal.css': 'src/css/reveal.scss',
                }
            },
            themes: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/css/theme/source',
                        src: ['*.sass', '*.scss'],
                        dest: 'src/css/theme',
                        ext: '.css'
                    }
                ]
            }
        },

        autoprefixer: {
            dist: {
                src: 'src/css/reveal.css'
            }
        },

        cssmin: {
            compress: {
                files: {
                    'src/css/reveal.min.css': ['src/css/reveal.css']
                }
            }
        },

        jshint: {
            options: {
                curly: false,
                eqeqeq: true,
                immed: true,
                esnext: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                eqnull: true,
                browser: true,
                expr: true,
                globals: {
                    head: false,
                    module: false,
                    console: false,
                    unescape: false,
                    define: false,
                    exports: false
                }
            },
            files: ['Gruntfile.js', 'src/js/reveal.js']
        },

        connect: {
            server: {
                options: {
                    port: port,
                    base: root,
                    livereload: true,
                    open: true
                }
            },

        },

        zip: {
            'reveal-js-presentation.zip': [
                'src/index.html',
                'src/css/**',
                'src/js/**',
                'src/lib/**',
                'src/images/**',
                'src/plugin/**',
                'src/**.md'
            ]
        },

        pug: {
            compile: {
                files: {
                    'src/index.html': ['index.pug']
                }
            }
        },

        watch: {
            js: {
                files: ['Gruntfile.js', 'src/js/reveal.js'],
                tasks: 'js'
            },
            theme: {
                files: [
                    'src/css/theme/source/*.sass',
                    'src/css/theme/source/*.scss',
                    'src/css/theme/template/*.sass',
                    'src/css/theme/template/*.scss'
                ],
                tasks: 'css-themes'
            },
            css: {
                files: ['src/css/reveal.scss'],
                tasks: 'css-core'
            },
            html: {
                files: root.map(path => path + '/*.html')
            },
            markdown: {
                files: root.map(path => path + '/*.md')
            },
            options: {
                livereload: true
            },
            pug: {
                files: [
                    'index.pug',
                    'content/**/*.pug',
                    'content/**/*.md',
                ],
                tasks: 'pug'
            }
        },

        retire: {
            js: ['src/js/reveal.js', 'src/lib/js/*.js', 'src/plugin/**/*.js'],
            node: ['.'],
            options: {}
        }

    });

    // Dependencies
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-zip');
    grunt.loadNpmTasks('grunt-retire');
    grunt.loadNpmTasks('grunt-contrib-pug');

    // Default task
    grunt.registerTask('default', ['pug', 'css', 'js']);

    // JS task
    grunt.registerTask('js', ['jshint', 'uglify']);

    // Theme CSS
    grunt.registerTask('css-themes', ['sass:themes']);

    // Core framework CSS
    grunt.registerTask('css-core', ['sass:core', 'autoprefixer', 'cssmin']);

    // All CSS
    grunt.registerTask('css', ['sass', 'autoprefixer', 'cssmin']);

    // Package presentation to archive
    grunt.registerTask('package', ['default', 'zip']);

    // Serve presentation locally
    grunt.registerTask('serve', ['pug', 'connect', 'watch']);

};
