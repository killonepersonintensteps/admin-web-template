import { createI18n } from 'vue-i18n'
import zhCN from './Lang/zh-cn'
import enUS from './Lang/en'
import enUSLocale from 'element-plus/es/locale/lang/en'
import zhENLocale from 'element-plus/es/locale/lang/zh-cn'
// import store from '@/store'
const messages = {
    en: Object.assign(enUS, enUSLocale),
    zh: Object.assign(zhCN, zhENLocale),
}

/**
 * TODO: Vue-i18n 控制台的警告
 *  You are running the esm-bundler build of vue-i18n.
 * It is recommended to configure your bundler to explicitly replace feature flag globals with boolean literals
 * to get proper tree-shaking in the final bundle.
 */
const i18n = createI18n({
    locale: 'zh',
    messages,
    globalInjection: true,
    silentTranslationWarn: true,
})

export default i18n
