/*
 * @Author: xiaoning.li@inossem.com
 * @Date: 2022-08-16 09:46:05
 * @LastEditors: xiaoning.li@inossem.com
 * @LastEditTime: 2022-09-09 11:34:54
 * @Description:
 */
// import { fetchModelFormSetting } from '@/api/model-setting'
import { defineStore } from 'pinia'
interface ModelFormSetting {
	formListSetPo: {
		formMapMarkType: number // 地图标记类型(0:单点标记;1:线段标记)
		formMarkFieldSource: number[]
		formShowType: number[]
	}
	formCurrencyRulePo: {
		currAuditOption: unknown[]
		currAuthStatus: number
		currDataAudit: number
		currDeleteChoice: number[]
		currEnableEffect: number[]
		currStopChoice: number[]
		currStopEffect: number[]
	}
	formRelationSetPo: unknown
}

export const useCommonStore = defineStore('common', {
	state: () => ({
		loading: false,
		local: 'zh',
		token: '',
		// appId: 9000,
		appId: 100,
		// clientId: 233967005532161,
		clientId: 214605540425876,
		modelFormSetting: {} as ModelFormSetting,
		treeSetting: null,
	}),
	actions: {
		//  获取表单设置
		// async fetchFormSetting(modelId): Promise<ModelFormSetting | undefined> {
		//   const res = await fetchModelFormSetting(modelId)
		//   if (res.data.status && res.data.returnCode === 1) {
		//     this.modelFormSetting = res.data.data
		//     return Promise.resolve(res.data.data)
		//   }
		// },
	},
})
