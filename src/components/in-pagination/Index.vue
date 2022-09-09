<!--
 * @Author: xiaoning.li@inossem.com
 * @Date: 2022-04-14 16:04:28
 * @LastEditors: xiaoning.li@inossem.com
 * @LastEditTime: 2022-07-27 18:08:01
 * @Description: 分页组件(已废弃、分页工功能已集成到 Intables 组件中)
-->

<template>
    <div class="in-paginantion-container">
        <el-pagination
            v-model:currentPage="props.pageNum"
            v-model:page-size="props.model[defaultKey.size]"
            :page-sizes="props.pageSize"
            :small="props.small"
            :disabled="props.disabled"
            :background="props.background"
            layout="total, sizes, prev, pager, next, jumper"
            :total="props.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
    </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
const props = defineProps({
    pageNum: {
        type: Number,
        defalut: 1,
    },
    total: {
        type: Number,
        default: 0,
    },
    pageSize: {
        type: Array,
        default: () => [10, 20, 30, 40],
    },
    small: {
        type: Boolean,
        default: true,
    },
    background: {
        type: Boolean,
        default: true,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    defaultKey: {
        type: Object,
        default: () => {
            return {
                page: 'pageNumber',
                size: 'pageSize',
            }
        },
    },
    fetch: Function,
    model: Object,
})

// 页面 size 改变
const handleSizeChange = (size: number) => {
    // eslint-disable-next-line vue/no-mutating-props
    props.model[props.defaultKey.size] = size
    props.fetch && props.fetch()
}
// 当前页码改变
const handleCurrentChange = (page: number) => {
    // eslint-disable-next-line vue/no-mutating-props
    props.model[props.defaultKey.page] = page
    props.fetch && props.fetch()
}
</script>

<style scoped lang="scss">
.in-paginantion-container {
    height: 64px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
}
</style>
