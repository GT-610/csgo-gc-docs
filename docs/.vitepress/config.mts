import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'en-US',
  title: 'CSGO GC Docs',
  description: 'User and developer documentation for csgo_gc',
  cleanUrls: true,
  head: [
    ['script', { src: 'https://events.vercount.one/js', defer: '' }]
  ],
  locales: {
    root: {
      label: 'English',
      lang: 'en-US',
      title: 'CSGO GC Docs',
      description: 'User and developer documentation for csgo_gc'
    },
    zh: {
      label: '简体中文',
      lang: 'zh-CN',
      title: 'CSGO GC 文档',
      description: 'csgo_gc 的用户和开发者文档',
      themeConfig: {
        nav: [
          { text: '首页', link: '/zh/' },
          { text: '用户指南', link: '/zh/user/' },
          { text: '开发者指南', link: '/zh/developer/' }
        ],
        sidebar: [
          {
            text: '概览',
            items: [
              { text: '介绍', link: '/zh/' },

            ]
          },
          {
            text: '用户指南',
            items: [
              { text: '从这里开始', link: '/zh/user/' },
              { text: '客户端安装', link: '/zh/user/client_installation' },
              { text: '服务器安装', link: '/zh/user/server_installation' },
              { text: '配置', link: '/zh/user/configuration' },
              { text: 'VAC 与服务器安全', link: '/zh/user/vac-and-security' },
              { text: '库存', link: '/zh/user/inventory' },
              { text: 'RCON', link: '/zh/user/rcon' },
              { text: '纪念包', link: '/zh/user/souvenirs' },
              { text: '服务器和大厅', link: '/zh/user/servers' }
            ]
          },
          {
            text: '开发者指南',
            items: [
              { text: '从这里开始', link: '/zh/developer/' },
              { text: '构建', link: '/zh/developer/building' },
              { text: '架构', link: '/zh/developer/architecture' },
              { text: '源码地图', link: '/zh/developer/source-map' },
              { text: '贡献', link: '/zh/developer/contributing' }
            ]
          }
        ],
        search: {
          provider: 'local',
          options: {
            locales: {
              zh: {
                translations: {
                  button: {
                    buttonText: '搜索',
                    buttonAriaLabel: '搜索'
                  },
                  modal: {
                    displayDetails: '显示详情',
                    resetButtonTitle: '重置搜索',
                    backButtonTitle: '关闭搜索',
                    noResultsText: '无结果',
                    footer: {
                      selectText: '选择',
                      selectKeyAriaLabel: '回车',
                      navigateText: '切换',
                      navigateUpKeyAriaLabel: '向上',
                      navigateDownKeyAriaLabel: '向下',
                      closeText: '关闭',
                      closeKeyAriaLabel: 'Esc'
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  themeConfig: {
    search: {
      provider: 'local'
    },
    nav: [
      { text: 'Home', link: '/' },
      { text: 'User Guide', link: '/user/' },
      { text: 'Developer Guide', link: '/developer/' }
    ],
    sidebar: [
      {
        text: 'Overview',
        items: [
          { text: 'Introduction', link: '/' },

        ]
      },
      {
        text: 'User Guide',
        items: [
          { text: 'Start Here', link: '/user/' },
          { text: 'Client Installation', link: '/user/client_installation' },
          { text: 'Server Installation', link: '/user/server_installation' },
          { text: 'Configuration', link: '/user/configuration' },
          { text: 'VAC and Server Security', link: '/user/vac-and-security' },
          { text: 'Inventory', link: '/user/inventory' },
          { text: 'RCON', link: '/user/rcon' },
          { text: 'Souvenir Packages', link: '/user/souvenirs' },
          { text: 'Servers and Lobbies', link: '/user/servers' }
        ]
      },
      {
        text: 'Developer Guide',
        items: [
          { text: 'Start Here', link: '/developer/' },
          { text: 'Building', link: '/developer/building' },
          { text: 'Architecture', link: '/developer/architecture' },
          { text: 'Source Map', link: '/developer/source-map' },
          { text: 'Contributing', link: '/developer/contributing' }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/GT-610/csgo_gc' }
    ]
  }
})

