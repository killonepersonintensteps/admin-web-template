/* eslint-disable @typescript-eslint/ban-types */

// 选择类组件 value取值 给后端添加连接符
export const valueConnector = '&'
/**
 * 短横线命名法的字符串转换成使用骆驼命名规则的字符串
 * @param str
 * @returns
 */
export const getCamelCase = (str: string) => {
	if (!str || typeof str !== 'string') return ''
	return str.replace(/-([a-z])/g, (all, i) => {
		return i.toUpperCase()
	})
}
/**
 * 将骆驼命名规则的字符串转换成使用短横线命名法的字符串
 * @param str
 * @returns
 */
export const getKebabCase = (str: string) => {
	if (!str || typeof str !== 'string') return ''
	return str.replace(/[A-Z]/g, function (i) {
		return '-' + i.toLowerCase()
	})
}

/**
 * 图标名称转换：将el-icon的组件名称由驼峰转化为短横线形式
 * @param iconName AbcDef
 * @returns  i-abc-def
 */
export const transElIconName = (iconName: string) => {
	return 'i' + iconName.replace(/[A-Z]/g, match => '-' + match.toLowerCase())
}

// 数字 大小写字母
export const regsn = /^[A-Za-z0-9]+$/

// 数字 大小写字母 汉字
export const regsnc = /^[\u4E00-\u9FA5A-Za-z0-9]/

// 数字 大小写字母 特殊符号
export const regsnt = /[A-Za-z0-9_~!@#$%^&/*]/

export const downloadExcel = (res, fileName) => {
	// Blob 对象表示一个不可变、原始数据的类文件对象（File 接口都是基于Blob
	function computedFileName() {
		const timestamp = new Date().toLocaleString().replaceAll('/', '').replaceAll(':', '').replace('下午', '')
		const defaultFileName = res.headers['content-disposition'].split(';')[1] // 后台获取的文件名
		const extName = defaultFileName ? defaultFileName.split && defaultFileName.split('=')[1] : 'xls' //  获取文件名后缀
		return fileName ? `${fileName}_${timestamp}.${extName}` : `${decodeURIComponent(extName)}`
	}
	const BLOB = new Blob(res.data)
	const fileReader = new FileReader() // FileReader 对象允许Web应用程序异步读取存储在用户计算机上的文件的内容
	fileReader.readAsDataURL(BLOB) // 开始读取指定的Blob中的内容。一旦完成，result属性中将包含一个data: URL格式的Base64字符串以表示所读取文件的内容
	fileReader.onload = event => {
		// 处理load事件。该事件在读取操作完成时触发
		// 新建个下载的a标签，完成后移除。
		const a = document.createElement('a')
		a.download = computedFileName()
		a.href = event?.target?.result as string
		document.body.appendChild(a)
		a.click()
		document.body.removeChild(a)
	}
}
export const isArray = key => {
	return Object.prototype.toString.call(key).includes('Array')
}
export const isString = key => {
	return Object.prototype.toString.call(key).includes('String')
}
export const resetFormData = form => {
	Object.keys(form).forEach(key => {
		if (isString(form[key])) {
			Reflect.set(form, key, '')
		} else if (isArray(form[key])) {
			Reflect.set(form, key, [])
		} else {
			Reflect.set(form, key, form[key])
		}
	})
}

/**
 * @description 筛选树
 * @param tree
 * @param func
 */
export function treeFilter(tree, callback: Function) {
	if (!Array.isArray(tree) || tree.length === 0) {
		return []
	}
	return tree
		.map(node => ({ ...node }))
		.filter(node => {
			node.children = node.children && treeFilter(node.children, callback)
			return callback(node) || (node.children && node.children.length)
		})
}

/**
 * @description 遍历树
 * @param tree
 * @param callback
 */
export function trerTraversal(tree, callback: Function) {
	// 维护一个队列, 队列的初始值为树的根节点组成的列表, 重复执行一下步骤直至数组为空
	let node
	const list = [...tree]
	while ((node = list.shift())) {
		callback(node)
		node.children && list.push(...node.children)
	}
}

/**
 * @description 获取树中的所有叶子结点
 * @param tree
 */
export function getAllLeaf(tree) {
	const result = []
	const getLeaf = tree => {
		tree.forEach(item => {
			if (!item.children) {
				result.push(item as never)
			} else {
				getLeaf(item.children)
			}
		})
	}
	getLeaf(tree)
	return result
}

/**
 * @param res 接口响应的 blob
 * @param filename 文件名称
 */
export const downloadFile = async (res, filename = 'filename') => {
	const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/vnd.ms-excel' }))
	const timestamp = new Date().getTime()
	const link = document.createElement('a')
	link.style.display = 'none'
	link.setAttribute('download', `${filename}${timestamp}.xlsx`)
	link.href = url
	document.body.append(link)
	link.click()
	document.body.removeChild(link)
}
/**
 * @param res 接口响应的 blob
 * @param filename 文件名称
 */
export const downloadFileByUrl = async (url, filename = 'filename') => {
	const timestamp = new Date().getTime()
	const link = document.createElement('a')
	link.style.display = 'none'
	link.setAttribute('download', `${filename}${timestamp}.xlsx`)
	link.href = url
	document.body.append(link)
	link.click()
	document.body.removeChild(link)
}
