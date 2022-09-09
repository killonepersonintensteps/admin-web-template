/*
 * @Author xiaoning.li@inossem.com
 * @Date: 2022-06-23 09:52:10
 * @LastEditors: xiaoning.li@inossem.com
 * @LastEditTime: 2022-09-09 10:53:33
 * @Description: inTables 组件类型文件
 */
export type selectOptions = {
	label: string
	value: string | number
}

export type columnType = 'text' | 'img' | 'link' | 'input' | 'select' | 'html' | 'click'
type columnAlign = 'left' | 'right' | 'center'

export type tableHeaderFileds = {
	key: string
	name: string
	columnType?: columnType
	align?: columnAlign
	fixed?: boolean
	width?: string
	htmlString?: (row, column) => any
	selectOptions?: selectOptions[]
	sortable?: boolean
	format?: (row) => any
	filterMethod?: (value, row, column) => any
	placeholder?: string
	fun?: (row) => string | number | unknown
	clickHandler?: (row, item: tableHeaderFileds, index: number) => void
	map?: {
		[key: string]: string | number
	}
}

/** 操作列属性 */
export type ActionColumFiled = {
	text: string
	type?: string
	underline?: boolean
	disabled?: boolean
	fun?: (row) => boolean
	handler: (row) => void
	key?: string
	map?: {
		[key: string]: string | boolean
	}
}

// 图片和附件格式和接口交互
export interface MultipleFileAndImage {
	name: string
	url: string
}
