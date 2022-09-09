<!--
 * @Author: xiaoning.li@inossem.com
 * @Date: 2022-05-31 17:48:06
 * @LastEditors: xiaoning.li@inossem.com
 * @LastEditTime: 2022-08-03 10:11:08
 * @Description: 文件上传按钮
-->
<template>
    <div class="file-upload">
        <input
            style="cursor: hand"
            type="file"
            @change="importFile"
            class="input"
            ref="uploadInput"
            :accept="props.accept.join(',')"
        />
        <el-button type="primary" class="modal">导入</el-button>
    </div>
</template>

<script setup lang="ts">
import { withDefaults, defineProps, defineEmits, ref } from 'vue'

interface Props {
    accept?: string[]
}

const props = withDefaults(defineProps<Props>(), {
    accept: () => [
        '.csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
})

const emits = defineEmits<{
    (e: 'fileChange', fileMeta: Event): void
}>()

const uploadInput = ref<HTMLInputElement | null>(null)
const importFile = (event: Event) => {
    emits('fileChange', event)
    // 兼容: 取消上传或者上传失败后再次选择相同的文件不触发input 的 change 事件
    uploadInput.value && (uploadInput.value.value = '')
}
</script>

<style scoped lang="scss">
.file-upload {
    position: relative;
    min-width: 60px;
    .input {
        position: absolute;
        width: 100%;
        height: 32px;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        z-index: 1;
        opacity: 0;
        cursor: pointer;
    }
    .modal {
        position: absolute;
        left: 44%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
}
</style>
