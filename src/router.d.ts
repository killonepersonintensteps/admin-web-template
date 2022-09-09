/*
 * @Author: 李晓宁 xiaoning.li@inossem.com
 * @Date: 2022-05-27 14:26:51
 * @LastEditors: xiaoning.li@inossem.com
 * @LastEditTime: 2022-09-08 14:10:35
 * @FilePath: /middle-platform-web-indata/src/router.d.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import 'vue-router'
declare module 'vue-router' {
	interface RouteMeta {
		title?: string
		requiresAuth?: boolean
		isHidden?: 0 | 1
		enable?: 0 | 1
	}
}
// TODO: 类型声明
export function push(arg0: { path: string; query: unknown }) {
	throw new Error('Function not implemented.')
}

export const currentRoute
export function replace(arg0: { path: string; query: any }) {
	throw new Error('Function not implemented.')
}
