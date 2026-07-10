import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'CSGO GC Docs',
  description: 'Documentation for CSGO GC',
  cleanUrls: true,
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' }
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting Started', link: '/' }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/csgo-gc/csgo-gc.github.io' }
    ]
  }
})
