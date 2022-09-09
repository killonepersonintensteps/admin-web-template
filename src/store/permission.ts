import { defineStore } from 'pinia'

export const usePermissionStore = defineStore('permission', {
    state: () => {
        return {
            count: 0,
            name: '11111',
        }
    },
    getters: {
        person: state => state.count + state.name,
    },
    actions: {
        increment() {
            this.count++
        },
    },
})
