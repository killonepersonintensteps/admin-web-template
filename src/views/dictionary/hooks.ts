import { reactive } from 'vue'
import { getDictByName } from '@/api/dictionary'
import { isCodeUnique } from '@/api/dictionary-manage'

export const formLabelWidth = '120px'

// 支持中文，英文大小写，数字，特殊符号
const regsnc = /^[\u4E00-\u9FA5A-Za-z0-9_~!！@()（）——_·`.,《》？<>?{}【】；：“”‘’。，|#￥$%^/\\*]+$/
// 支持英文大小写，数字，特殊符号
const regsn = /^[A-Za-z0-9_~!！@()（）——_·`.,《》？<>?{}【】；：“”‘’。，|#￥$%^/\\*]+$/

interface RuleOptions {
    ruleType: 'dict' | 'dictValue' // 规则类型(字典类型、字典值)
    operateType: 'add' | 'edit' // 操作类型(新增、修改)
    dictDataId?: number // 字典类型ID
    dictValueDataId?: number // 字典值ID
    checkCodeDictId?: number // 校验字典值编码唯一性时 字典值所属字典类型的id
}

export const useDictRules = (options: RuleOptions) => {
    // 字典值编码
    const dicCodeValitor = async (rule, value, callback) => {
        if (value) {
            const res = await isCodeUnique({
                dicCode: value,
                dictId: options.checkCodeDictId,
                id: options.dictValueDataId || null,
            })
            if (!res.data.data) {
                callback(new Error('编码重复'))
            }
        }

        if (!value) {
            callback(new Error('请输入编码'))
        }
        if (value.length > 50) {
            callback(new Error('编码不得超过50个字符'))
        }
        if (!regsn.test(value)) {
            callback(new Error('只允许输入英文大小写，数字及特殊符号'))
        }

        callback()
    }
    // 字典名称
    const dictNameValitor = async (rule, value, callback) => {
        if (value.trim()) {
            const res = await getDictByName({
                dictName: value,
                id: options.dictDataId || null,
            })
            if (res.data.data.length) {
                callback(new Error('字典名称重复'))
            }
        }
        if (!value) {
            callback(new Error('请输入字典名称'))
        }
        if (value.length > 50) {
            callback(new Error('字典名称不得超过50个字符'))
        }
        if (!regsnc.test(value)) {
            callback(new Error('只允许输入中文，英文大小写，数字及特殊符号'))
        }
        callback()
    }
    // 字典值名称
    const dicNameValitor = async (rule, value, callback) => {
        if (!value) {
            callback(new Error('请输入字典值名称'))
        }
        if (value.length > 50) {
            callback(new Error('字典值名称不得超过50个字符'))
        }
        if (!regsnc.test(value)) {
            callback(new Error('只允许输入中文，英文大小写，数字及特殊符号'))
        }

        callback()
    }
    // 上级节点
    const parentIdValidator = (rule, value, callback) => {
        if (!value) callback(new Error('请选择上级节点'))
        callback()
    }
    // 描述
    const dictDespValidator = (rule, value, callback) => {
        if (value && !regsnc.test(value)) callback(new Error('只允许输入中文，英文大小写，数字及特殊符号'))
        callback()
    }
    return reactive({
        /** 字典编码 */
        dicCode: { required: true, trigger: 'blur', validator: dicCodeValitor },

        /** 字典名称 */
        dictName: { required: true, trigger: 'blur', validator: dictNameValitor },

        /** 字典值描述 */
        dicDesp: { required: false, trigger: 'blur', validator: dictDespValidator },

        /** 字典值名称 */
        dicName: { required: true, trigger: 'blur', validator: dicNameValitor },

        /** 上级节点 */
        parentId: { required: true, trigger: 'change', validator: parentIdValidator },

        /** 字典描述 */
        dictDesp: { required: false, trigger: 'blur', validator: dictDespValidator },
    })
}

export const statusOptions = [
    { label: '全部状态', value: '' },
    { label: '已启用', value: 0 },
    { label: '已停用', value: 1 },
]

// 数据字典状态
export enum DictStatusEnum {
    /** 启用 */
    enable = 0,
    /** 停用 */
    unenable = 1,
}
