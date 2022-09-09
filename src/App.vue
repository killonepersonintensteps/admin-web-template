<template>
    <el-config-provider :locale="locale">
        <div class="router-view">
            <router-view />
        </div>
    </el-config-provider>
</template>

<script lang="ts" setup>
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
zhCn.el.pagination = {
    goto: '跳转',
    pagesize: '条/页',
    total: `共 {total} 条数据`,
    pageClassifier: '页',
    deprecationWarning: '',
}
const locale = zhCn
</script>

<style lang="scss">
.router-view {
    width: 100%;
    height: 100%;
}
</style>
