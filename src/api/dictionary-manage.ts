/*
 * @Author: xiaoning.li@inossem.com
 * @Date: 2022-06-16 17:40:33
 * @LastEditors: xiaoning.li@inossem.com
 * @LastEditTime: 2022-07-25 16:52:58
 * @FilePath: /middle-platform-web-indata/src/api/dictionary-manage.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from '@/utils/request'
import qs from 'qs'

/**
 * 字典值维护列表
 */
export const fetchDictValueList = data => {
    return request.post(`/dictionary/page`, data)
}

/**
 * 字典值新建
 */
export const createDictValue = data => {
    return request.post(`/dictionary/add`, data)
}
/**
 * 字典值删除
 */
export const deleteDictValue = data => {
    return request.delete(`/dictionary/delete`, { data })
}
/**
 * 字典值修改
 */
export const updateDictValue = data => {
    return request.put(`/dictionary/update`, data)
}

/**
 * 校验编码是否重复
 */
export const isCodeUnique = data => {
    return request.post(`/dictionary/checkDicCode`, data)
}

/**
 * 下载模版
 */
export const downloadTemplateAsync = data => {
    return request.post(`/dictionary/download`, qs.stringify(data), {
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
        },
        responseType: 'blob',
    })
}

/**
 * 导入字典值
 */
export const exportDictValue = data => {
    return request.post(`/dictionary/import`, data)
}

/**
 * 字典值父级节点
 */
export const getParentNode = dictId => {
    return request.get(`/dictionary/getDictionary/${dictId}`)
}

/**
 * 导出选中数据
 */
export const exportChoosed = data => {
    return request.post(`/dictionary/exportSelectData`, data, {
        // responseType: 'blob',
    })
}

/**
 * 导出查询或全部数据
 */
export const exportAllOrSearch = data => {
    return request.post(`/dictionary/export`, data, {
        // responseType: 'blob',
    })
}
/**
 * 根据字典类型id 查看是否有上级节点
 */
export const getCurrentValueHasParentId = dictId => {
    return request.get(`/dictionary/queryParentById/${dictId}`)
}

/**
 * @desc 根据字典值获取字典数据
 * @desc 在其他项目中也用到 能否提取为公共的方法
 */
export const fetchDataIdByName = (dictName, dictId) => {
    return request.get(`/dictionary/dict/${dictName}/${dictId}`)
}
