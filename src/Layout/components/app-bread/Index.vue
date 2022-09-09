<template>
    <div class="bread-container pb0">
        <div class="bread-container-header">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="item in routes" :key="item.path">
                    <span
                        @click="$router.push({ path: item.path })"
                        :class="[
                            'bread-link',
                            currentPtah === item.path || item.path.includes(':type') ? 'active' : '',
                        ]"
                    >
                        {{ item.meta.title }}
                    </span>
                </el-breadcrumb-item>
            </el-breadcrumb>
            <div class="bread-icon-wrapper" v-if="meta.index === 1" @click="refresh">
                <div class="bread-icon">
                    <in-icon name="shuaxin" />
                </div>
                <span>{{ $t('refresh') }}</span>
            </div>
            <!-- <div class="bread-icon-wrapper" v-if="meta.index === 2" @click="goBack">
                <div class="bread-icon">
                    <in-icon name="fanhui" />
                </div>
                <span>{{ $t('back') }}</span>
            </div> -->
        </div>
        <div class="bread-container-body" v-show="showSystemApp">
            <el-tabs v-model="activeAppId">
                <el-tab-pane v-for="(item, index) in appList" :label="item.appName" :name="item.id" :key="index">
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed, ref } from 'vue'
import { eventBusTrigger } from '@/utils/emitter'
// import { fetchAllAppLists } from '@/api/common'

// TODO: 优化建议提升为全局的类型
interface appInfoType {
    appName: string
    appCode: string
    id: number
}
const router = useRouter()
const route = useRoute()
const appList = ref<appInfoType[]>([])
const currentPtah = computed(() => route.path)
const showTabroutes = ['/permission/menu']
const activeAppId = ref<number>()
const showSystemApp = computed(() => showTabroutes.includes(route.path))

const routes = computed(() => {
    const result = [...route.matched]
    const parentPath = result.at(-1)?.meta.parent
    if (parentPath) {
        result.splice(result.length - 1, 0, parentPath)
        // 动态处理最后一级 meta.title 的值
        if (result[result.length - 1].meta.title === '') {
            currentPtah.value.includes('edit')
                ? (result[result.length - 1].meta.title = `编辑`)
                : (result[result.length - 1].meta.title = `添加`)
        }
    }
    return result
})

const meta = computed(() => route.meta)

// 刷新
function refresh() {
    eventBusTrigger.refresh()
}
// 返回
function goBack() {
    router.go(-1)
    // eventBusTrigger.goBack()
}
</script>

<style lang="scss" scoped>
.bread-container {
    padding: 10px 20px;
    min-height: 40px;
    width: 100%;
    background: #ffffff;
    box-sizing: border-box;
    &.pb0 {
        padding-bottom: 0;
    }
    &-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .el-breadcrumb .bread-link {
            font: normal 400 12px 'SourceHanSansCN-Regular, SourceHanSansCN';
            color: #969799;
            cursor: pointer;

            &.active {
                color: #323233;
            }
        }
        .bread-icon-wrapper {
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            font: normal 400 14px 'SourceHanSansCN-Regular, SourceHanSansCN';
            color: #333;

            .bread-icon {
                width: 16px;
                height: 16px;
                margin-right: 4px;
                margin-bottom: 1px;
            }
        }
    }

    &-body {
        margin-top: 10px;
        :deep(.el-tabs__header) {
            margin: 0;
        }
        :deep(.el-tabs__nav-wrap:after) {
            // el-tab
            content: '';
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            height: 0;
            // background-color: var(--el-border-color-light);
            // z-index: var(--el-index-normal)
        }
    }
}
</style>
