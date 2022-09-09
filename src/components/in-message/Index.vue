<!--
 * @Author: 李晓宁 xiaoning.li@inossem.com
 * @Date: 2022-06-25 11:11:10
 * @LastEditors: Danny 564382000@qq.com
 * @LastEditTime: 2022-08-05 16:49:51
 * @FilePath: /middle-platform-web-indata/src/components/in-message/index.vue
 * @Description: 删除、启用、停用成功失败条数提示的 modal
-->
<template>
    <!-- 删除成功或失败的消息提示 -->
    <el-dialog v-model="dialogVisible" title="提示" width="560px">
        <template #header>
            <div>
                <in-icon name="tishi" style="color: rgb(255, 153, 0); width: 13px; height: 13px"></in-icon>
                提示
            </div>
        </template>
        <el-descriptions title="" :column="1">
            <el-descriptions-item v-if="props.messageData.totalNum">
                <span>共选择{{ props.messageData.messageType }}数据</span>
                <span>{{ props.messageData.totalNum }}</span>
                <span>条</span>
            </el-descriptions-item>

            <el-descriptions-item v-show="!!props.messageData.successNum">
                <span>成功</span>
                <span class="success"> {{ props.messageData.successNum }}</span>
                <span>条</span>
            </el-descriptions-item>

            <el-descriptions-item v-show="!!props.messageData.errorNum">
                <span>失败</span>
                <span class="error"> {{ props.messageData.errorNum }}</span>
                <span>条</span>
                <span v-if="errorReasonIsArray || errorReasonIsString">失败原因：</span>
            </el-descriptions-item>
            <template v-if="errorReasonIsArray">
                <el-descriptions-item v-for="(item, index) in props.messageData.errorReason" :key="index">
                    <!-- {{ item.errorReason }} -->
                </el-descriptions-item>
            </template>
            <template v-if="errorReasonIsString">
                <el-descriptions-item>
                    {{ props.messageData.errorReason }}
                </el-descriptions-item>
            </template>
        </el-descriptions>
        <template #footer>
            <span class="dialog-footer">
                <!-- <el-link type="primary" @click="downloadFailLog"></el-link> -->
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import { computed } from '@vue/reactivity'
import { ref, withDefaults, defineProps, defineExpose } from 'vue'
interface Props {
    messageData: {
        messageType?: string
        totalNum?: number
        successNum?: number
        errorNum?: number
        errorReason?: string | unknown[]
    }
}
const props = withDefaults(defineProps<Props>(), {
    messageData: () => {
        return {
            messageType: '删除',
            totalNum: 0,
            successNum: 0,
            errorNum: 0,
            errorReason: '',
        }
    },
})

const errorReasonIsArray = computed(() => {
    return Array.isArray(props.messageData.errorReason) && props.messageData.errorReason.length > 0
})

const errorReasonIsString = computed(() => {
    return typeof props.messageData.errorReason === 'string' && props.messageData.errorReason !== ''
})

const dialogVisible = ref(false)

defineExpose({
    setMessageModalVisible(visible: boolean) {
        // console.log(props.messageData)

        dialogVisible.value = visible
    },
})
</script>

<style lang="scss" scoped>
.success {
    color: $success;
}
.error {
    color: $error;
}
</style>
