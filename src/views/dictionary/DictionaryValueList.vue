<!--
 * @Author: xiaoning.li@inossem.com
 * @Date: 2022-07-20 09:37:14
 * @LastEditors: xiaoning.li@inossem.com
 * @LastEditTime: 2022-08-09 15:36:44
 * @Description: 数据字典值管理列表
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
                <el-input
                    style="width: 220px; margin-right: 12px"
                    maxlength="100"
                    clearable
                    @blur="fetch"
                    @clear="fetch"
                    @keyup.enter="fetch"
                    v-model="listModel.dicName"
                    placeholder="请输入字典值"
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
                <el-button type="primary" @click="addAccount">新 增</el-button>
                <el-button @click="importBatch">导 入</el-button>
                <el-dropdown style="margin: 0 12px">
                    <el-button>导 出</el-button>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item @click="exportBatch('0')">导出查询结果</el-dropdown-item>
                            <el-dropdown-item @click="exportBatch('2')">导出选中数据</el-dropdown-item>
                            <el-dropdown-item @click="exportBatch('1')">导出全部</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
                <el-button @click="delAccountBatch">删 除</el-button>
                <el-button @click="goBack">返回</el-button>
            </template>
        </in-table>

        <!-- 添加字典值数据 Dialog -->
        <el-dialog
            v-model="addDictDialogVisible"
            title="字典值新增"
            width="560px"
            destroy-on-close
            @close="cancelAddDictForm(addDictFormRef)"
        >
            <el-form :model="form" :rules="addRules" :label-width="formLabelWidth" ref="addDictFormRef">
                <el-form-item label="编码" prop="dicCode">
                    <el-input v-model="form.dicCode" autocomplete="off" placeholder="请输入编码" />
                </el-form-item>
                <el-form-item label="名称" prop="dicName">
                    <el-input v-model="form.dicName" autocomplete="off" placeholder="请输入名称" />
                </el-form-item>

                <el-form-item label="上级节点" :prop="dictValueHasParentNode ? 'parentId' : ''">
                    <!-- 
                        1.当数据字典有上级节点时，显示上级节点数据字典的所有字典值，且必填 
                        2.当数据字典未设置上级节点时，此字段置灰。
                    -->
                    <el-select
                        v-model="form.parentId"
                        placeholder="请选择上级节点"
                        style="width: 100%"
                        clearable
                        filterable
                        :disabled="!dictValueHasParentNode"
                    >
                        <el-option
                            v-for="item in parentNodeOptions"
                            :key="item.id"
                            :label="item.dicName"
                            :value="item.id"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="字典备注" prop="dicDesp">
                    <el-input
                        v-model="form.dicDesp"
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

        <!-- 修改字典值 Dialog -->
        <el-dialog
            v-model="updateDictDialogVisible"
            title="字典值修改"
            width="560px"
            @close="cancelUpdateDictForm(updateDictRef)"
        >
            <el-form :model="form" :rules="editRules" :label-width="formLabelWidth" ref="updateDictRef">
                <el-form-item label="编码" prop="dicCode">
                    <el-input v-model="form.dicCode" autocomplete="off" placeholder="请输入编码" />
                </el-form-item>
                <el-form-item label="名称" prop="dicName">
                    <el-input v-model="form.dicName" autocomplete="off" placeholder="请输入名称" />
                </el-form-item>
                <el-form-item label="字典值排序" class="is-required">
                    <el-input-number v-model="form.dicOrder" :min="1" :max="100000" />
                </el-form-item>
                <el-form-item label="上级节点" :prop="dictValueHasParentNode ? 'parentId' : ''">
                    <!-- 1.当数据字典有上级节点时，显示上级节点数据字典的所有字典值，且必填 
                         2.当数据字典未设置上级节点时，此字段置灰。 
                    -->
                    <el-select
                        v-model="form.parentId"
                        placeholder="请选择上级节点"
                        style="width: 100%"
                        clearable
                        filterable
                        :disabled="!dictValueHasParentNode"
                    >
                        <el-option
                            v-for="item in parentNodeOptions"
                            :key="item.id"
                            :label="item.dicName"
                            :value="item.id"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="字典备注" prop="dicDesp">
                    <el-input
                        v-model="form.dicDesp"
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

        <!-- 导入 Dialog -->
        <el-dialog v-model="importDialogVisible" title="批量导入" width="560px">
            <el-descriptions title="" :column="2">
                <el-descriptions-item label="第一步">请下载导入模版</el-descriptions-item>
                <el-descriptions-item label="">
                    <el-button type="primary" @click="downloadTemplate">下载</el-button>
                </el-descriptions-item>
                <el-descriptions-item label="第二步">请选择导入数据文件(请上传.xslx) </el-descriptions-item>
                <el-descriptions-item label="">
                    <in-FileUpload @file-change="uploadFile"> </in-FileUpload>
                </el-descriptions-item>
            </el-descriptions>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="importDialogVisible = false">取消</el-button>
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
                        {{ item.errorReason }}
                    </el-descriptions-item>
                </template>
            </el-descriptions>
            <template #footer>
                <span class="dialog-footer">
                    <el-link type="primary" @click="downloadFailLog" v-if="deleleFailedReason.errorSize > 10">
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
import { reactive, ref, getCurrentInstance, ComponentInternalInstance, onBeforeMount, computed } from 'vue'
import type { FormInstance } from 'element-plus'
import { downloadFile, resetFormData } from '@/utils/util'
import { eventBusListener, eventBusTrigger } from '@/utils/emitter'
import { useRoute, useRouter } from 'vue-router'
import {
    fetchDictValueList,
    deleteDictValue,
    createDictValue,
    updateDictValue,
    downloadTemplateAsync,
    getParentNode,
    exportDictValue,
    exportChoosed,
    exportAllOrSearch,
    getCurrentValueHasParentId,
} from '@/api/dictionary-manage'
import { useCommonStore } from '@/store/common'
import { operationTipText } from '@/utils/constant'
import { parentNodeField } from '@/api/types/dictionary'
import { formLabelWidth, useDictRules } from './hooks'
const { proxy } = getCurrentInstance() as ComponentInternalInstance
const route = useRoute()
const commonStore = useCommonStore()
const selectedRows = ref([])
const tableHeader = [
    {
        name: '上级节点',
        key: 'parentName',
        sortable: true,
    },
    {
        name: '编码',
        sortable: true,
        key: 'dicCode',
    },
    {
        name: '名称',
        sortable: true,
        key: 'dicName',
    },
    {
        name: '字典值排序',
        sortable: true,
        key: 'dicOrder',
    },
    {
        name: '字典备注',
        key: 'dicDesp',
    },
]
const appId = commonStore.appId
const disabled = ref(false)
const getCurrentValueHasParentIdAsync = async dictId => {
    const res = await getCurrentValueHasParentId(dictId)
    disabled.value = res.data.data
}

const actionBtns = [
    {
        text: '修改',
        handler(rowData) {
            updateDictDialogVisible.value = true
            currentRowInfo.value = rowData
            editRules.value = useDictRules({
                ruleType: 'dictValue',
                operateType: 'edit',
                checkCodeDictId: form.dictId,
                dictValueDataId: rowData.id,
            })
            form.dicCode = rowData.dicCode
            form.dicName = rowData.dicName
            form.parentId = rowData.parentId
            form.dicOrder = rowData.dicOrder
            form.dicDesp = rowData.dicDesp
            getCurrentValueHasParentIdAsync(rowData.id)
        },
    },
    {
        text: '删除',
        handler(rowData) {
            currentRowInfo.value = rowData
            deleteDictValueAsync({
                appId,
                ids: [rowData.id],
            })
        },
    },
]

const parentNodeOptions = ref<parentNodeField[]>([])
// 获取表格数据
const total = ref(0)
const tableData = ref([])
const listModel = reactive({
    dicName: '',
    dictId: Number(route.params.id),
    orderField: '',
    pageNumber: 1,
    pageSize: 20,
    sortType: 'desc',
})

const dictValueHasParentNode = computed(() => parentNodeOptions.value.length > 0)
// 获取字典值父级节点下拉
const getParentNodeAsync = async () => {
    const res = await getParentNode(route.params.id)
    if (res.data.returnCode === 1 && res.data.status) {
        parentNodeOptions.value = res.data.data || []
    } else {
        proxy?.$notice.error(res.data.returnMsg)
    }
}

// 获取用户列表接口
const fetch = async () => {
    // commonStore.loading = true
    const res = await fetchDictValueList(listModel)
    if (res.data.returnCode === 1 && res.data.status) {
        tableData.value = res.data.data.list
        total.value = res.data.data.total
    } else {
        proxy?.$notice.error(res.data.returnMsg)
    }
    commonStore.loading = false
}

const currentRowInfo = ref({})

const form = reactive({
    appId,
    dicCode: '',
    dicDesp: '',
    dicName: '',
    dictId: Number(route.params.id),
    parentId: null,
    dicOrder: 1,
})

const addRules = useDictRules({
    ruleType: 'dictValue',
    operateType: 'add',
    checkCodeDictId: form.dictId,
})
const editRules = ref({})

const addAccount = () => {
    addDictDialogVisible.value = true
    resetFormData(form)
}

// 新增数据字典 start
const createDictValueAsync = async data => {
    const res = await createDictValue(data)
    if (res.data.returnCode === 1 && res.data.status) {
        proxy?.$notice.success(operationTipText.addSuccess)
        addDictDialogVisible.value = false
        fetch()
    } else {
        proxy?.$notice.error(res.data.returnMsg)
        addDictDialogVisible.value = false
    }
}
const addDictDialogVisible = ref(false)
const addDictFormRef = ref<FormInstance>()
const submitAddDictForm = (formEl: FormInstance | undefined) => {
    formEl?.validate(async valid => {
        // console.log(valid)
        valid && createDictValueAsync(form)
    })
}
const cancelAddDictForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    addDictDialogVisible.value = false
    form.parentId = null
}

// 修改数据字典
const updateDictValueAsync = async data => {
    const res = await updateDictValue(data)
    if (res.data.returnCode === 1 && res.data.status) {
        proxy?.$notice.success(operationTipText.editSuccess)
        updateDictDialogVisible.value = false
        fetch()
    } else {
        proxy?.$notice.error(res.data.returnMsg)
        updateDictDialogVisible.value = false
    }
}
const updateDictDialogVisible = ref(false)
const updateDictRef = ref<FormInstance>()
const submitUpdateDictForm = (formEl: FormInstance | undefined) => {
    formEl?.validate(async (valid: boolean) => {
        // console.log(valid)
        valid &&
            updateDictValueAsync({
                appId,
                dicCode: form.dicCode,
                dicDesp: form.dicDesp,
                dicName: form.dicName,
                dicOrder: form.dicOrder,
                dictId: currentRowInfo.value.dictId,
                id: currentRowInfo.value.id,
                parentId: form.parentId,
            })
    })
}
const cancelUpdateDictForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    updateDictDialogVisible.value = false
}

// 删除 start
const deleleFailedReason = reactive({
    totalSize: 0,
    successSize: 0,
    errorSize: 0,
    errorReasonVo: [],
})
const deleteReasonDialogVisiable = ref(false)
const deleteDictValueAsync = async data => {
    await proxy?.$inMessageBox.confirm('确认删除字典值?')
    const res = await deleteDictValue(data)
    if (res.data.status && res.data.returnCode === 1) {
        proxy?.$notice.success('删除成功')
        // deleleFailedReason.totalSize = res.data.data.totalSize
        // deleleFailedReason.successSize = res.data.data.successSize
        // deleleFailedReason.errorSize = res.data.data.errorSize
        // deleleFailedReason.errorReasonVo = res.data.data.errorReasonVo
        // deleteReasonDialogVisiable.value = true
        fetch()
    } else {
        proxy?.$notice.error(res.data.returnMsg)
    }
}
const downloadFailLog = () => {
    // console.log('下载删除日志')
}
const delAccountBatch = () => {
    // 批量删除数据
    if (!selectedRows.value.length) {
        return proxy?.$notice.error('请选择需要删除的数据')
    }

    deleteDictValueAsync({
        appId,
        ids: selectedRows.value.map(item => item.id),
    })
}

/** 下载、上传任务之后, 提交更新任务事件。 告知主应用重新调用获取任务接口 */
const updataTaskByIsMicroApp = () => {
    proxy?.isMicroApp ? window.deliveryEmmiter.eventBusTrigger.updataTask() : eventBusTrigger.updataTask()
}

// 批量导入导出 start
const importDialogVisible = ref<boolean>(false)
const importBatch = () => {
    importDialogVisible.value = true
}

const downloadTemplate = async () => {
    // 下载模版
    const res = await downloadTemplateAsync({
        dictId: route.params.id,
    })
    downloadFile(res, '数据字典模板')
}

/** @desc 导入数据文件 */
const uploadFile = async event => {
    const file = event.target.files[0]
    const formData = new FormData()
    formData.append('appId', String(appId))
    formData.append('dictId', route.params.id as string)
    formData.append('file', file)
    const res = await exportDictValue(formData)
    if (res.data.status && res.data.returnCode === 1) {
        proxy?.$notice.success(operationTipText.importSuccess)
        importDialogVisible.value = false
        fetch()
        updataTaskByIsMicroApp()
    } else {
        proxy?.$notice.error(res.data.returnMsg)
    }
}

// 导出消息提示
const exportMessageTipsHandle = response => {
    // console.log(response.data)
    response.data.data === true
        ? proxy?.$notice.success(operationTipText.exportSuccess)
        : proxy?.$notice.error(response.data.returnMsg)
}

const exportChoosedAsync = async () => {
    // 导出选中数据
    if (!selectedRows.value.length) {
        return proxy?.$notice.error('请选择要导出的数据')
    }
    commonStore.loading = true
    const res = await exportChoosed({
        appId,
        dictId: route.params.id as string,
        ids: selectedRows.value.map(item => item.id),
    })
    commonStore.loading = false
    fetch()
    exportMessageTipsHandle(res)
    updataTaskByIsMicroApp()
    // downloadFile(res, '数据字典')
}

const exportAllOrSearchAsync = async type => {
    // 导出全部或搜索的数据
    commonStore.loading = true
    const res = await exportAllOrSearch({
        appId,
        dictId: route.params.id as string,
        dicName: listModel.dicName,
        exportType: type,
    })
    commonStore.loading = false
    fetch()
    exportMessageTipsHandle(res)
    updataTaskByIsMicroApp()
    // downloadFile(res, '数据字典')
}

const exportBatch = type => {
    type === '2' ? exportChoosedAsync() : exportAllOrSearchAsync(type)
}

const refreshPageHandler = () => {
    listModel.pageNumber = 1
    listModel.pageSize = 20
    listModel.dicName = ''
    listModel.orderField = ''
    listModel.sortType = 'desc'
    listModel.dictId = Number(route.params.id)
    fetch()
}
eventBusListener.refresh(() => {
    refreshPageHandler()
})
const router = useRouter()
const goBack = () => {
    router.push({
        path: '/dictionary/data',
    })
}
onBeforeMount(() => {
    fetch()
    getParentNodeAsync()
})
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
</style>
