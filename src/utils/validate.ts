import moment from 'moment'

// export function isvalidUsername(str) {
//     const valid_map = ['admin', 'editor']
//     return valid_map.indexOf(str.trim()) >= 0
// }

// 合法uri
export function validateURL(textval) {
    const urlregex =
        /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
    return urlregex.test(textval)
}

// 小写字母
export function validateLowerCase(str) {
    const reg = /^[a-z]+$/
    return reg.test(str)
}

// 大写字母
export function validateUpperCase(str) {
    const reg = /^[A-Z]+$/
    return reg.test(str)
}

// 大小写字母
export function validateAlphabets(str) {
    const reg = /^[A-Za-z]+$/
    return reg.test(str)
}

/**
 * validate email
 * @param email
 * @returns {boolean}
 */
export function validateEmail(email) {
    const re =
        // eslint-disable-next-line no-useless-escape
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(email)
}

// 手机打码
export const maskmobile = mobile => {
    if (!mobile) return
    return mobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}
// 身份证打码
export const maskIdNumber = id => {
    return id.replace(/^(.{3})(.*)(.{4})$/, '$1********$3')
}
/**
 * 格式化时间
 */
export const formatDate = (value, pattern) => {
    pattern = pattern || 'YYYY-MM-DD HH:mm:ss'
    if (!value || value === '') return ''
    return moment(value).format(pattern)
}
/**
 * table表格内数据过滤
 */
export const formatTable = {
    phone: (() => {
        return maskmobile
    })(),
    card: (() => {
        return maskIdNumber
    })(),
    date: (() => {
        return formatDate
    })(),
}
/**
 * 校验手机号
 */
export const isPhone = phone => {
    return /^1[0-9]{10}$/.test(phone)
}
/**
 * 只能输入0 或非零开头的数字
 */
export const isInteger = value => {
    return /^(0|[1-9][0-9]*)$/.test(value)
}

/**
 * 只能输入数字
 */
export const isNumber = value => {
    return typeof Number(value) === 'number' && Number(value) >= 0
    // return /^[0-9]*$/.test(value) // n位整数
}
/**
 * 校验金额
 */
export const isMoney = value => {
    return /(^[1-9]([0-9]+)?(\.[0-9]{1,4})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(
        value
    )
}
/**
 * 验证小数2位
 */
export const isDouDecimal = value => {
    return /^(\d|[1-9]\d|100)(\.\d{1,2})?$/.test(value)
}
/**
 * 邮箱
 */
export const email = value => {
    return /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/.test(
        value
    )
}
/**
 * 非0正整数
 */
export const isEcpInteger = value => {
    return /^\+?[1-9][0-9]*$/.test(value)
}
export const checkType = value => {
    return Object.prototype.toString.call(value)
}
/**
 * 过滤空格
 */
export const filterSpace = value => {
    return value.replace(/\s+/g, '')
}
/**
 * 校检银行卡
 */
export const validBankNum = bankNum => {
    const pattern = /^([1-9]{1})(\d{14}|\d{15}|\d{18})$/
    if (pattern.test(bankNum)) {
        return true
    } else {
        return false
    }
}
/**
 * 校检身份证
 */
export const isIdCard18 = gets => {
    const Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1] // 加权因子;
    const ValideCode = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2] // 身份证验证位值，10代表X;
    if (gets.length === 18) {
        const idCard = gets.split('') // 得到身份证数组
        if (
            isValidityBrithBy18IdCard(gets) &&
            isTrueValidateCodeBy18IdCard(idCard)
        ) {
            return true
        }
        return false
    }
    return false

    function isTrueValidateCodeBy18IdCard(idCard) {
        let sum = 0 // 声明加权求和变量
        if (idCard[17].toLowerCase() === 'x') {
            idCard[17] = 10 // 将最后位为x的验证码替换为10方便后续操作
        }
        for (let i = 0; i < 17; i++) {
            sum += Wi[i] * idCard[i] // 加权求和
        }
        const valCodePosition = sum % 11 // 得到验证码所位置
        if (idCard[17] === ValideCode[valCodePosition]) {
            return true
        }
        return false
    }

    function isValidityBrithBy18IdCard(idCard18) {
        const year = idCard18.substring(6, 10)
        const month = idCard18.substring(10, 12)
        const day = idCard18.substring(12, 14)
        const tempDate = new Date(year, parseFloat(month) - 1, parseFloat(day))
        // 这里用getFullYear()获取年份，避免千年虫问题
        if (
            tempDate.getFullYear() !== parseFloat(year) ||
            tempDate.getMonth() !== parseFloat(month) - 1 ||
            tempDate.getDate() !== parseFloat(day)
        ) {
            return false
        }
        return true
    }
}
/**
 * [isMobile  手机验证]
 */
export const isMobile = gets => {
    return /^1[0-9]{10}$/.test(gets)
}
/**
 * 获取几十天前日期  时间戳
 */
export const getLongTime = (startNum = 30, endNum = 0) => {
    const end = new Date()
    const start = new Date()
    start.setTime(start.getTime() - 3600 * 1000 * 24 * startNum)
    end.setTime(end.getTime() - 3600 * 1000 * 24 * endNum)
    const startTime = moment(start).format('YYYY-MM-DD') + ' 00:00'
    const endTime = moment(end).format('YYYY-MM-DD') + ' 23:59'
    return [
        Number(moment(startTime).format('x')),
        Number(moment(endTime).format('x')),
    ]
}
/**
 * 2019-06-18 23:59:59转时间戳
 * */
export const filterEndTime = date => {
    if (!date) return
    return Number(moment(date).format('x'))
}

/**
 * 获取当前时间
 * YYYY-MM-DD
 */
export const getNowDate = time => {
    const date = time || new Date()
    return moment(date).format('YYYY-MM-DD')
}

/**
 * 获取当前时间
 */
export const getNowFormatDate = time => {
    const date = time || new Date()
    const seperator1 = '-'
    const year = date.getFullYear()
    let month = date.getMonth() + 1
    let strDate = date.getDate()
    if (month >= 1 && month <= 9) {
        month = '0' + month
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
    }
    const currentdate = year + seperator1 + month + seperator1 + strDate
    return currentdate
}
