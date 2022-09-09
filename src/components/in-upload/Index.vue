<!--
 * @Author: xiaoning.li@inossem.com
 * @Date: 2022-05-24 10:49:45
 * @LastEditors: xiaoning.li@inossem.com
 * @LastEditTime: 2022-07-27 18:11:54
 * @Description: 图片上传组件(通过v-model语法糖实现实现双向绑定,可实现上传和反显)
-->

<template>
    <div class="in-uplaod" style="width: 100%">
        <el-upload
            ref="upload"
            accept="image/png, image/jpeg, image/jpg"
            list-type="picture"
            :action="action"
            :on-success="onSuccess"
            :on-remove="onRemove"
            :on-change="onChange"
            :file-list="filelist"
            :headers="httpHeaders"
        >
            <el-button type="primary">上传图片</el-button>
            <!-- <template #tip>
            <div class="el-upload__tip">
              jpg/png files with a size less than 500kb
            </div>
          </template> -->
        </el-upload>
    </div>
</template>
<script lang="ts" setup>
import {
    reactive,
    ref,
    watch,
    // computed,
    getCurrentInstance,
    ComponentInternalInstance,
} from 'vue'
import { fetchBase64ImageByPath, uploadFilePath } from '@/api/common'
import { useStore } from 'vuex'
import type { UploadInstance, UploadFile, UploadFiles, UploadUserFile } from 'element-plus'

const { proxy } = getCurrentInstance() as ComponentInternalInstance
// const store = useStore()
const httpHeaders = reactive({
    // Authorization: store.state.token,
})
// 接收参数
const props = defineProps({
    modelValue: String,
    formRef: Object | String, // Form Dom ref
    validateFiled: String, // 图片正则校验的字段
})
// 定义 emits
const emits = defineEmits(['update:modelValue'])

const filelist = ref<UploadUserFile[]>([])
// 根据图片地址获取 base64
const fetchBase64ImageByPathAsync = async (path: string): Promise<void> => {
    const res = await fetchBase64ImageByPath(path)
    if (res.data.code === '200') {
        filelist.value = [{ name: 'image', url: res.data.body }]
    } else {
        proxy?.$notice.error(res.data.msg)
    }
}
watch(
    () => props.modelValue,
    newValue => {
        newValue && fetchBase64ImageByPathAsync(newValue)
    }
)

const action = ref(uploadFilePath)

const upload = ref<UploadInstance>()

function validateImage() {
    props.formRef && props.formRef.validateField(props.validateFiled)
}
const onSuccess = (response, uploadFile: UploadFile, uploadFiles: UploadFiles): void => {
    if (response.returnCode === 1) {
        emits('update:modelValue', response.data?.imagePath)
        validateImage()
    } else {
        proxy?.$notice.error(response.returnMsg)
    }
}

const onRemove = (uploadFile: UploadFile, uploadFiles: UploadFiles): void => {
    emits('update:modelValue', '')
    validateImage()
}

const onChange = (uploadFile: UploadFile, uploadFiles: UploadFiles): void => {
    const fileSize = {
        max: 50 * 1024,
        min: 1 * 1024,
    }

    if ((uploadFile.size && uploadFile.size > fileSize.max) || (uploadFile.size && uploadFile.size < fileSize.min)) {
    }
}
</script>
<style lang="scss" scoped>
.in-uplaod {
    :deep(.el-upload-list) {
        margin: -10px 0 24px 0;
        width: 170px;
        max-height: 96px;
    }
    :deep(.el-upload-list--picture .el-upload-list__item) {
        width: 100%;
        // height: 100%;
        max-height: 96px;
        border: none;
        padding: 20px 20px 3px 3px;
        box-sizing: content-box;
        border-radius: 0;
    }
    :deep(.el-upload-list--picture .el-upload-list__item-thumbnail) {
        width: 100%;
        max-height: 96px;
        height: 100%;
        box-shadow: 0px 0px 5px 0px #d8d8d8;
    }

    :deep(.el-upload-list__item.is-success .el-upload-list__item-status-label) {
        display: none;
    }

    :deep(.el-upload-list__item .el-icon--close) {
        z-index: 999;
        top: 18px;
        color: #333333;
    }
}
</style>
