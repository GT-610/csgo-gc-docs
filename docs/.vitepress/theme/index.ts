import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import { useData } from 'vitepress'
import './custom.css'

const VercountStats = {
  setup() {
    const { lang } = useData()
    const isChinese = () => lang.value === 'zh-CN'

    return () => h('div', { class: 'site-footer-meta', role: 'contentinfo' }, [
      h('div', { class: 'vercount-stats' }, [
        h('span', null, [
          isChinese() ? '\u672c\u7ad9\u603b\u8bbf\u95ee\u91cf ' : 'Site PV ',
          h('span', { id: 'vercount_value_site_pv' }, 'Loading')
        ]),
        h('span', null, [
          isChinese() ? '\u672c\u7ad9\u8bbf\u5ba2\u6570 ' : 'Site UV ',
          h('span', { id: 'vercount_value_site_uv' }, 'Loading')
        ]),
        h('span', null, [
          isChinese() ? '\u672c\u9875\u8bbf\u95ee\u91cf ' : 'Page PV ',
          h('span', { id: 'vercount_value_page_pv' }, 'Loading')
        ])
      ]),
      h('a', {
        class: 'source-code-link',
        href: 'https://github.com/GT-610/csgo-gc-docs',
        target: '_blank',
        rel: 'noreferrer'
      }, isChinese() ? '\u7ad9\u70b9\u6e90\u4ee3\u7801' : 'Site source code')
    ])
  }
}

export default {
  extends: DefaultTheme,
  Layout: () => h(DefaultTheme.Layout, null, {
    'layout-bottom': () => h(VercountStats)
  })
}
