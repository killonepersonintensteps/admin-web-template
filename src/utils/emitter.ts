/*
 * @Author: 李晓宁 xiaoning.li@inossem.com
 * @Date: 2022-06-27 09:52:31
 * @LastEditors: 李晓宁 xiaoning.li@inossem.com
 * @LastEditTime: 2022-07-12 10:42:07
 * @FilePath: /middle-platform-web-indata/src/utils/emitter.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import mitt from 'mitt'
const mitter = mitt()
// const eventName = ['refresh', 'goBack']
// 事件监听器
export const eventBusListener = {
    refresh: function (fn) {
        mitter.on('refresh', fn)
    },
    goBack: function (fn) {
        mitter.on('goBack', fn)
    },
    lalala: function (fn) {
        mitter.on('lalala', fn)
    },
    /** @desc 监听导入导出任务更新事件 */
    updataTask: function (fn) {
        mitter.on('updataTask', fn)
    },
}
// 事件触发器 注册事件
export const eventBusTrigger = {
    /** @desc 注册页面刷新事件 */
    refresh: function (data?) {
        mitter.emit('refresh', data)
    },
    /** @desc 注册返回上一页的事件 */
    goBack: function (data?) {
        mitter.emit('goBack', data)
    },
    /** @desc 注册导入导出任务更新事件 */
    updataTask: function (data?) {
        mitter.emit('updataTask', data)
    },
}

export default mitt()
