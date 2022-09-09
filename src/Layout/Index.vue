<!--
 * @Author: xiaoning.li@inossem.com
 * @Date: 2022-08-08 10:22:00
 * @LastEditors: xiaoning.li@inossem.com
 * @LastEditTime: 2022-09-09 10:13:46
 * @Description:  Layout首页
-->

<template>
    <div class="layout-contaner">
        <nav class="layout-header" v-if="!proxy?.isMicroApp  && layoutConfig.header">
            <AppHeader></AppHeader>
        </nav>

        <div class="layout-body">
            <div class="layout-body-aside" v-if="!proxy?.isMicroApp && layoutConfig.aside">
                <AppAside></AppAside>
                <Hamburger v-if="AsideConfig.isBottomCollapse"></Hamburger>
            </div>
            <div class="layout-body-main">
                <keep-alive v-if="!proxy?.isMicroApp">
                    <AppBread></AppBread>
                </keep-alive>
                <div class="main-content-indata">
                    <router-view></router-view>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import AppAside from './components/app-aside/Index.vue'
import AppHeader from './components/app-header/Index.vue'
import Hamburger from './components/hamburger/Index.vue'
import AppBread from './components/app-bread/Index.vue'
import AsideConfig from '@/config/layout-aside'
import headerConfig from '@/config/layout-header'
import layoutConfig from '@/config/layout'
import { getCurrentInstance, ComponentInternalInstance, computed } from 'vue'
const { proxy } = getCurrentInstance() as ComponentInternalInstance
const backgroundColor = AsideConfig.backgroundColor
const asideBoxShadow = AsideConfig.asideBoxShadow

const navHeight = headerConfig.navHeight
const navBoxShadow = headerConfig.navBoxShadow
const navBackground = headerConfig.navBackground
</script>

<style lang="scss" scoped>
.layout-contaner {
    height: 100%;
    display: flex;
    flex-direction: column;
    .layout-header {
        background: v-bind(navBackground);
        height: v-bind(navHeight);
        box-shadow: v-bind(navBoxShadow);
        z-index: 2;
    }

    .layout-body {
        width: 100%;
        height: calc(100% - v-bind(navHeight));
        display: flex;
        box-shadow: 0px 2px 10px 0px rgba(221, 221, 230, 0.5);
        &-aside {
            background: v-bind(backgroundColor);
            box-shadow: v-bind(asideBoxShadow);
            display: flex;
            flex-direction: column;
            overflow: auto;
            z-index: 1;
        }

        &-main {
            flex: 1;
            display: flex;
            flex-direction: column;
            width: 100%;
            .main-content-indata {
                flex: 1;
                padding: 20px;
                background-color: #f5f5f5;
                border-radius: 4px;
                overflow: hidden;
            }
        }
    }
}
</style>
