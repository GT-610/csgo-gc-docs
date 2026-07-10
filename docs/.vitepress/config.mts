import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'CSGO GC Docs',
  description: 'User and developer documentation for csgo_gc',
  cleanUrls: true,
  themeConfig: {
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
          { text: 'Project Status', link: '/status' }
        ]
      },
      {
        text: 'User Guide',
        items: [
          { text: 'Start Here', link: '/user/' },
          { text: 'Installation', link: '/user/installation' },
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
