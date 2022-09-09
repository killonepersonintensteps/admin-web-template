/*
 * @Author: 李晓宁 xiaoning.li@inossem.com
 * @Date: 2022-06-24 10:19:10
 * @LastEditors: 李晓宁 xiaoning.li@inossem.com
 * @LastEditTime: 2022-06-25 16:27:37
 * @FilePath: /middle-platform-web-indata/src/components/in-map/map.d.ts
 * @Description: BMap的类型 扩展
 */
export interface BMapInstace extends EventTarget {
    /** 开启鼠标滚轮缩放 */
    enableScrollWheelZoom: (b1: boolean) => void

    /**  添加比例尺控件 */
    addControl: (b1: unknown) => void

    /** 设置地图缩放比例 */
    centerAndZoom: (point: unknown, leavel: number) => void

    /** 在地图上添加点标记 */
    addOverlay: (maker: unknown) => void
}

// 基于百度地图的二次封装的地图实例
export interface ScMapInstance {
    initMap: () => Promise<unknown>

    /** 设置地图点标记 */
    setPointMark: (longitude: number, latitude: number) => void

    /** 设置线标记 */
    setLineMark: (longitude: number, latitude: number) => void
}
