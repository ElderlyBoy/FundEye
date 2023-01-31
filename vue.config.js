const AutoImport = require('unplugin-auto-import/webpack');
const Components = require('unplugin-vue-components/webpack');
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers');

module.exports = {
  configureWebpack: {
    plugins: [
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],
  },
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: {
        appId: 'com.shiniest.fundeye',
        productName: 'Fund Eye',
        copyright: 'Copyright © 2023 你不熟悉的x先生',
        win: {
          target: {
            target: 'nsis',
            arch: ['x64'],
          },
        },
        nsis: {
          oneClick: false,
          language: 2052,
          perMachine: true,
          allowToChangeInstallationDirectory: true,
        },
      },
    },
  },
};
