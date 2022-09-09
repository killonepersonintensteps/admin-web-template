/*
 * @Author: xiaoning.li@inossem.com
 * @Date: 2022-09-08 14:59:07
 * @LastEditors: xiaoning.li@inossem.com
 * @LastEditTime: 2022-09-09 10:06:48
 * @Description: 布局头部信息配置
 */
export default {
	// 高度
	navHeight: '64px',

	navBackground: '#FFF',

	navBoxShadow: '0px 2px 10px 0px rgba(221, 221, 230, 0.5)',

	systemName: 'Admin管理平台',

	logoImage: require('../assets/images/sco.png'),

	actionButtons: {
		// 是否显示退出功能
		buttonLogout: true,
		// 是否显示头像
		avatarImg: true,
		// 是否显示语言切换 只支持中英文
		ButtonLang: false,
		// 是否显示用户昵称
		userName: true,
	},
}
