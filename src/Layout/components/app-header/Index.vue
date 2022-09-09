<template>
    <div class="app-header">
        <a class="app-header-left" href="/">
            <div class="logo">
                <img :src="logoImage" :alt="systemName" />
            </div>
            <div class="appname">{{ systemName }}</div>
        </a>

        <div class="app-header-right">
            <div class="user-avatar" v-if="actionButtons.avatarImg">
                <img src="../../../assets/images/default_avatar.png" alt="用户头像" />
            </div>
            <div class="username" v-if="actionButtons.userName">admin</div>
            <el-dropdown v-if="actionButtons.ButtonLang">
                <span class="el-dropdown-link">
                    中文
                    <el-icon class="el-icon--right">
                        <arrow-down />
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="changelanguage('zh')">中文</el-dropdown-item>
                        <el-dropdown-item @click="changelanguage('en')">English</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
            <div class="logout" @click="logout" v-if="actionButtons.buttonLogout">
                {{ $t('logout') }}
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { getCurrentInstance, ComponentInternalInstance } from 'vue'
import headerConfig from '@/config/layout-header'
const { proxy } = getCurrentInstance() as ComponentInternalInstance

const systemName = headerConfig.systemName
const logoImage = headerConfig.logoImage
const actionButtons = headerConfig.actionButtons

// 退出登录
function logout() {
    proxy?.$inMessageBox.confirm('确定退出吗?').then(() => {
        window.localStorage.clear()
    })
}

const changelanguage = (lang) => {
    console.log(lang)
}
</script>

<style lang="scss" scoped>
.app-header {
    padding: 0 20px 0 40px;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &-left {
        display: flex;
        justify-content: center;
        align-items: center;
        .logo {
            width: 160px;
            height: 28px;
            margin-right: 18px;
            img {
                width: 100%;
                height: 100%;
            }
        }
        .appname {
            font: normal 500 20px 'SourceHanSansCN-Medium, SourceHanSansCN';
            color: #000000;
        }
    }

    &-right {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .user-avatar {
            width: 40px;
            height: 40px;
            margin-right: 14px;
            img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
            }
        }

        .username {
            margin-right: 14px;
            font: normal 400 16px 'SourceHanSansCN-Regular, SourceHanSansCN';
            color: #333333;
        }

        .logout {
            margin-left: 14px;
            cursor: pointer;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            font: normal 400 14px 'SourceHanSansCN-Regular, SourceHanSansCN';
            color: #999999;
            &::before {
                content: '';
                display: inline-block;
                width: 1px;
                height: 16px;
                background: #e0e0e0;
                margin-right: 14px;
            }
        }
    }
}
</style>
