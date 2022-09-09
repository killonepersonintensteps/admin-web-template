/*
 * @Author: 李晓宁 xiaoning.li@inossem.com
 * @Date: 2022-06-30 10:23:39
 * @LastEditors: 李晓宁 xiaoning.li@inossem.com
 * @LastEditTime: 2022-06-30 16:00:34
 * @FilePath: /middle-platform-web-indata/src/components/in-map/index.ts
 * @Description: 百度地图v3.0
 */

/**
 * @desc coordsType指定输入输出的坐标类型
 * @desc 3为gcj02坐标，5为bd0ll坐标
 */
export enum coordsType {
    GCJ02 = 3,
    BD0LL = 5,
}

/** @desc 百度地图实例类型 */
export interface BmapInstance extends EventTarget {
    /** @desc 设置中心点坐标和地图级别 */
    centerAndZoom: (point: unknown, level: number) => void

    /** @desc 开启鼠标滚轮缩放 */
    enableScrollWheelZoom: (enable: boolean) => void

    /** @desc 添加覆盖物 */
    addOverlay: (name: unknown) => void

    /** @desc 添加控件 */
    addControl: (ControlName: unknown) => void
}

export interface BmapClickEvent extends Event {
    point: {
        lng: number
        lat: number
    }
}

export interface GeocInstance {
    getLocation: (ponit: unknown, callback: unknown) => void
}

export interface LngAndLat {
    lng: number
    lat: number
}

/** InMap 封装的实例 */
export interface InBmapInstance {
    initBmap: () => Promise<boolean>

    /** @desc 创建弧线覆盖物 */
    creaetCurveLine: (pointSource: LngAndLat[]) => void

    /** @desc 创建点标记 */
    createPonitMark: (pointSource: LngAndLat[]) => void
}

/** @desc 详细地址 */
export interface Address {
    city: string
    district: string
    province: string
    street: string
    streetNumber: string
    town: string
    lng: number
    lat: number
}
