import myAxios from './axios'

/**
 *
 * 获取验证码
 * @param {string} mobile 手机号
 */
export const getQQMsg = (qq) => {
  return myAxios({
    url: '/qq',
    method: 'get',
    params: { qq }
  })
}
