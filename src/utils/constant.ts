/*
 * @Author: xiaoning.li@inossem.com
 * @Date: 2022-04-27 18:00:58
 * @LastEditors: xiaoning.li@inossem.com
 * @LastEditTime: 2022-07-25 10:20:03
 * @FilePath: /middle-platform-web-indata/src/utils/constant.ts
 * @Description: 提示文案常量维护
 */
// 系统常量
interface tipsText {
    addSuccess: string
    editSuccess: string
    delSuccess: string
    resetPassword: string
    archivedSuccess: string
    uploadSuccess: string
    enableSuccess: string
    disabledSuccess: string
    copySuccess: string
    importSuccess: string
    exportSuccess: string
}
/**
 * @desc 操作成功提示语
 */
export const operationTipText: tipsText = {
    /** 复制成功 */
    copySuccess: '复制成功',
    /** 已禁用 */
    disabledSuccess: '已禁用',
    /** 已启用 */
    enableSuccess: '已启用',
    /** 已删除 */
    archivedSuccess: '已删除',
    /** 添加成功 */
    addSuccess: '添加成功',
    /** 修改成功 */
    editSuccess: '修改成功',
    /** 删除成功 */
    delSuccess: '删除成功',
    /** 重置密码成功 */
    resetPassword: '重置密码成功',
    /** 上传成功 */
    uploadSuccess: '上传成功',
    /** 请在导航栏【任务】中查看导入进展 */
    importSuccess: '请在导航栏【任务】中查看导入进展',
    /** 请在导航栏【任务】中查看导出进展 */
    exportSuccess: '请在导航栏【任务】中查看导出进展',
}
