<!--
 * @Author: 李晓宁 xiaoning.li@inossem.com
 * @Date: 2022-06-30 10:12:14
 * @LastEditors: 李晓宁 xiaoning.li@inossem.com
 * @LastEditTime: 2022-06-30 16:14:56
 * @FilePath: /middle-platform-web-indata/src/components/in-map/Index.vue
 * @Description: 百度地图v3.0 
-->
<template>
	<div id="container"></div>
</template>

<script setup lang="ts">
import { defineExpose, withDefaults, defineProps, defineEmits } from 'vue'
import { BmapInstance, LngAndLat, BmapClickEvent, Address, GeocInstance } from './map'
const BMap = window.BMap
const BMapLib = window.BMapLib
const BMAP_ANCHOR_TOP_LEFT = window.BMAP_ANCHOR_TOP_LEFT

interface Props {
	level?: number,
}
const props = withDefaults(defineProps<Props>(), {
	level: 5
})

const emits = defineEmits<{
	(event: 'onClickMap', id: Address): void
}>()

// 地图实例
let mapInstance: BmapInstance | null = null

// 地址解析器实例
let geocInstance: GeocInstance | null = null

// 创建百度地图点的构造函数
const createPoint = (a, b) => new BMap.Point(a, b)

const mapClickHandler = (event) => {
	const lng = event.point.lng
	const lat = event.point.lat
	const pt = event.point;
	const ponits = [{ lng, lat }]
	createPonitMark(ponits)

	geocInstance?.getLocation(pt, function(rs){
		const addComp = rs.addressComponents
		emits('onClickMap', { ...addComp,  lat, lng})
	})
}

const mapControls = {
	// 比例尺
	// scaleCtrl: new BMap.ScaleControl(),
	// 缩放控件
	zoomCtrl: new BMap.NavigationControl(),
}

/** @desc 初始化地图 */
const initBmap = () => {
	const points = createPoint(116.404, 39.915)

	mapInstance = new BMap.Map('container')

	mapInstance?.centerAndZoom(points, props.level)

	mapInstance?.enableScrollWheelZoom(false)

	// mapInstance?.addControl(mapControls.zoomCtrl)

	// mapInstance?.addControl(mapControls.scaleCtrl)

	geocInstance = new BMap.Geocoder()

	mapInstance?.addEventListener('click', mapClickHandler)

	return Promise.resolve(true)
}


/** @desc 创建弧线线标记 */
const creaetCurveLine = (ponitSource: LngAndLat[]) => {
	const curveConfig = {
		strokeColor: "red",
		strokeWeight: 2,
		strokeOpacity: 0.5
	}
	const points = ponitSource.map(point => new BMap.Point(point.lng, point.lat))

	 // 创建弧线对象
	const curve = new BMapLib.CurveLine(points, curveConfig)
	// 添加到地图中
	mapInstance?.addOverlay(curve)

	// 开启编辑功能
	// curve.enableEditing()
}

/** @desc 创建点标记 */
const createPonitMark = (pointSource: LngAndLat[]) => {

	const points = pointSource.map(point => createPoint(point.lng, point.lat))
	
	const marker = points.map(mark => new BMap.Marker(mark))  

	// eslint-disable-next-line no-new
	new BMapLib.MarkerClusterer(mapInstance, { markers: marker })
}

defineExpose({
	initBmap,
	creaetCurveLine,
	createPonitMark
})
</script>

<style scoped lang="scss">
#container {
    width: 100%;
    height: 100%;
} 
</style>