import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import { useData } from 'vitepress'
import './custom.css'

const VercountStats = {
  setup() {
    const { lang } = useData()
    const isChinese = () => lang.value === 'zh-CN'

    return () => h('div', { class: 'vercount-stats', role: 'contentinfo' }, [
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
    ])
  }
}

export default {
  extends: DefaultTheme,
  Layout: () => h(DefaultTheme.Layout, null, {
    'layout-bottom': () => h(VercountStats)
  })
}
