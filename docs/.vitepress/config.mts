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
      label: '\u7b80\u4f53\u4e2d\u6587',
      lang: 'zh-CN',
      title: 'CSGO GC \u6587\u6863',
      description: 'csgo_gc \u7684\u7528\u6237\u548c\u5f00\u53d1\u8005\u6587\u6863',
      themeConfig: {
        nav: [
          { text: '\u9996\u9875', link: '/zh/' },
          { text: '\u7528\u6237\u6307\u5357', link: '/zh/user/' },
          { text: '\u5f00\u53d1\u8005\u6307\u5357', link: '/zh/developer/' }
        ],
        sidebar: [
          {
            text: '\u6982\u89c8',
            items: [
              { text: '\u4ecb\u7ecd', link: '/zh/' },

            ]
          },
          {
            text: '\u7528\u6237\u6307\u5357',
            items: [
              { text: '\u4ece\u8fd9\u91cc\u5f00\u59cb', link: '/zh/user/' },
              { text: '\u5ba2\u6237\u7aef\u5b89\u88c5', link: '/zh/user/client_installation' },
              { text: '\u670d\u52a1\u5668\u5b89\u88c5', link: '/zh/user/server_installation' },
              { text: '\u914d\u7f6e', link: '/zh/user/configuration' },
              { text: '\u5e93\u5b58', link: '/zh/user/inventory' },
              { text: 'RCON', link: '/zh/user/rcon' },
              { text: '\u670d\u52a1\u5668\u548c\u5927\u5385', link: '/zh/user/servers' }
            ]
          },
          {
            text: '\u5f00\u53d1\u8005\u6307\u5357',
            items: [
              { text: '\u4ece\u8fd9\u91cc\u5f00\u59cb', link: '/zh/developer/' },
              { text: '\u6784\u5efa', link: '/zh/developer/building' },
              { text: '\u67b6\u6784', link: '/zh/developer/architecture' },
              { text: '\u6e90\u7801\u5730\u56fe', link: '/zh/developer/source-map' },
              { text: '\u8d21\u732e', link: '/zh/developer/contributing' }
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
                    buttonText: '\u641c\u7d22',
                    buttonAriaLabel: '\u641c\u7d22'
                  },
                  modal: {
                    displayDetails: '\u663e\u793a\u8be6\u60c5',
                    resetButtonTitle: '\u91cd\u7f6e\u641c\u7d22',
                    backButtonTitle: '\u5173\u95ed\u641c\u7d22',
                    noResultsText: '\u65e0\u7ed3\u679c',
                    footer: {
                      selectText: '\u9009\u62e9',
                      selectKeyAriaLabel: '\u56de\u8f66',
                      navigateText: '\u5207\u6362',
                      navigateUpKeyAriaLabel: '\u5411\u4e0a',
                      navigateDownKeyAriaLabel: '\u5411\u4e0b',
                      closeText: '\u5173\u95ed',
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
          { text: 'Inventory', link: '/user/inventory' },
          { text: 'RCON', link: '/user/rcon' },
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
