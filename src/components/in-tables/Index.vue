<!--
 * @Author: xiaoning.li@inossem.com
 * @Date: 2022-07-21 18:35:49
 * @LastEditors: xiaoning.li@inossem.com
 * @LastEditTime: 2022-09-09 10:52:06
 * @Description: 表格组件、包含分页、搜索功能、动态表格的功能
-->

<template>
    <div class="in-table-container">
        <!-- 表格顶部操作去的 slot -->
        <div class="search-container">
            <div class="button-box">
                <slot name="button"></slot>
            </div>
            <div class="search-box">
                <slot name="search"></slot>
            </div>
        </div>
        <!-- 表格 -->
        <el-table
            ref="selectionTable"
            style="width: 100%"
            row-key="id"
            :stripe="true"
            :header-cell-style="headerCellStyle"
            :cell-style="cellStyle"
            :data="props.tableData"
            :default-expand-all="false"
            :select-on-indeterminate="false"
            :tree-props="treeProps"
            @select-all="selectAll"
            @selection-change="handleSelectionChange"
        >
            <el-table-column fixed type="selection" width="40" v-if="props.selectable" />
            <el-table-column label="序号" type="index" :index="indexMethod" width="55" v-if="props.showIndex" />
            <el-table-column
                v-for="(item, index) in props.tableHeader"
                :key="index"
                :prop="item.key"
                :label="item.name"
                :fixed="item.fixed || false"
                :align="item.align || 'left'"
                :width="item.width || 'auto'"
                :sortable="item.sortable || false"
                :show-overflow-tooltip="true"
            >
                <template #default="scope">
                    <template v-if="item.columnType === 'multipleImage'">
                        <img
                            v-for="(imageItem, index) in (scope.row[item.key] as MultipleFileAndImage[])"
                            :key="index"
                            :src="imageItem.url"
                            width="50"
                            @click="openLink(imageItem.url)"
                            class="table-img"
                            title="点击查看"
                            alt="路径不合法"
                        />
                    </template>

                    <template v-else-if="item.columnType === 'multipleFile'">
                        <el-link
                            v-for="(fileItem, index) in (scope.row[item.key] as MultipleFileAndImage[])"
                            :key="index"
                            type="primary"
                            :underline="false"
                            @click="downloadFile(fileItem.url, fileItem.name)"
                        >
                            {{ fileItem.name }}
                        </el-link>
                    </template>

                    <template v-else-if="item.columnType === 'click'">
                        <el-link
                            type="primary"
                            :underline="false"
                            @click.stop="item.clickHandler && item.clickHandler(scope.row, item, index)"
                        >
                            {{ formatRow(scope.row, item) }}
                        </el-link>
                    </template>

                    <template v-else-if="item.columnType === 'link'">
                        <el-link type="primary" :underline="false" @click="openLink(scope.row[item.key])">
                            {{ scope.row[item.key] }}
                        </el-link>
                    </template>

                    <template v-else-if="item.columnType === 'html'">
                        <div v-html="item.htmlString && item.htmlString(scope.row, item)"></div>
                    </template>

                    <template v-else-if="item.columnType === 'select'">
                        <el-select placeholder="请选择" v-model="scope.row[item.key]">
                            <el-option
                                v-for="option in item.selectOptions"
                                :key="option.value"
                                :label="option.label"
                                :value="option.value"
                            />
                        </el-select>
                    </template>

                    <template v-else-if="item.columnType === 'input'">
                        <el-input v-model="scope.row[item.key]" :placeholder="item.placeholder || ''" />
                    </template>

                    <template v-else>
                        {{ formatRow(scope.row, item) }}
                    </template>
                </template>
            </el-table-column>
            <el-table-column fixed="right" align="left" label="操作" :width="props.actionColumnWidth">
                <template #default="scope">
                    <el-link
                        v-for="(item, index) in filterClickData(props.actionBtns, scope.row)"
                        @click="handleAction(item, scope.row)"
                        :key="index"
                        :type="item.type || 'primary'"
                        :underline="item.underline || false"
                    >
                        {{ item.text }}
                    </el-link>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 默认显示 -->
        <div class="in-paginantion-container" v-if="props.pagination">
            <el-pagination
                v-model:currentPage="props.model[props.defaultKey.page]"
                v-model:page-size="props.model[props.defaultKey.size]"
                layout="total, sizes, prev, pager, next, jumper"
                :page-sizes="props.pageSize"
                :small="props.small"
                :disabled="props.disabled"
                :background="props.background"
                :total="props.total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            />
        </div>

        <!-- <TimelineModal ref="timelineRef" />
        <InputFile ref="inputFileRef" />
        <PreviewInputFileDialog
            :title="previewInputFileDialogTitle"
            :visible="previewInputFileDialogVisible"
            :data="previewInputFileDialogData"
            :setVisible="setPreviewInputFileDialogVisible"
        ></PreviewInputFileDialog> -->
    </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref } from 'vue'
import type { ActionColumFiled, tableHeaderFileds, MultipleFileAndImage } from '@/components/types/in-tables'

const props = defineProps({
    modelValue: {
        type: Array,
        default: () => [],
    },
    tableData: {
        type: Array,
        default: () => [],
    },
    tableHeader: {
        type: Array as () => Array<tableHeaderFileds>,
        default: () => [],
    },
    selectable: {
        type: Boolean,
        default: false,
    },
    actionBtns: {
        type: Array as () => Array<ActionColumFiled>,
        default: () => [],
    },
    actionColumnWidth: {
        // 操作列的宽度
        type: String,
        default: '160',
    },
    showIndex: {
        type: Boolean,
        default: false,
    },
    treeProps: {
        type: Object,
        default: () => ({
            children: 'children',
        }),
    },

    // 分页
    // pageNum: {
    //     type: Number,
    //     default: 1
    // },
    total: {
        type: Number,
        default: 0,
    },
    pageSize: {
        type: Array as () => number[],
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
    pagination: {
        type: Boolean,
        default: true,
    },
    fetch: Function,
    model: {
        type: Object,
        default: () => ({}),
    },
})

// 注册自定义事件
const emit = defineEmits(['getSelectedRow', 'clickRow', 'update:modelValue'])
const selectionTable = ref()
// 勾选多选框
const handleSelectionChange = val => {
    emit('update:modelValue', val)
}
const recursionFn = (tree, fn) => {
    tree.forEach(item => {
        fn(item)
        if (item.children && item.children.length) {
            recursionFn(item.children, fn)
        }
    })
}

let isChecked = false
const selectAll = () => {
    isChecked = !isChecked
    recursionFn(props.tableData, item => {
        selectionTable.value.toggleRowSelection(item, isChecked)
    })
}

// 操作按钮的逻辑分发
const handleAction = (item, rowData) => {
    item.handler(rowData)
}

// 表格逻辑处理
const openLink = rowData => {
    if (rowData.includes('base64')) {
        // base64 图片
        const img = new Image()
        img.src = rowData
        img.style.maxWidth = '100%'
        img.style.maxHeight = '100%'
        const newWin = window.open('', '_blank')
        newWin?.document.write(img.outerHTML)
        newWin?.document.close()
    } else {
        // 图片url 或者 link
        window.open(rowData, '_blank')
    }
}

const formatRow = (row, item) => {
    if (Object.prototype.hasOwnProperty.call(item, 'map')) {
        return item.map[row[item.key]] || ''
    } else if (Object.prototype.hasOwnProperty.call(item, 'fun')) {
        return item.fun(row)
    } else {
        return row[item.key]
    }
}

const downloadFile = (url, filename, isBlank = false) => {
    const link = document.createElement('a')
    link.style.display = 'none'
    link.setAttribute('download', filename)
    if (isBlank) {
        link.setAttribute('target', '_blank')
    }
    link.href = url
    document.body.append(link)
    link.click()
    document.body.removeChild(link)
}


const filterClickData = (_data, row) => {
    const __data = _data.filter(item => {
        if (item.disabled) {
            return false
        } else if (!Object.prototype.hasOwnProperty.call(item, 'fun')) {
            return true
        } else if (row) {
            if (Object.prototype.hasOwnProperty.call(item, 'map')) {
                return item.map[row[item.key]]
            }
            if (Object.prototype.hasOwnProperty.call(item, 'fun')) {
                return item.fun(row)
            } else {
                return row[item.key] === item.value
            }
        } else {
            return true
        }
    })
    return __data
}
// 行号
const indexMethod = (index: number) => {
    if (props.pagination) {
        return index + 1 + (props.model[props.defaultKey.page] - 1) * props.model[props.defaultKey.size]
    } else {
        return index + 1
    }
}

// 获取最后一列的索引
const lastColumnIndex = props.tableHeader.length + (props.showIndex ? 2 : 1)

// 表头样式设置
const headerCellStyle = ({ columnIndex }) => {
    const commonStyle = {
        background: '#F7F7F7',
        height: '36px',
        color: '#555555',
        font: 'normal 500 14px "SourceHanSansCN-Medium, SourceHanSansCN"',
        padding: '0',
        // 'border-top': '1px solid rgba(151, 151, 151, 0.28)',
        'border-bottom': '1px solid rgba(151, 151, 151, 0.28)',
    }
    if (columnIndex === 0) {
        // 第一列
        return {
            'border-right': '1px solid rgba(201, 201, 201, 0.28)',
            // 'border-left': '1px solid rgba(201, 201, 201, 0.28)',
            'border-radius': '4px 0 0 0',
            ...commonStyle,
        }
    }
    if (columnIndex === lastColumnIndex) {
        // 最后一列(操作列)
        return {
            'border-left': '1px solid rgba(201, 201, 201, 0.28)',
            'border-radius': '0 4px 0 0',
            // 'border-right': '1px solid rgba(201, 201, 201, 0.28)',
            ...commonStyle,
        }
    }
    return commonStyle
}

// 单元格样式设置
const cellStyle = ({ columnIndex }) => {
    if (columnIndex === 0) {
        // 第一列
        return {
            'border-right': '1px solid rgba(201, 201, 201, 0.28)',
            // 'border-left': '1px solid rgba(201, 201, 201, 0.28)',
            // 'border-bottom': '1px solid rgba(201, 201, 201, 0.28)',
        }
    }
    if (columnIndex === lastColumnIndex) {
        // 最后一列(操作列)
        return {
            'border-left': '1px solid rgba(201, 201, 201, 0.28)',
            // 'border-right': '1px solid rgba(201, 201, 201, 0.28)',
            // 'border-bottom': '1px solid rgba(201, 201, 201, 0.28)',
        }
    }
    return {
        height: '60px',
        color: '#333',
        font: 'normal 400 14px "SourceHanSansCN-Regular, SourceHanSansCN"',
        // 'border-bottom': '1px solid rgba(201, 201, 201, 0.28)',
    }
}

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

<style lang="scss" scoped>
.in-table-container {
    .button-box,
    .search-box {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    :deep(.search-container) {
        padding: 24px 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    :deep(.el-table--striped .el-table__body tr.el-table__row--striped td.el-table__cell) {
        background: #f6f8ff;
    }
    :deep(.el-table td.el-table__cell, .el-table th.el-table__cell.is-leaf) {
        border-bottom: 1px solid transparent;
    }
    :deep(.indeterminate) {
        .el-checkbox__input {
            .el-checkbox__inner {
                background-color: #004fc0;
                border-color: #004fc0;
                color: #fff;
                &::after {
                    border-color: #c0c4cc;
                    background-color: #c0c4cc;
                    content: '';
                    position: absolute;
                    display: block;
                    background-color: #fff;
                    height: 2px;
                    transform: scale(0.5);
                    left: 0;
                    right: 0;
                    top: 5px;
                    width: auto;
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

.status-box {
    display: inline-block;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .hidden-box {
        width: 14px;
        height: 14px;
        // margin-right: 8px;
    }
    .status-text {
        display: inline-block;
        margin-left: 8px;
    }
}
</style>
