<!--
 * @Author: xiaoning.li@inossem.com
 * @Date: 2022-04-24 17:52:49
 * @LastEditors: xiaoning.li@inossem.com
 * @LastEditTime: 2022-07-27 18:09:11
 * @Description: ali 图标 svg 
-->
<template>
    <svg class="icon" aria-hidden="true">
        <use :xlink:href="`#icon-${props.name}`"></use>
    </svg>
</template>

<script setup lang="ts">
import { defineProps, withDefaults } from 'vue'
const props = withDefaults(
    defineProps<{
        name: string
    }>(),
    {
        name: '',
    }
)
</script>

<style scoped>
.icon {
    width: 1em;
    height: 1em;
    /* width: 100%;
    height: 100%; */
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
    cursor: pointer;
}
</style>
