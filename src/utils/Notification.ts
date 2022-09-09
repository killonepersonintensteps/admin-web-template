import { ElNotification, ElMessageBox } from 'element-plus'
export interface NotificationInstace {
    success: (msg: string) => void
    warning: (msg: string) => void
    error: (msg: string) => void
    info: (msg: string) => void
}

export interface MessageBoxInstance {
    confirm: (message: string) => Promise<boolean | string>
    alert: (message: string, tips?: string) => Promise<boolean | string>
}

export const Notification: NotificationInstace = {
    success: message => {
        ElNotification({
            type: 'success',
            title: '提示',
            message: message,
            duration: 2000,
        })
    },
    error: message => {
        ElNotification({
            type: 'error',
            title: '错误',
            message: message,
            duration: 2000,
        })
    },
    info: message => {
        ElNotification({
            type: 'info',
            title: '提示',
            message: message,
            duration: 2000,
        })
    },
    warning: message => {
        ElNotification({
            type: 'warning',
            title: '警告',
            message: message,
            duration: 2000,
        })
    },
}

export const MessageBox: MessageBoxInstance = {
    confirm: message => {
        return ElMessageBox.confirm(message, '提示', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        })
    },
    alert: (message, tips = '提示') => {
        return ElMessageBox.alert(message, tips, {
            confirmButtonText: '确认',
            type: 'error',
        })
    },
}
