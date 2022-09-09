import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Layout from '@/Layout/Index.vue'
import Dictionary from '@/views/dictionary/DictionaryList.vue'
import DictionaryValue from '@/views/dictionary/DictionaryValueList.vue'
import { EnableStatus } from '@/enum/index'
export const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		component: Layout,
		redirect: '/dictionary/list',
		meta: {
			isHidden: EnableStatus.ENABlE, // 左侧菜单是否隐藏
			enable: EnableStatus.ENABlE, // 是否启用
			title: '',
			icon: '',
		},
		children: [
			{
				path: '/dashboard',
				name: 'Dashboard',
				component: () => import('@/views/dashboard/Index.vue'),
			},
		],
	},

	{
		path: '/dictionary',
		name: 'Dictionary',
		component: Layout,
		redirect: '/dictionary/list',
		meta: {
			title: '字典管理',
			icon: 'shujuzidian',
			index: 0,
		},
		children: [
			{
				path: '/dictionary/list',
				name: 'dictList',
				component: Dictionary,
				meta: {
					title: '字典列表',
					icon: '',
					isHidden: EnableStatus.UNENABLE,
					enable: EnableStatus.ENABlE,
				},
			},
			{
				path: '/dictionary/list',
				name: 'dictList',
				component: Dictionary,
				meta: {
					title: '字典列表',
					icon: '',
					isHidden: EnableStatus.UNENABLE,
					enable: EnableStatus.ENABlE,
				},
			},
			{
				path: '/dictionary/form/:id',
				name: 'DictForm',
				component: DictionaryValue,
				meta: {
					title: '字典表单',
					icon: '',
					isHidden: EnableStatus.ENABlE,
					enable: EnableStatus.ENABlE,
				},
			},
		],
	},
	{
		path: '/dictionary',
		name: 'Dictionary',
		component: Layout,
		redirect: '/dictionary/list',
		meta: {
			title: '字典管理',
			icon: 'shujuzidian',
			index: 0,
		},
		children: [
			{
				path: '/dictionary/list',
				name: 'dictList',
				component: Dictionary,
				meta: {
					title: '字典列表',
					icon: '',
					isHidden: EnableStatus.UNENABLE,
					enable: EnableStatus.ENABlE,
				},
			},
			{
				path: '/dictionary/list',
				name: 'dictList',
				component: Dictionary,
				meta: {
					title: '字典列表',
					icon: '',
					isHidden: EnableStatus.UNENABLE,
					enable: EnableStatus.ENABlE,
				},
			},
			{
				path: '/dictionary/form/:id',
				name: 'DictForm',
				component: DictionaryValue,
				meta: {
					title: '字典表单',
					icon: '',
					isHidden: EnableStatus.ENABlE,
					enable: EnableStatus.ENABlE,
				},
			},
		],
	},
]

const isMicroApp = window.__POWERED_BY_QIANKUN__
const router = createRouter({
	history: createWebHistory(isMicroApp ? '/micros/indata/' : ''),
	routes,
})

export default router
