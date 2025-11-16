import _ from 'lodash'
import authService from '/src/services/api/AuthService'

export const isDigit = (x) => '0' <= x && x <= '9'

export const delay = (duration) =>
  new Promise((resolve) => setTimeout(resolve, duration))

export const checkLogin = _.debounce((callback) => {
  const check = async () => {
    try {
      const response = await authService.checkLogin()
      callback(!!response.data.valid)
    } catch (e) {
      console.log(e)
      callback(false)
    }
  }
  check()
}, 100)

export const formatDateWithSuffix = (dateString) => {
  const date = new Date(dateString)

  const day = date.getDate()

  const getSuffix = (d) => {
    if (d >= 11 && d <= 13) return 'th'
    const last = d % 10
    if (last === 1) return 'st'
    if (last === 2) return 'nd'
    if (last === 3) return 'rd'
    return 'th'
  }

  const suffix = getSuffix(day)
  const month = date.toLocaleString('en-US', { month: 'short' })
  const year = date.getFullYear()

  return `${day}${suffix} ${month} ${year}`
}
