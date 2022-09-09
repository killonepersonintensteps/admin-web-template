<!--
 * @Author: lixiaoning xiaoning.li@inossem.com
 * @Date: 2022-06-23 09:52:10
 * @LastEditors: xiaoning.li@inossem.com
 * @LastEditTime: 2022-07-27 18:09:48
 * @FilePath: /middle-platform-web-indata/src/components/in-map/Index.vue
 * @Description: 基于百度地图GL版的二次开发(已废弃 项目中使用为 百度地图APIv3版本)
-->

<template>
    <div id="container"></div>
</template>

<script setup lang="ts">

import { reject } from 'lodash';
import { resolve } from 'path';
import { defineExpose, defineProps, nextTick, defineEmits, withDefaults } from 'vue'
import { BMapInstace } from './map'
const BMapGL = window.BMapGL

interface Props {
    mapLeval?: number
}
const props = withDefaults(defineProps<Props>(), {
    mapLeval: 5
})

const emits = defineEmits(['onClickMap'])

// 地图实例
let mapInstance: BMapInstace| null = null

// 地址解析器实例
let geocInstance = null
// 地图控件设置选项
const mapControlSetting = {
    enableScrollWheelZoom() { // 开启鼠标滚轮缩放
        mapInstance?.enableScrollWheelZoom(true)
    },
    enableScaleCtrl() {
        const scaleCtrl = new BMapGL.ScaleControl();  // 添加比例尺控件
        mapInstance?.addControl(scaleCtrl);
    },
    enableZoomCtrl() {
        const zoomCtrl = new BMapGL.ZoomControl();  // 添加缩放控件
        mapInstance?.addControl(zoomCtrl);
    }
}
// 初始化渲染地图
const renderMap = () => {
    const point = new BMapGL.Point(116.404, 39.915);

    mapInstance = new BMapGL.Map("container");

    const promise = new Promise((resolve, reject) => {
        mapInstance?.addEventListener('tilesloaded',  () => {
           resolve(true)
        })
    })
    geocInstance = new BMapGL.Geocoder()

    mapInstance?.centerAndZoom(point, props.mapLeval);
    // const marker1 = new BMapGL.Marker(new BMapGL.Point(116.404, 39.925));
    // mapInstance?.addOverlay(marker1);
    // 开启鼠标滚轮缩放
    mapControlSetting.enableScrollWheelZoom()
    // 添加比例尺
    mapControlSetting.enableScaleCtrl()
    // 添加缩放控件
    mapControlSetting.enableZoomCtrl()
    return promise
}
// 初始化 鼠标点击地图获取地址 事件
const initGetLocation = () => {
    mapInstance?.addEventListener('click', (event) => {
        const pt = event.latlng;
        geocInstance.getLocation(pt, function(rs){
            const addComp = rs.addressComponents;
            emits('onClickMap', addComp, event.latlng)
        })
    })
}
// map.addEventListener('tilesloaded', function () {
//     alert('地图加载完成！');
// });
// ---- 实例方法 start ------
const initMap = () => {
    initGetLocation()
    return renderMap()
}

const setPointMark = (longitude, latitude) => {
    const marker = new BMapGL.Marker(new BMapGL.Point(longitude, latitude));
    mapInstance?.addOverlay(marker)
}

const setLineMark = (startPoint, endPoint) => {
    const p1 = new BMapGL.Point(116.301934,39.977552);
    const p2 = new BMapGL.Point(116.508328, 39.919141);
    //     { longitude: 116.415, latitude: 39.931 },
    // { longitude: 116.404, latitude: 39.925 },
    const p3 = new BMapGL.Point(116.415, 39.931);
    const p4 = new BMapGL.Point(116.404, 39.919141);

    const driving = new BMapGL.DrivingRoute(mapInstance, {renderOptions:{map: mapInstance, autoViewport: true}});
    // driving.search(p1, p2);
    driving.search(p3, p4);
}
defineExpose({
    initMap,
    setPointMark,
    setLineMark
})
</script>

<style lang="scss" scoped>
#container {
    width: 100%;
    height: 500px;
}
</style>