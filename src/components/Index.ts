/*
 * @Author: xiaoning.li@inossem.com
 * @Date: 2022-06-23 09:52:10
 * @LastEditors: xiaoning.li@inossem.com
 * @LastEditTime: 2022-09-09 11:35:42
 * @Description: 以 Vue 插件的形式注册自定义组件
 */
import InTable from '@/components/in-tables/Index.vue'
import InVxeTable from '@/components/in-vxe-table/Index.vue'
import InPagination from '@/components/in-pagination/Index.vue'
import InContainer from '@/components/in-container/Index.vue'
import InIcon from '@/components/in-icon/Index.vue'
import InFileUpload from '@/components/in-file-upload/Index.vue'
import InMap from '@/components/in-map/Index.vue'
import InMessage from '@/components/in-message/Index.vue'
const inComponents = function (app) {
	app.component('InTable', InTable)
	app.component('InPagination', InPagination)
	app.component('InContainer', InContainer)
	app.component('InIcon', InIcon)
	app.component('InFileUpload', InFileUpload)
	app.component('InMap', InMap)
	app.component('InMessage', InMessage)
	app.component('InVxeTable', InVxeTable)
}
export default inComponents
