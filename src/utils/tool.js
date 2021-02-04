import Taro from '@tarojs/taro'

export const updateWeapp = () => {
  try {
    const updateManager = Taro.getUpdateManager()
    updateManager.onUpdateReady(function () {
      Taro.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？'
      }).then((res) => {
        if (res.confirm) {
          // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
          updateManager.applyUpdate()
        }
      })
    })
  } catch (e) {
    console.log('不支持getUpdateManager此方法')
  }
}

export const isPhone = phone => {
  return /^1[3,4,5,6,7,8,9]\d{9}$/.test(phone.toString())
}
export const formatPhone = phone => {
  return String(phone).replace(/^(\d{3})\d*(\d{4}$)/, '$1****$2')
}

export const formatAmount = (amounts, noUnit) => {
  let amount = String(amounts)
  let integer
  if (amount.indexOf('.') > -1) {
    integer = amount.split('.')
    if (integer[0].length > 4) {
      return (amount / 10000).toFixed(2) + '万'
    }
  } else {
    if (amount.length > 4) {
      return (amount / 10000).toFixed(2) + '万'
    }
  }
  return noUnit ? parseFloat(amount).toFixed(2): parseFloat(amount).toFixed(2) + '元'
}

export const formatScore = score => {
  if (score == 1) return (score * 100) + '%'
  return (score * 100).toFixed(2) + '%'
}

export const formatPoint = num => {
  const str = String(num)
  if (str.indexOf('.') > -1) {
    const point = str.split('.')
    const len = point[1].length
    if (len === 0) {
      return str + '00'
    } else if (len === 1) {
      return str + '0'
    } else if (len === 2) {
      return str
    } else if (len > 2) {
      const val = point[1].substring(0, 2)
      return point[0] + '.' + val
    }
  } else {
    return str + '.00'
  }
}

// 小数点格式化
export const dotCtrl = (val) => {
  let value = val
  const len = 2
  value = value.toString();
  value = value.split('.');
  if (value.length > 1) {
    value[1] = value[1].slice(0, len)
  };
  return value.join('.')
}


export const formatParams = data => {
  if (!data) return data
  const obj = Object.keys(data) || []
  let str = ''
  obj.forEach(it => {
    str += it + '=' + data[it] + '&'
  })
  return str.substr(0, str.length -1)
}


export const formatDate = (time, format = 'YY-MM-DD hh:mm:ss') => {
  var date = new Date(time);

  var year = date.getFullYear(),
    month = date.getMonth() + 1,//月份是从0开始的
    day = date.getDate(),
    hour = date.getHours(),
    min = date.getMinutes(),
    sec = date.getSeconds();
  var preArr = Array.apply(null, Array(10)).map(function (elem, index) {
    return '0' + index;
  });////开个长度为10的数组 格式为 00 01 02 03

  var newTime = format.replace(/YY/g, year)
    .replace(/MM/g, preArr[month] || month)
    .replace(/DD/g, preArr[day] || day)
    .replace(/hh/g, preArr[hour] || hour)
    .replace(/mm/g, preArr[min] || min)
    .replace(/ss/g, preArr[sec] || sec);

  return newTime;
}

export const getPagesCount = () => {
  const len = Taro.getCurrentPages().length
  if (len >= 10) {
    Taro.reLaunch({
      url: '/pages/home/index'
    })
    return false
  } else {
    return true
  }
}

export const getStorageSync = (key, val) => {
  let arg = ''
  if (val === '') {
    arg = ''
  } else if (val === null) {
    arg = val
  } else if (Array.isArray(val)) {
    arg = []
  } else {
    arg = {}
  }
  const env = process.env.TARO_ENV
  if (env === 'alipay') {
    const storage = my.getStorageSync({key: key})
    if (storage && (storage.APDataStorage || storage.data)) {
      return (storage.APDataStorage || storage.data)
    } else {
      return arg
    }
  } else {
    const storage = Taro.getStorageSync(key)
    if (storage !== '') {
      return storage
    } else {
      return arg
    }
  }
}

export const isIphoneX = () => {
  const system = Taro.getSystemInfoSync()
  if ((system.model.toLowerCase().indexOf('iphone') > -1) && (system.model.toLowerCase().indexOf("x") >= 0 || (system.model.match(/\d+/g) && system.model.match(/\d+/g)[0] > 8))) {
    return true
  } else {
    return false
  }
}

export const queryString = obj => {
  if (!obj) {
    return ''
  }
  return '?' + Object.keys(obj).map(function (k) {
    return encodeURIComponent(k) + '=' + encodeURIComponent(obj[k])
  }).join('&')
}

export const systemType = (systemInfo, sources) => {
  const env = process.env.TARO_ENV
  let system, phoneType, publishType
  if (env === 'alipay') {
    system = systemInfo.platform
    if (system && system.toLowerCase().indexOf('ios') > -1) {
      phoneType = 2
    } else if (system && system.toLowerCase().indexOf('android') > -1) {
      phoneType = 1
    } else {
      phoneType = 2
    }
    publishType = 3
  } else {
    system = systemInfo.system
    if (system && system.toLowerCase().indexOf('ios') > -1) {
      phoneType = 2
    } else if (system && system.toLowerCase().indexOf('android') > -1) {
      phoneType = 1
    } else {
      phoneType = 1
    }
    if (env === 'weapp') {
      publishType = sources === -1 ? 1 : sources
    } else if (env === 'swan') {
      publishType = 2
    } else {
      publishType = 1
    }
  }
  return {
    phoneType,
    publishType
  }
}


// 函数节流
export const throttle = (context, func, delay, duration, keyword) => {
  // let timer = null,begin = null
  // let current = new Date()
  // 注意此处必须在函数对象上添加属性的方式节流才有效，使用定义变量的方式无效
  clearTimeout(func.timer)
  func.current = new Date()
  if (!func.begin) func.begin = func.current
  if ((func.current - func.begin) >= duration) {
    func.call(context, keyword)
    func.begin = func.current
  } else {
    func.timer = setTimeout(() => {
      func.call(context, keyword)
    }, delay)
  }
}


// 解决使用JSON.stringify循环引用报错的问题
export const stringify = (obj) => {
  if (typeof obj !== 'object') return obj
  // 声明cache变量，便于匹配是否有循环引用的情况
  let cache = [];
  const str = JSON.stringify(obj, function(key, value) {
    if (typeof value === 'object' && value !== null) {
      if (cache.indexOf(value) !== -1) {
        // 移除
        return;
      }
      // 收集所有的值
      cache.push(value);
    }
    return value;
  });
  cache = null; // 清空变量，便于垃圾回收机制回收
  return str
}


// 判断当前环境是否是百度端审核测试登录
export const isSwanLoginAccount = (phone) => {
  const { appointPhone } = getStorageSync('bannerImg')
  return (parseInt(phone) === parseInt(appointPhone))
}

// 去掉小数掉后面无用0
export const numberTrim = (value = '') => {
  value = value.toString();
  return value.replace(/(?=\.)(\.)?0+$/, '')
}

/**
 * 数字缩进 处理金额数据
 * @param {*} value 值
 * @param {*} max   到最大值换算
 * @param {*} unit 换算后得单位
 */
export const numberLimit = (value) => {
  if (value === false) return '';
  if (!value) return '0';
  let n = parseFloat(value);
  let _limit = {
    value: value,
    max: 0,
    unit: '',
    maxFixed: 2
  }
  const limit = [
    {max: 10000, unit: '万'},
    {max: 100000000, unit: '亿'}
  ]
  limit.forEach(item => {
    if (n >= item.max && _limit.max < item.max) {
      Object.assign(_limit, item)
    }
  })
  if (_limit.max > 0) {
    _limit.value = n / _limit.max;
    if (typeof _limit.toFixed === 'number') {
      _limit.value = _limit.value.toFixed(_limit.toFixed)
    } else if (typeof _limit.maxFixed === 'number') {
      let str = _limit.value.toString().split('.');
      if (str[1] && str[1].length > _limit.maxFixed) {
        _limit.value = _limit.value.toFixed(_limit.maxFixed)
      }
    }
  }
  return _limit.value + _limit.unit
}

/**
 * 特殊字符转换
 * @param {*} value
 */
export const specialSymbol = (value = '') => {
  try {
    value = value.toString();
    value = value.replace(/&nbsp;/g, '')
    value = value.replace(/&lt;/g, '<')
    value = value.replace(/&gt;/g, '>')
    value = value.replace(/&amp;/g, '&')
    value = value.replace(/&hellip;/g, '…')
  } catch (e) {
    console.warn('字符解析失败')
  }
  return value
}

const weeks = {
  0: '日',
  1: '一',
  2: '二',
  3: '三',
  4: '四',
  5: '五',
  6: '六'
}

// 时间格式化处理
export const formatImDate = date => {
  if (!date) return ''
  const paramsTime = new Date(date * 1000)
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()
  const day = today.getDate()
  const week = today.getDay()
  const yesterday = new Date(year,month,day,0,0,0).getTime()
  const prevDay = yesterday - 24 * 60 * 60 * 1000
  const currWeek = yesterday - 24 * 60 * 60 * 1000 * week
  const currYear = new Date(year,1,1,0,0,0).getTime()
  const h = paramsTime.getHours()
  const m = paramsTime.getMinutes()
  const time = `${h < 10 ? '0' + h : h}:${m < 10 ? '0' + m : m}`
  const showTime = paramsTime.getTime()
  if (showTime >= yesterday) { // 今天
    if (h < 12) {
      return `上午 ${time}`
    } else {
      return `下午 ${time}`
    }
  } else if (showTime < yesterday && showTime >= prevDay) { // 昨天
    return `昨天 ${time}`
  } else if (showTime < prevDay && week > 0 && showTime >= currWeek) { // 本周
    return `星期${weeks[paramsTime.getDay()]} ${time}`
  } else if (showTime < currWeek && showTime >= currYear) { // 本周之前，今年以内
    return `${paramsTime.getMonth() + 1}月${paramsTime.getDate()}日 ${time}`
  } else if (showTime < currWeek) { // 今年以前
    return `${paramsTime.getFullYear()}年${paramsTime.getMonth() + 1}月${paramsTime.getDate()}日 ${time}`
  }
}

// 复制
export const copyText = (text) => {
  Taro.setClipboardData({
    data: text,
    success: function () {
      Taro.showToast({
        title: '复制成功',
        icon: 'none',
        duration: 1000
      });
    }
  });
}

// 深拷贝
export const deepClone = (source) => {
  let target;
  if (typeof source === 'object') {
    target = Array.isArray(source) ? [] : {}
    for (let key in source) {
      if (source.hasOwnProperty(key)) {
        if (typeof source[key] !== 'object') {
          target[key] = source[key]
        } else {
          target[key] = deepClone(source[key])
        }
      }
    }
  } else {
    target = source
  }
  return target
}