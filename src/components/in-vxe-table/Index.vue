<template>
    <div class="custom-table-container">
        <div class="search-container">
            <div>
                <slot name="button"></slot>
            </div>
            <div>
                <slot name="search"></slot>
            </div>
        </div>
        <vxe-grid 
            ref="myTable"
            show-overflow
            :max-height="config.maxHeight" 
            :height="config.height" 
            :columns="tableColumn" 
            :data="tableData" 
            :checkbox-config="{checkMethod: checkboxMethodHandler, visibleMethod: visibleMethod}" 
            :row-class-name="rowClassName"
            :cell-class-name="cellClassName"
            :row-config="rowConfig"
            @checkbox-change="handleChange"
            @checkbox-all="selectAll"
            :tree-config="treeConfig">
                <template #pager>
                <div class="in-paginantion-container" v-if="props.pagination">
                    <el-pagination
                        v-model:currentPage="model[defaultKey.page]"
                        v-model:page-size="model[defaultKey.size]"
                        :page-sizes="pageSize"
                        :small="small"
                        :disabled="disabled"
                        :background="background"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                    />
                </div>
            </template>
        </vxe-grid>       
    </div>
</template>

<script lang="ts" setup>
import { onUnmounted, ref, watch } from 'vue'
import Sortable from 'sortablejs'
// eslint-disable-next-line no-undef
const props = defineProps({
    tableColumn: {
        type: Array,
        required: true
    },
    tableData: {
        type: Array,
        required: true
    },
    config: {
        type: Object,
        default: () => {
            return {
                height: 'auto',
                maxHeight: 700
            }
        }
    },
    checkboxEnabled: {
        type: Function,
        required: false,
        default: (row, rowIndex) => true
    },
    treeConfig: {
        type: Object,
        required: false,
        default: () => ({})
    },
    pageConfig: {
        type: Object,
        default: () => {
            return {
                show: true,
                total: 0,
                pageSize: 50,
                currentPage: 1
            }
        }
    },
    noSelectionKey: { // 要拖拽行的key
        type: String,
        default: ''
    },
    sortable: { // 是否要排序
        type: Boolean,
        default: true
    },
    isAll: { // 复选框 触发时候是否要获取全部数据
        type: Boolean,
        default: false
    },
    rowConfig: {
        type: Object,
        default: () => {
            return {
                keyField: 'id'
            }
        }
    },

    fetch: Function,
    total: {
        type: Number,
        default: 0
    },
    pageSize: {
        type: Array,
        default: () => [10, 20, 30, 40]
    },
    small: {
        type: Boolean,
        default: true
    },
    background: {
        type: Boolean,
        default: true
    },
    disabled: {
        type: Boolean,
        default: false
    },
    model: {
        type: Object,
        default: () => { }
    },
    defaultKey: {
        type: Object,
        default: () => {
            return {
                page: 'pageNumber',
                size: 'pageSize'
            }
        }
    },
    pagination: {
        type: Boolean,
        default: true
    },
    modelValue: { // 选中行
        // type: Array,
        type: Array,
        default: []
    },
})

const emit = defineEmits(['pageChange', 'sortInfo', 'selectionChange', 'update:modelValue', 'dragEnd'])

const myTable = ref()
const checkboxMethodHandler = ({ row, rowIndex }) => { // 复选框是否可以勾选
    if (row.disabled) return false;
    return (props as any).checkboxEnabled(row, rowIndex)
};

const visibleMethod = ({row}) => {
    return !(props['noSelectionKey'] in row)
};

const rowClassName = ({ row, rowIndex}) => { // 行 添加类名
    if(props['noSelectionKey'] in row) {
        return 'tree-node-children dragAllow'
    }
    return ''
};

const cellClassName = ({ row, rowIndex }) => { // 单元格添加类名

};

// 多选框勾选或取消勾选
const halfSelectedRows = ref([])
const selectedRows = ref([])
const handleChange = ({ checked, row }) => { // 选中
    selectedRows.value = myTable.value && myTable.value.getCheckboxRecords(true)
    halfSelectedRows.value = myTable.value && myTable.value.getCheckboxIndeterminateRecords(true)
    console.log(selectedRows.value)
    emit('update:modelValue', selectedRows.value)
};

const selectAll = () => { // 全选 
    let allData = myTable.value && myTable.value.getCheckboxRecords(true);
    emit('update:modelValue', allData);
}

const setCheckedRows = (rows, checked) => { // checkedbox 选中
    let key = props['rowConfig']['keyField'];
    let ids = rows.map(item=>item[key]);
    if(Array.isArray(ids) && ids.length) {
        ids.forEach(id=>{
            let row = myTable.value && myTable.value.getRowById(id);
            row && myTable.value && myTable.value.setCheckboxRow(row, checked);

        })
    }
};

let sortableInstance = null;
const createSortableTabele = (tableData) => { // 排序
    const $grid = myTable.value;
    if(!$grid) return;
    sortableInstance = Sortable.create($grid.$el.querySelector('.body--wrapper>.vxe-table--body tbody'), {
        draggable: '.vxe-body--row', 
        sort: true,
        onChoose() {
        },
        onMove({ dragged, related, willInsertAfter }) {
            const targetRowNode = $grid.getRowNode(dragged)
            const targetRow = targetRowNode.item
            const relatedRowNode = $grid.getRowNode(related)
            const relatedRow = relatedRowNode.item
            if(targetRow.parentId !== relatedRow.parentId) {
                return false;
            }
        },
        onEnd(sortableEvent) {
            const targetTrElem = sortableEvent.item;
            const oldIndex = sortableEvent.oldIndex as number;
            const newIndex = sortableEvent.newIndex as number;
            const targetRowNode = $grid.getRowNode(targetTrElem)
            const targetRowData = targetRowNode.item
            
            // const sortParams = {
            //     displayIndex: null,
            //     id: targetRowData.id,
            // }
            const sortParams = ref([])
            // 拖拽一级数据
            if (!targetRowNode.parent) {
                // sortParams.displayIndex = newIndex + 1
                const temp = Array.from(sortableEvent.to.rows).map(elementNode => $grid.getRowNode(elementNode))
                sortParams.value = temp.map((item, index) => ({
                    id: item.rowid,
                    displayIndex: index + 1
                }))
            } else {
                // 拖拽子集
                const oldDataIds = targetRowNode.parent.children.map(item => item.id) 
                const temp = Array.from(sortableEvent.to.rows).map(elementNode => $grid.getRowNode(elementNode))
                const newDataIds = temp.filter(item => oldDataIds.includes(Number(item.rowid))).map(item => Number(item.rowid))
                console.log(newDataIds)
                const targetSortIndex = newDataIds.findIndex(item => item === targetRowData.id)
                // sortParams.displayIndex = targetSortIndex + 1
                sortParams.value = newDataIds.map((id, index) => ({
                    id: id,
                    displayIndex: index + 1
                }))
            }
            console.log(sortParams.value)
            emit('dragEnd', sortParams.value)
        },
    })    
}

// 页面 size 改变
const handleSizeChange = (size: number) => {
    (props as any).model[(props as any).defaultKey.size] = size;
    (props as any).fetch && (props as any).fetch()
}
// 当前页码改变
const handleCurrentChange = (page: number) => {
    (props as any).model[(props as any).defaultKey.page] = page;
    (props as any).fetch && (props as any).fetch()
}

onUnmounted(() => {
    if(props.sortable && sortableInstance) {
        sortableInstance.destroy()
    }
})

watch(() => props.tableData, (newVal) => {
    if (props.sortable && newVal && newVal.length > 0) {
        createSortableTabele(props.tableData)
    }
}, {
    immediate: true,
    deep: true
})

const getSelectedRows = () =>  {
    return {
        selectedRows: selectedRows.value,
        halfSelectedRows: halfSelectedRows.value,
        selectedRowIds: selectedRows.value.map(item => item.id),
        halfSelectedRowIds: halfSelectedRows.value.map(item => item.id),
    }
}

const clearSelected = () => {
    myTable.value && myTable.value.setAllCheckboxRow(false)
}
defineExpose({
    getSelectedRows,
    clearSelected
})
</script>

<style lang="scss" scoped>
@mixin checkboxStyle {
    .vxe-cell--checkbox {
        font-size: 14px;
        .vxe-checkbox--icon {
            font-size: 14px;
            &::before {
                border: 1px solid $checkboxColor;
            }
        }
        &.is--checked {
            .vxe-checkbox--icon {
                &::before {
                    background-color: $primaryColor;
                    border-color: $primaryColor;
                }
            }
        }
        &.is--indeterminate {
            .vxe-checkbox--icon {
                &::before {
                    background-color: $primaryColor;
                    border-color: $primaryColor;
                }
            }
        }
        &:not(.is--disabled):hover{
            .vxe-checkbox--icon {
                &::before {
                    border-color: $primaryColor;
                }
            }
        }
    }
}
@mixin lineStyle {

}

.custom-table-container {
    :deep(.search-container) {
        padding: 24px 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    height: 100%;
    :deep(.vxe-table) {
        color: #333;
        .is--line {
            display: none;
        }
        .vxe-table--header-wrapper {
            background-color: $tableHeadBg;
            color: $tableHeadColor;
            border-top-left-radius: 4px;
            border-top-right-radius: 4px;
            .vxe-table--header {
                width: 100%!important;
                .vxe-header--column {
                    line-height: 22px;
                    padding: 7px 0;
                    font-weight: 500;
                    color: #555;
                    @include checkboxStyle;
                    &.col--checkbox {
                        border-right: 1px solid $tableCellLineColor;
                    }
                    &.col--last {
                        border-left: 1px solid $tableCellLineColor;
                    }
                }
            }
            .vxe-table--header-border-line {
                border-bottom:  1px solid rgba(151, 151, 151, 0.28);
                display: block;
            }
        }
        .vxe-table--body-wrapper {
            .vxe-body--x-space,
            .vxe-body--y-space {
                display: none;
            }
            .vxe-table--body {
                width: 100%!important;
                .vxe-body--row {
                    &:nth-of-type(2n-1) {
                        background-color: #fff;
                    }
                    &:nth-of-type(2n) {
                        background-color: $tableBodyGrayBg;
                    }
                    &:hover,
                    &.row--checked {
                        background-color: $tableBodyActiveBg;
                    }
                    .vxe-body--column {
                        height: 60px!important;
                        @include checkboxStyle;
                        &.col--checkbox {
                            border-right: 1px solid $tableCellLineColor;
                        }
                        &.col--last {
                            border-left: 1px solid $tableCellLineColor;
                        }
                    }
                    &.tree-node-children {
                        background-color: $tableBodyChildRowBg;
                        user-select: none;
                        cursor: move;
                        .vxe-body--column {
                            &.col--checkbox{
                                border-right: none;
                                // display: none;
                                .vxe-cell {
                                    // display: none;
                                    // visibility: hidden;
                                }
                            }
                            &.col--last {
                                border-left: none;
                                .vxe-cell {
                                    display: none;
                                }
                            }
                        }
                    }
                }
            }
        }
        .vxe-tree--btn-wrapper {
            .vxe-tree--node-btn {
                color: #4E5969;
                font-size: 12px;
                &::before {
                    border-radius: 2px;
                }
            }
        }
    }
    &:deep(.vxe-grid--pager-wrapper) {
        .vxe-pager {
            padding: calc($basicSpace * 3) 0;
            border: none;
            box-sizing: border-box;
            height: auto;
            color: #606266;
            .vxe-pager--wrapper {
                .vxe-pager--prev-btn:not(.is--disabled),
                .vxe-pager--next-btn:not(.is--disabled),
                .vxe-pager--jump-prev:not(.is--disabled)
                .vxe-pager--jump-next:not(.is--disabled) {
                    background-color: #f0f2f5;
                    &:hover {
                        color: $primaryColor;
                    }
                }
                .vxe-pager--num-btn {
                    &:hover:not(.is--active) {
                        color: $primaryColor;
                    }
                    &.is--active {
                        background-color: $primaryColor;
                        border-color: $primaryColor;
                    }
                    &:focus {
                        box-shadow: none;
                    }
                }
            }
        }
    }
    .in-paginantion-container {
        height: 64px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }
}
</style>
