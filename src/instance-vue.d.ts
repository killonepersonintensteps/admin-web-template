// 扩展 vue 实例方法类型
import '@vue/runtime-core'
import { NotificationInstace, MessageBoxInstance } from '@/utils/Notification'
declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $notice: NotificationInstace
        $inMessageBox: MessageBoxInstance
        isMicroApp: boolean | undefined
    }
}
declare global {
    interface Window {
        __POWERED_BY_QIANKUN__: boolean

        // '__webpack_public_path__': unknown

        __INJECTED_PUBLIC_PATH_BY_QIANKUN__: string

        showLocation: (res: any) => void

        setGlobalState: (state: Record<string, any>) => boolean

        deliveryEmmiter: {
            eventBusListener: {
                refresh: (fn) => void
                goBack: (fn) => void
                updataTask: (fn) => void
            }
            eventBusTrigger: {
                refresh: (data?) => void
                goBack: (data?) => void
                updataTask: (data?) => void
            }
        }
    }
}
