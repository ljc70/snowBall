/*
 * @Author: lanjicen
 * @LastEditors: lanjicen
 * @Description:
 * @Date: 2019-08-09 10:38:52
 * @LastEditTime: 2019-08-14 14:44:59
 */
import path from 'path'

let outFileBase = process.env.NODE_ENV !== 'development' ? `${path.join(__dirname, '/../../../../../../vue-tmp/src/App.vue')}` : `${path.join(__static, '/vue-tmp/src/App.vue')}`

export default outFileBase
