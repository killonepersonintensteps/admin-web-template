<template>
    <el-menu
        class="el-menu-vertical-demo"
        router
        unique-opened
        collapse-transition
        :default-active="defaultActivePath"
        :background-color="AsideConfig.backgroundColor"
        :text-color="AsideConfig.textColor"
        :active-text-color="AsideConfig.activeColor"
        :collapse="isCollapse"
    >
        <template v-for="subMenuItem in routes" :key="subMenuItem.path">
            <!-- 一级菜单 -->
            <el-sub-menu :index="subMenuItem.path" class="active" v-if="!subMenuItem.meta?.isHidden">
                <template #title>
                    <in-icon :name="subMenuItem.meta?.icon" class="menu-icon" />
                    <span>{{ subMenuItem.meta?.title || '' }}</span>
                </template>
                <!-- 子菜单 -->
                <template v-for="child in subMenuItem.children" :key="child.path">
                    <el-menu-item :index="child.path" v-if="!child.meta?.isHidden">
                        <template #title>
                            <in-icon :name="child.meta?.icon" class="menu-icon" />
                            <span>{{ child.meta?.title || '' }}</span>
                        </template>
                    </el-menu-item>
                </template>
            </el-sub-menu>
        </template>
    </el-menu>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, getCurrentInstance, ComponentInternalInstance } from 'vue'
import emitter from '@/utils/emitter'
import AsideConfig from '@/config/layout-aside'
import { useRoute } from 'vue-router'
import { routes } from '@/router/index'
const { proxy } = getCurrentInstance() as ComponentInternalInstance
const isCollapse = ref(false)
const route = useRoute()

const ItemHoverBackgroundColor = AsideConfig.backgroundColorHover
const activeBackground = AsideConfig.activeBackground
const asideMenuWidth = AsideConfig.width
const activeColor = AsideConfig.activeColor
const menuItemHeight = AsideConfig.menuItemHeight
const iconMarginRight = ref(AsideConfig.iconMarginRight)



// 默认选中的菜单
const defaultActivePath = computed(() => {
    const routes = route.path?.split('/')
    return `${routes[0]}/${routes[1]}/${routes[2]}`
})


// 兼容侧边菜单收起时 主内容区域宽度错误
onMounted(() => {
    const domMain = document.querySelector('.layout-body-main') as HTMLElement
    domMain.style.width = `calc(100% - ${asideMenuWidth})`
    !proxy?.isMicroApp && (domMain.style.maxWidth = `calc(100% - ${asideMenuWidth})`)
})

emitter.on('sidebarToggle', bool => {
    // 兼容菜单收起时 ICON 右边距错误
    isCollapse.value = bool as boolean
    iconMarginRight.value = bool ? '0' : AsideConfig.iconMarginRight

    const domMain = document.querySelector('.layout-body-main') as HTMLElement
    const width = bool ? '64px' : asideMenuWidth
    domMain.style.width = `calc(100% - ${width})`
    !proxy?.isMicroApp && (domMain.style.maxWidth = `calc(100% - ${width})`)
})


</script>

<style lang="scss" scoped>
.el-menu-vertical-demo {
    padding-top: 17px;

    // 侧边栏正常宽度
    &:not(.el-menu--collapse) {
        width: v-bind(asideMenuWidth);
    }
    .menu-icon {
        font-size: 18px;
        margin-right: v-bind(iconMarginRight);
    }

}
.el-menu {
    height: 100%;
    border-right: none !important;
    // subMenuItem 高度
    --el-menu-item-height: v-bind(menuItemHeight);
    
    .el-sub-menu {
        margin-bottom: 8px;
        .el-menu-item {
            height: v-bind(menuItemHeight);
            line-height: v-bind(menuItemHeight);
            min-width: 200px;
            margin-bottom: 8px;

            &.is-active  {
                // menuItem 选中的背景颜色
                background: v-bind(activeBackground) !important;

                &::after {
                    content: '';
                    display: inline-block;
                    width: 4px;
                    height: 100%;
                    position: absolute;
                    right: 0;
                    top: 0;
                    background:  v-bind(activeColor);
                    border-radius: 2px;
                }
            }

            // TODO: 为什么 Hover 放到 is-active 之前就不生效
            &:hover {
                // menuItem Hover的背景颜色
                background: v-bind(ItemHoverBackgroundColor) !important;
            }
        }
    }
}

// 选中菜单的父级别菜单的颜色
.is-active :deep(.el-sub-menu__title) {
    color: v-bind(activeColor) !important;
}
</style>
