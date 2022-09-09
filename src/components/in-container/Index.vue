<!--
 * @Author: xiaoning.li@inossem.com
 * @Date: 2022-06-23 09:52:10
 * @LastEditors: xiaoning.li@inossem.com
 * @LastEditTime: 2022-08-03 10:07:05
 * @Description: 页面容器组件 
 -->
<template>
    <div
        :class="[props.isFormPage ? 'form-padding' : 'in-container']"
        v-loading="store.loading"
    >
        <slot name="default"></slot>
    </div>
</template>

<script setup lang="ts">
import { useCommonStore } from '@/store/common'
import { defineProps } from 'vue'
const store = useCommonStore()

const props = defineProps({
    isFormPage: {
        type: Boolean,
        default: false,
    },
})
</script>

<style lang="scss" scoped>
.in-container {
    overflow: auto;
    max-height: 100%;
    background: #fff;
    padding: 0 20px;
    border-radius: 4px;
    position: relative;
    box-shadow: 0px 0px 10px 0px rgba(193,193,193,0.5000);
}
.form-padding {
    max-height: 100%;
    background: #fff;
    padding: 0 20px;
    border-radius: 4px;
    position: relative;
    padding: 20px;
    display: flex;
    box-shadow: 0px 0px 10px 0px rgba(193,193,193,0.5000)
}
</style>
