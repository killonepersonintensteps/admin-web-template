<template>
    <el-dropdown trigger="click">
        <span class="el-dropdown-link" style="margin-right: 32px;">
            <el-badge :value="taskTotalNum" class="item">
                <in-icon name="renwuzhongxin" class="renwu-icon"></in-icon>
            </el-badge>
        </span>
        <template #dropdown>
            <el-dropdown-menu>
                <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
                    <el-tab-pane :label="`导入(${importNum})`" :name="0">
                        <ul class="task-list">
                            <li class="task-list-item" v-for="(item, index) in taskList" :key="index">
                                <section class="top">
                                    <div class="left" @click="downloadExcel(item)">
                                        <in-icon name="tubiaowenjian" class="xls"></in-icon>
                                        <span class="file-name"> {{ item.attachName || item.originalFileName }}</span>
                                    </div>
                                    <div class="right">
                                        <span>
                                            <in-icon :name="iconName[item.taskStatus]" :class="iconName[item.taskStatus]"/>
                                            <span class="status"> {{ statusMaps[item.taskStatus] }}</span>
                                        </span>
                                        <span class="action" @click="getFailReason(item)"
                                            v-if="item.taskStatus === taskStatusEnum.importFail || item.taskStatus === taskStatusEnum.exportFail"
                                            >查看原因
                                        </span>
                                        <!-- <span class="action" v-if="item.taskStatus === taskStatusEnum.importSuccess" @click="downloadExportFile(item)">下载到本地</span> -->
                                    </div>
                                </section>
                                <section class="bottom">
                                    <div class="nav">
                                        <span>{{ item.modulePath }}</span>
                                    </div>
                                    <div class="time">{{ item.createTime }}</div>
                                </section>
                            </li>
                            <div class="more" @click="goMore">查看更多</div>
                        </ul>
                    </el-tab-pane>
                    <el-tab-pane :label="`导出(${exportNum})`" :name="1">
                        <ul class="task-list">
                            <li class="task-list-item" v-for="(item, index) in taskList" :key="index">
                                <section class="top">
                                    <div class="left">
                                        <in-icon name="xls" class="xls"></in-icon>
                                        <span class="file-name"> {{ item.attachName }}</span>
                                    </div>
                                    <div class="right">
                                        <span>
                                            <in-icon
                                                :name="iconName[item.taskStatus]"
                                                :class="iconName[item.taskStatus]"
                                            >
                                            </in-icon>
                                            <span class="status"> {{ statusMaps[item.taskStatus] }}</span>
                                        </span>
                                        <span
                                            class="action"
                                            v-if="
                                                item.taskStatus === taskStatusEnum.importFail ||
                                                item.taskStatus === taskStatusEnum.exportFail
                                            "
                                            @click="getFailReason(item)"
                                        >
                                            查看原因
                                        </span>
                                        <span class="action" v-if="item.taskStatus === taskStatusEnum.exportSuccess" @click="downloadExportFile(item)">下载到本地</span>
                                    </div>
                                </section>
                                <section class="bottom">
                                    <div class="nav">
                                        <span>{{ item.modulePath }}</span>
                                    </div>
                                    <div class="time">{{ item.createTime }}</div>
                                </section>
                            </li>
                            <div class="more" @click="goMore">查看更多</div>
                        </ul>
                    </el-tab-pane>
                </el-tabs>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>

<script setup lang="ts">
import { downloadDataFile, getHeadeTaskList } from '@/api/task'
import { useRouter } from 'vue-router'
import { ref, getCurrentInstance, ComponentInternalInstance, onMounted } from 'vue'
import { TabsPaneContext } from 'element-plus'
import { taskStatusMaps, taskStatusEnum } from '@/api/types/task'
import { downloadFile, downloadFileByUrl } from '@/utils/util'
import { eventBusListener } from '@/utils/emitter'
const { proxy } = getCurrentInstance() as ComponentInternalInstance
const activeName = ref(0)
const statusMaps = taskStatusMaps
const iconName = {
    0: 'dengdai',
    1: 'chenggong',
    2: 'shibai',
    3: 'Loading',
    4: 'chenggong',
    5: 'shibai',
    // 0: 'chenggong',
    // 1: 'shibai',
    // 2: 'Loading',
    // 3: 'dengdai',
}
const taskList = ref([
    {
        appId: 0,
        attachName: '',
        attachPath: '',
        createTime: '',
        createUserId: 0,
        createUserName: '',
        id: 0,
        isDelete: 0,
        menuId: 0,
        modifyTime: '',
        modifyUserId: 0,
        modulePath: '',
        originalFileName: '',
        originalFilePath: '',
        reason: '',
        taskStatus: 0,
        taskType: 0,
        taskUrl: '',
    },
])
const importNum = ref(0)
const exportNum = ref(0)
const taskTotalNum = ref(0)
const getHeadeTaskListAsync = async data => {
    const res = await getHeadeTaskList(data)
    if (res.data.status && res.data.returnCode === 1) {
        taskList.value = res.data.data.dataList && res.data.data.dataList.slice(0, 10)
        importNum.value = res.data.data.importNum
        exportNum.value = res.data.data.exportNum
        taskTotalNum.value = res.data.data.total
    } else {
        proxy?.$notice.error(res.data.returnMsg)
    }
}

const router = useRouter()
const goMore = () => {
    router.push({ path: '/task/list' })
}

const handleClick = (tab: TabsPaneContext) => {
    // const maps = {
    //     import: 0,
    //     export: 1,
    // }
    getHeadeTaskListAsync({
        // taskType: maps[tab.paneName as string],
        taskType: tab.paneName,
    })
}
// 下载到本地
const downloadExportFile = row => {
    downloadDataFileAsync({
        downloadType: 1,
        taskId: row.id,
    })
}
// 点击名称下载
const downloadExcel = row => {
    downloadDataFileAsync({
        downloadType: 0,
        taskId: row.id,
    })
}
const downloadDataFileAsync = async data => {
    const res = await downloadDataFile(data)
    downloadFileByUrl(res.data.data.path, '数据字典模板')
}

const getFailReason = task => {
    if (task.taskStatus === taskStatusEnum.importFail) {
        downloadDataFileAsync({
            downloadType: 1,
            taskId: task.id,
        })
    }
    if (task.taskStatus === taskStatusEnum.exportFail) {
        downloadDataFileAsync({
            downloadType: 1,
            taskId: task.id,
        })
    }
}
// 实时更新任务数据
eventBusListener.updataTask(() => {
    getHeadeTaskListAsync({
        taskType: activeName.value,
    })
})

onMounted(() => {
    getHeadeTaskListAsync({
        taskType: activeName.value,
    })
})
</script>

<style scoped lang="scss">
.renwu-icon {
    // width: 20px;
    // height: 20px;
    color: #333;
    cursor: pointer;
    margin-right: 12px;
}
.task-list {
    width: 434px;
    max-height: 436px;
    overflow: auto;
    padding: 16px 20px 0;
    &-item {
        padding: 20px 0 16px 0;
        border-bottom: 1px solid #dcdee0;
        font: normal 400 12px 'SourceHanSansCN-Regular, SourceHanSansCN';
        .top {
            @include flexBetween;
            margin-bottom: 12px;
            .left {
                @include flexBetween;
                .xls {
                    width: 15px;
                    height: 20px;
                    color: #e8edf6;
                    // margin-right: 12px;
                    margin-right: 4px;
                }
                .file-name {
                    cursor: pointer;
                    color: $primary-color;
                }
            }

            .right {
                @include flexBetween;
                min-width: 164px;
                .chenggong {
                    width: 14px;
                    height: 14px;
                    color: $success;
                    margin-right: 8px;
                }
                .shibai {
                    width: 12px;
                    height: 12px;
                    margin-right: 8px;
                }
                .dengdai {
                    width: 12px;
                    height: 12px;
                    margin-right: 8px;
                    color: #f5f5f5;
                }
                .Loading {
                    width: 12px;
                    height: 12px;
                    color: #f78300;
                    margin-right: 8px;
                }
                .status {
                    color: #444444;
                    margin-right: 48px;
                }
                .action {
                    cursor: pointer;
                    color: $primary-color;
                }
            }
        }
        .bottom {
            @include flexBetween;
            .nav {
                @include linkStyle;
                .path::after {
                    content: '>';
                    margin: 0 10px;
                }
                .path:last-child::after {
                    content: '';
                    margin: 0 10px;
                }
            }
            .time {
                color: #777777;
            }
        }
    }
    .more {
        @include linkStyle;
        margin: 14px 0;
        &::after {
            content: '>';
            margin-left: 8px;
        }
    }
}
:deep(.el-tabs__header) {
    margin: 0;
}
:deep(.el-tabs__nav) {
    width: 100%;
}
:deep(.el-tabs__item) {
    text-align: center;
    width: 50%;
}
</style>
