
var PATH = {
  BASE: {
    SRC: 'src/',
    DST: 'dst/',
    BUILD: 'build/'
  },
  URL: '/',
  SRC: 'src/',
  DST: 'dst/',
  BUILD: 'build/'
};

module.exports = {
  isProduction: process.env.NODE_ENV === 'production',

  PATH: PATH,

  AUTOPREFIXER: [
    'ie >= 9',
    'ie_mob >= 10',
    'ff >= 31',
    'chrome >= 36',
    'safari >= 8',
    'opera >= 23',
    'ios >= 8',
    'android >= 4'
  ],

  IMAGEMIN: {
    build: {
      src: [PATH.BASE.SRC + 'assets/img/**/*.{png,svg,jpg,jpeg}'],
      dst: PATH.BASE.DST + 'assets/img',
      opts: {
        progressive: true,
        use: [
          require('imagemin-pngquant')()
        ]
      }
    }
  },

  BrowserSync: {
    open: 'local',
    reloadDebounce: 2000,
    ui: false,
    notify: false,
    startPath: PATH.BASE.URL,
    ghostMode: false,
    server: {
      baseDir: PATH.BASE.DST
      //index: `${DIR.DST}${DIR.PATH}`,
      //routes: {
      //  [DIR.PATH]: `${DIR.DST}${DIR.PATH}`
      //}
    },
    files: [
      PATH.BASE.DST + "**/*.obj",

      PATH.BASE.DST + "**/*.json",
      PATH.BASE.DST + "**/*.xml",

      PATH.BASE.DST + "**/*.mp4",
      PATH.BASE.DST + "**/*.mp3",

      PATH.BASE.DST + "**/*.png",
      PATH.BASE.DST + "**/*.jpg",
      PATH.BASE.DST + "**/*.gif",
      PATH.BASE.DST + "**/*.svg",

      PATH.BASE.DST + "**/*.html",
      PATH.BASE.DST + "**/*.css",
      PATH.BASE.DST + "**/*.js",

      PATH.BASE.DST + "**/*.mp3",
      PATH.BASE.DST + "**/*.json",

      PATH.BASE.DST + "**/*.vert",
      PATH.BASE.DST + "**/*.frag",

    ]
  },

  EJS: {
    jsonPath: 'ejs/param.json',
    // qaPath: 'ejs/qa.json',
    templatePath: PATH.BASE.SRC + '/**/*.{html,ejs}',
  },
};
