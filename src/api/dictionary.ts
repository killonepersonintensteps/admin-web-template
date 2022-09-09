import request from '@/utils/request'
import qs from 'qs'
// import type { commonListResponse } from '@/api/types/common'
// import type { dictionaryTableData } from '@/api/types/dictionary'
/**
 * 分页获取字典列表
 */
export const fetchDictList = data => {
    return request.post(`/dictionary-type/page`, data)
}

/**
 * 新增字典类型
 */
export const createDict = data => {
    return request.post(`/dictionary-type/add`, data)
}

/**
 * 删除字典类型
 */
export const deleteDict = data => {
    return request.delete(`/dictionary-type/delete`, { data })
}

/**
 * 修改字典类型
 */
export const updateDict = data => {
    return request.put(`/dictionary-type/update`, data)
}

/**
 * 字典类型的启用/停用
 */
export const enable = data => {
    return request.put(`/dictionary-type/updateStatus`, data)
}

/**
 * 根据名称获取字典类型 判断字典名称的唯一性
 */
export const getDictByName = data => {
    // return request.get(`/dictionary-type/getDictionaryTypeByName/${dictName}`)
    return request.post(`/dictionary-type/getDictionaryTypeByName`, data)
}

/**
 * 根据名称获取字典类型
 */
export const getDictById = dictId => {
    return request.get(`/dictionary-type/getDictionaryByDictId/${dictId}`)
}

/**
 * 获取所有字典类型
 */
export const getDictAll = () => {
    return request.get(`/dictionary-type/getDictionaryType`)
}
/**
 * 下载删除失败日志
 */
export const downloadFailLogAsync = data => {
    return request.post(`/dictionary-type/downloadFailLog`, qs.stringify(data), {
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
        },
    })
}

/**
 * 下载删除失败日志
 */
export const getDictDataById = dictId => {
    return request.get(`/dictionary-type/getDictionaryByDictId/${dictId}`)
}
