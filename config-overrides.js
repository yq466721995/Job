//配置具体的修改规则
/* const { override, fixBabelImports, addLessLoader } = require('customize-cra');

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd-moblie',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
  javascriptEnabled: true,
  modifyVars: { '@primary-color': '#1DA57A' },
  }),
); */

/* const { override, fixBabelImports } = require('customize-cra')
module.exports = function override(config, env) {
  // do stuff with the webpack config...
  return config;
};
module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd-mobile',
    style: 'css',
  }),
); */

const { override, fixBabelImports, addLessLoader,addWebpackAlias,addDecoratorsLegacy } = require('customize-cra');
const path = require("path")
const rewirePostcss = require('react-app-rewire-postcss');
const px2rem = require('postcss-px2rem')
const theme = require('./src/theme/antd-theme.json');
module.exports = override(
    addLessLoader({  //自定义主题
      javascriptEnabled: true,
      modifyVars: theme,
    }),
    fixBabelImports('import', {  //按需加载样式
      libraryName: 'antd-mobile',
      libraryDirectory: 'es',
      style: true,
    }),
    addWebpackAlias({  //别名
        assets: path.resolve(__dirname,'./src/assets/'),
        '@': path.resolve(__dirname,'./src/components/'),
        '@pages': path.resolve(__dirname,'./src/pages/'),
        '@store': path.resolve(__dirname,'./src/store/'),
        '@utils': path.resolve(__dirname,'./src/utils/'),
        '@config': path.resolve(__dirname,'./src/config/'),
        '@redux': path.resolve(__dirname,'./src/redux/'),
        '@api': path.resolve(__dirname,'./src/api/')
    }),
    addDecoratorsLegacy({
        "babel": {
            "plugins": [
              [
                "@babel/plugin-proposal-decorators",
                {
                  "legacy": true,
                }
              ]
            ],
            "presets": [
              "react-app"
            ]
        }
    }),

    (config,env)=>{
        // 重写postcss
        rewirePostcss(config,{   
            plugins: () => [
                require('postcss-flexbugs-fixes'),
                require('postcss-preset-env')({
                    autoprefixer: {
                        flexbox: 'no-2009',
                    },
                    stage: 3,
                }),
              //关键:设置px2rem
                px2rem({
                    remUnit: 37.5,
                    exclude:/node-modules/
                })
            ],
        });
        
        
        return config
    }
);