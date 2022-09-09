<!--
 * @Author: xiaoning.li@inossem.com
 * @Date: 2022-07-25 09:30:36
 * @LastEditors: xiaoning.li@inossem.com
 * @LastEditTime: 2022-07-29 17:30:15
 * @Description: 数据字典列表
-->
<template>
    <in-container>
        <in-table
            selectable
            showIndex
            v-model="selectedRows"
            :tableData="tableData"
            :tableHeader="tableHeader"
            :actionBtns="actionBtns"
            :model="listModel"
            :fetch="fetch"
            :total="total"
        >
            <template #search>
                <el-select
                    style="margin-right: 8px"
                    v-model="listModel.dictStatus"
                    placeholder="请选择状态"
                    @change="fetch"
                    @clear="fetch"
                    clearable
                >
                    <el-option
                        v-for="item in statusOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
                <el-input
                    style="width: 220px; margin-right: 8px"
                    maxlength="100"
                    clearable
                    @blur="fetch"
                    @clear="fetch"
                    @keyup.enter="fetch"
                    v-model="listModel.dictName"
                    placeholder="请输入数据字典名称"
                >
                    <template #append>
                        <el-button type="primary" :icon="Search" @click="fetch" />
                    </template>
                </el-input>
                <!-- <span class="refresh-box" @click="refreshPageHandler">
                    <in-icon name="shuaxin" />
                </span> -->
            </template>
            <template #button>
                <el-button type="primary" @click="addDict">新 增</el-button>
                <el-button @click="unEnableBatch">启 用</el-button>
                <el-button @click="enableBatch">停 用</el-button>
                <el-button @click="delAccountBatch">删 除</el-button>
            </template>
        </in-table>

        <!-- 添加字典数据 Dialog -->
        <el-dialog
            v-model="addDictDialogVisible"
            title="数据字典新增"
            width="560px"
            destroy-on-close
            @close="cancelAddDictForm(addDictFormRef)"
        >
            <el-form :model="form" :rules="addRules" :label-width="formLabelWidth" ref="addDictFormRef">
                <el-form-item label="字典名称" prop="dictName">
                    <el-input v-model="form.dictName" autocomplete="off" placeholder="请输入字典名称" />
                </el-form-item>
                <el-form-item label="上级节点">
                    <el-select
                        v-model="form.parentId"
                        placeholder="请选择上级节点"
                        style="width: 100%"
                        clearable
                        filterable
                    >
                        <el-option
                            v-for="item in parentNodeOptions"
                            :key="item.id"
                            :label="item.dictName"
                            :value="item.id"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="字典备注" prop="dictDesp">
                    <el-input
                        v-model="form.dictDesp"
                        autocomplete="off"
                        type="textarea"
                        maxlength="200"
                        show-word-limit
                        :autosize="{ minRows: 3 }"
                        placeholder="请输入字典备注"
                    />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="cancelAddDictForm(addDictFormRef)">取 消</el-button>
                    <el-button type="primary" @click="submitAddDictForm(addDictFormRef)">确 定</el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 修改字典 Dialog -->
        <el-dialog
            v-model="updateDictDialogVisible"
            title="数据字典修改"
            width="560px"
            @close="cancelUpdateDictForm(updateDictRef)"
        >
            <el-form :model="form" :rules="editRules" :label-width="formLabelWidth" ref="updateDictRef">
                <el-form-item label="字典名称" prop="dictName">
                    <el-input v-model="form.dictName" autocomplete="off" placeholder="请输入字典名称" />
                </el-form-item>
                <el-form-item label="上级节点">
                    <el-select
                        v-model="form.parentId"
                        placeholder="请选择上级节点"
                        style="width: 100%"
                        :disabled="disabled"
                        filterable
                        clearable
                    >
                        <el-option
                            v-for="item in parentNodeOptions"
                            :key="item.id"
                            :label="item.dictName"
                            :value="item.id"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="字典备注" prop="dictDesp">
                    <el-input
                        v-model="form.dictDesp"
                        autocomplete="off"
                        type="textarea"
                        maxlength="200"
                        show-word-limit
                        :autosize="{ minRows: 3 }"
                        placeholder="请输入字典备注"
                    />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="cancelUpdateDictForm(updateDictRef)">取 消</el-button>
                    <el-button type="primary" @click="submitUpdateDictForm(updateDictRef)">确 定</el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 删除成功或失败的消息提示 -->
        <el-dialog v-model="deleteReasonDialogVisiable" title="提示" width="560px">
            <template #header>
                <div>
                    <in-icon name="tishi" style="color: rgb(255, 153, 0); width: 13px; height: 13px"></in-icon>
                    提示
                </div>
            </template>
            <el-descriptions title="" :column="1">
                <el-descriptions-item> 共选择删除数据{{ deleleFailedReason.totalSize }}条 </el-descriptions-item>
                <el-descriptions-item v-if="deleleFailedReason.successSize > 0">
                    成功
                    <span class="success">
                        {{ deleleFailedReason.successSize }}
                    </span>
                    条
                </el-descriptions-item>
                <el-descriptions-item v-if="deleleFailedReason.errorSize > 0">
                    失败
                    <span class="error"> {{ deleleFailedReason.errorSize }}</span>
                    条
                    <span v-if="deleleFailedReason.errorReasonVo.length > 0">失败原因：</span>
                </el-descriptions-item>
                <template v-if="deleleFailedReason.errorReasonVo.length > 0">
                    <el-descriptions-item v-for="(item, index) in deleleFailedReason.errorReasonVo" :key="index">
                        {{ item.errorReason }}: {{ item.errorData.join(',') }}
                    </el-descriptions-item>
                </template>
            </el-descriptions>
            <template #footer>
                <span class="dialog-footer">
                    <el-link
                        type="primary"
                        @click="downloadFailLog"
                        v-if="deleleFailedReason.errorSize > 10"
                    >
                        下载失败日志
                    </el-link>
                    <el-button type="primary" @click="deleteReasonDialogVisiable = false"> 确 定 </el-button>
                </span>
            </template>
        </el-dialog>
    </in-container>
</template>

<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
import { reactive, ref, getCurrentInstance, ComponentInternalInstance, onBeforeMount } from 'vue'
import {
    fetchDictList,
    enable,
    createDict,
    updateDict,
    deleteDict,
    getDictAll,
    downloadFailLogAsync,
    getDictDataById,
} from '@/api/dictionary'
import { downloadFile, resetFormData } from '@/utils/util'
import { eventBusListener } from '@/utils/emitter'
import type { ActionColumFiled, tableHeaderFileds } from '@/components/types/in-tables'
import type { FormInstance } from 'element-plus'
import { operationTipText } from '@/utils/constant'
import { litsModel, dictionaryTableData, parentNodeField } from '@/api/types/dictionary'
import { useCommonStore } from '@/store/common'
import { useRouter } from 'vue-router'
import { formLabelWidth, useDictRules, statusOptions, DictStatusEnum } from './hooks'
const { proxy } = getCurrentInstance() as ComponentInternalInstance
const selectedRows = ref<dictionaryTableData[]>([])
const router = useRouter()
const tableHeader: tableHeaderFileds[] = [
    {
        name: '上级节点',
        key: 'parentName',
        sortable: true,
    },
    {
        name: '字典名称',
        key: 'dictName',
        sortable: true,
        columnType: 'click',
        clickHandler(row) {
            router.push({ path: `data/manage/${row.id}` })
        },
    },
    {
        name: '字典备注',
        sortable: true,
        key: 'dictDesp',
    },
    {
        name: '状态',
        key: 'dictStatus',
        sortable: true,
        columnType: 'html',
        htmlString(row) {
            return `<span style="color: ${row.dictStatus === DictStatusEnum.unenable ? '#FF4D4F' : '#00C04E'}">
            ${row.dictStatus === DictStatusEnum.unenable ? '已停用' : '已启用'}
            </span>`
        },
        map: {
            [DictStatusEnum.enable]: '已启用',
            [DictStatusEnum.unenable]: '已停用',
        },
    },
    {
        name: '创建人',
        key: 'createUserName',
    },
    {
        name: '创建时间',
        sortable: true,
        key: 'createTime',
    },
]
const commonStore = useCommonStore()
const appId = commonStore.appId
const parentNodeOptions = ref<parentNodeField[]>([])

const currentRowInfo = ref<dictionaryTableData | null>(null)

const disabled = ref(false)

const editRules = ref({})
const addRules = useDictRules({
    ruleType: 'dict',
    operateType: 'add'
})
/**
 *  @desc 修改字段类型时 获取当前字典类型下是否维护字典值
 *  @desc 若维护了字典值 则上级节点字段不可修改。否则可修改
 */
const getDictDataByIdAsync = async dictId => {
    const res = await getDictDataById(dictId)
    disabled.value = res.data.data.length > 0
}

const actionBtns: ActionColumFiled[] = [
    {
        text: '修改',
        handler(row) {
            if (row.dictStatus === DictStatusEnum.enable) {
                return proxy?.$notice.error('请先将数据字典停用后再修改')
            }
            currentRowInfo.value = row
            editRules.value = useDictRules({
                ruleType: 'dict',
                operateType: 'edit',
                dictDataId: currentRowInfo.value?.id
            })

            form.dictName = currentRowInfo.value?.dictName as string
            form.parentId = currentRowInfo.value?.parentId as number
            form.dictDesp = currentRowInfo.value?.dictDesp as string
            // 获取所有的上级节点 options
            fetchAllParentAsync().then(() => {
                updateDictDialogVisible.value = true
            })
            // 判断上级节点是否可修改
            getDictDataByIdAsync(row.id)
        },
    },
    {
        text: '启用',
        fun(rowData) {
            return rowData.dictStatus === DictStatusEnum.unenable
        },
        handler: function (rowData) {
            enableAsync({
                appId,
                dictStatus: DictStatusEnum.enable,
                ids: [rowData.id],
            })
        },
    },
    {
        text: '停用',
        handler: function (rowData) {
            enableAsync({
                appId,
                dictStatus: DictStatusEnum.unenable,
                ids: [rowData.id],
            })
        },
        fun(rowData) {
            return rowData.dictStatus === DictStatusEnum.enable
        },
    },
    {
        text: '删除',
        handler(rowData) {
            currentRowInfo.value = rowData
            deleteDictAsync({
                appId,
                ids: [rowData.id],
            })
        },
    },
]

// 获取表格数据
const total = ref(0)
const tableData = ref()

const listModel: litsModel = reactive({
    dictName: '',
    pageNumber: 1,
    pageSize: 20,
    dictStatus: '',
    sortType: 'desc',
})

// ---- 启用/停用 start ---
const enableAsync = async data => {
    const isEnable = data.dictStatus === DictStatusEnum.enable
    await proxy?.$inMessageBox.confirm(isEnable ? '确认启用数据字典' : '确认停用数据字典')
    const res = await enable(data)
    if (res.data.status && res.data.returnCode === 1) {
        proxy?.$notice.success(isEnable ? '启用成功' : '停用成功')
        fetch()
    } else {
        proxy?.$notice.error(res.data.returnMsg)
    }
}

const enableBatch = () => {
    // 批量停用
    if (!selectedRows.value.length) {
        return proxy?.$notice.error('请选择需要停用的数据字典')
    }

    enableAsync({
        appId,
        dictStatus: DictStatusEnum.unenable,
        ids: selectedRows.value.map(item => item.id),
    })
}

const unEnableBatch = () => {
    // 批量启用
    if (!selectedRows.value.length) {
        return proxy?.$notice.error('请选择需要启用的数据字典')
    }

    enableAsync({
        appId,
        dictStatus: DictStatusEnum.enable,
        ids: selectedRows.value.map(item => item.id),
    })
}
// ---- 启用/停用 end ----

// ---- 删除 start ----
const deleleFailedReason = reactive({
    totalSize: 0,
    successSize: 0,
    errorSize: 0,
    errorReasonVo: [],
    fileName: '',
})
const deleteDictAsync = async data => {
    await proxy?.$inMessageBox.confirm('确认删除数据字典?')
    const res = await deleteDict(data)
    if (res.data.status && res.data.returnCode === 1) {
        // proxy?.$notice.success('删除成功')
        deleleFailedReason.totalSize = res.data.data.totalSize
        deleleFailedReason.successSize = res.data.data.successSize
        deleleFailedReason.errorSize = res.data.data.errorSize
        deleleFailedReason.errorReasonVo = res.data.data.errorReasonVo
        deleleFailedReason.fileName = res.data.data.fileName
        deleteReasonDialogVisiable.value = true
        fetch()
    } else {
        proxy?.$notice.error(res.data.returnMsg)
    }
}

const delAccountBatch = () => {
    // 批量删除
    if (!selectedRows.value.length) {
        return proxy?.$notice.error('请选择需要删除的数据')
    }

    deleteDictAsync({
        appId,
        ids: selectedRows.value.map(item => item.id),
    })
}

// 下载删除失败日志
const downloadFailLog = async () => {
    const res = await downloadFailLogAsync({
        fileName: deleleFailedReason.fileName,
    })
    downloadFile(res, '失败日志')
}
// ---- 删除 end ----
type nullAndNumber = null | number
const form = reactive({
    appId,
    dictDesp: '',
    dictName: '',
    parentId: null as nullAndNumber,
})

const deleteReasonDialogVisiable = ref<boolean>(false)

//  添加字典数据 start
const addDictDialogVisible = ref(false)
const addDictFormRef = ref<FormInstance>()
const addDict = () => {
    fetchAllParentAsync().then(res => {
        addDictDialogVisible.value = true
        resetFormData(form)
    })
}

const createDictAsync = async data => {
    const res = await createDict(data)
    if (res.data.status && res.data.returnCode === 1) {
        proxy?.$notice.success(operationTipText.addSuccess)
        fetch()
        addDictDialogVisible.value = false
    } else {
        addDictDialogVisible.value = false
        proxy?.$notice.error(res.data.returnMsg)
    }
}

const submitAddDictForm = (formEl: FormInstance | undefined) => {
    formEl?.validate(async (valid: boolean) => {
        valid && createDictAsync(form)
    })
}
const cancelAddDictForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    addDictDialogVisible.value = false
    // TODO: 关闭dialog
    form.parentId = null
}
//  添加字典数据 end

//  修改字典数据 start
const updateDictAsync = async data => {
    const res = await updateDict(data)
    if (res.data.status && res.data.returnCode === 1) {
        proxy?.$notice.success(operationTipText.editSuccess)
        fetch()
        updateDictDialogVisible.value = false
    } else {
        proxy?.$notice.error(res.data.returnMsg)
    }
}
const updateDictDialogVisible = ref(false)
const updateDictRef = ref<FormInstance>()
const submitUpdateDictForm = (formEl: FormInstance | undefined) => {
    formEl?.validate(async valid => {
        form.id = currentRowInfo.value?.id
        valid && updateDictAsync(form)
    })
}
const cancelUpdateDictForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    updateDictDialogVisible.value = false
    resetFormData(form)
}
//  修改字典数据 start

// 刷新列表数据
const refreshPageHandler = () => {
    listModel.pageNumber = 1
    listModel.pageSize = 10
    listModel.dictName = ''
    listModel.dictStatus = ''
    fetch()
}

eventBusListener.refresh(() => {
    refreshPageHandler()
})

// 获取字典值列表
const fetch = async () => {
    commonStore.loading = true
    const res = await fetchDictList(listModel)
    if (res.data.returnCode === 1 && res.data.status) {
        tableData.value = res.data.data.list
        total.value = res.data.data.total
    } else {
        proxy?.$notice.error(res.data.returnMsg)
    }
    commonStore.loading = false
}

// 获取所有父级节点
const fetchAllParentAsync = async () => {
    const res = await getDictAll()
    if (res.data.returnCode === 1 && res.data.status) {
        parentNodeOptions.value = res.data.data
    } else {
        proxy?.$notice.error(res.data.returnMsg)
    }
    return Promise.resolve(true)
}

onBeforeMount(() => {
    fetch()
})
const rules = useDictRules()
</script>

<style lang="scss" scoped>
.refresh-box {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 32px;
    height: 32px;
    background: #ffffff;
    border-radius: 4px;
    border: 1px solid #d5d5d5;
    color: #666666;
    cursor: pointer;
}
.success {
    color: $success;
}
.error {
    color: $error;
}
</style>
