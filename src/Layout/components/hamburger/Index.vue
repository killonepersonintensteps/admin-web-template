<template>
    <div class="hamburger-container">
        <div class="hamburger">
            <div
                class="btn1"
                :class="{ 'is-active': isActive }"
                @click="handleToggle"
            >
                <!-- <span class="name">{{ isActive ? '展开' : '收起' }}</span> -->
                <in-icon
                    :name="isActive ? 'zhankaicaidan' : 'shouqicaidan'"
                    class="in-icon-fold"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import emitter from '@/utils/emitter'

const isActive = ref(false)
const handleToggle = () => {
    isActive.value = !isActive.value
    emitter.emit('sidebarToggle', isActive.value)
}
</script>

<style lang="scss" scoped>
.hamburger-container {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .hamburger {
        display: flex;
        width: 100%;
        align-items: center;
        height: $hamburgerHeight;
        padding: 0 $basicPadding;
        box-sizing: border-box;
        // background: #fff !important;
        &::before {
            flex: 1;
            height: 1px;
            background-color: $hamburgerLineBg;
            content: '';
        }
        &::after {
            flex: 1;
            height: 1px;
            background-color: $hamburgerLineBg;
            content: '';
        }

        .btn1 {
            .in-icon-fold {
                width: 20px;
                height: 20px;
                cursor: pointer;
                color: #969799;
            }
        }
        .btn {
            flex: 0 0 $hamburgerWidth;
            height: calc($hamburgerHeight / 2);
            background-color: $hamburgerLineBg;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            user-select: none;
            box-sizing: border-box;
            padding: 1px;
            font-size: $fontSize + 2px;
            span {
                display: flex;
                justify-content: center;
                align-items: center;
                &.name {
                    flex: 1;
                    color: $fontColor;
                    font-size: $fontSize;
                }
                &.icon {
                    flex: 0 0 18px;
                    height: 18px;
                    background-color: $fontColor;
                    color: rgb(2, 136, 209);
                }
            }
            &.is-active {
                flex: 0 0 $hamburgerMinWidth;
                justify-content: center;
                span {
                    &.name {
                        display: none;
                    }
                    &.icon {
                        transform: rotate(180deg);
                    }
                }
            }
        }
    }
}
</style>
