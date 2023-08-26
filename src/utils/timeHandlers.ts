// 时间格式转换工具
import moment from 'moment'
export const timeFormatter = (row: any, column: any, value: string) => {
  return moment(value).format('YYYY-MM-DD HH:mm:ss')
}
