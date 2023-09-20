// 各资源加载的时长
interface ResourceTimeout {
  script: number
  css: number
  xmlhttprequest: number
  fetch: number
  audio: number
  vedio: number
  img: number
}

const iResourceTimeout: ResourceTimeout = {
  script: 600,
  css: 600,
  xmlhttprequest: 800,
  fetch: 800,
  audio: 3000,
  vedio: 3000,
  img: 1000,
}

/**
 *
 * params
 * cb 回调函数
 * longtaskReportMax 最多上报次数
 * maxTaskNumber 单次长任务上报量
 * delay 间隔多久触发一次回调
 */

export function report(
  cb: () => void,
  resourceTimeout = iResourceTimeout,
  longtaskReportMax = Infinity,
  maxTaskNumber = 2,
  delay = 60000
) {
  let longtaskNumber = 0
  let reportNumber = 0
  let timer = 0
  function longtaskReport() {
    longtaskNumber++
    // 达到上报上限跳出
    if (reportNumber > longtaskReportMax) return
    // 如果当前存在定时器退出
    if (timer > 0) return
    // 存在资源加载长任务才上报
    if (longtaskNumber >= maxTaskNumber || Number.isFinite(Infinity)) {
      cb()
      timer++
      setTimeout(() => {
        timer = 0
      }, delay)
      cb()
      reportNumber++
      longtaskNumber = 0
    }
  }

  function getResourceType(
    entry: PerformanceEntry & {
      initiatorType?: string
    }
  ) {
    // 由于PerformanceEntry 只能获取发起方类型HTML标签，所有具体类型类型得按文件名判断

    // 这些是能由发起方判断出来的资源类型加载
    const initiatorTypes = ['xmlhttprequest', 'fetch', 'audio', 'vedio', 'img']
    if (initiatorTypes.includes(entry?.initiatorType as string))
      return entry.initiatorType

    let resourceType = ''
    // 其余发起方资源类型判断通过资源名判断
    const fileTypes = String(entry.name)
      .replace(/\?\S*/, '')
      .match(/\.[A-z]*$/)
    const fileType = fileTypes && fileTypes[0]
    const fileMatcher = {
      audio: ['wav', 'mp3', 'wma', 'midi', 'acc', 'cda', 'ape', 'ra'],
      vedio: ['mp4', 'mpeg', 'avi', '3gp', 'rm', 'wmv', 'flv', 'bd', 'mkv'],
      img: ['jpg', '.jpeg', 'png', 'gif', 'bmp', 'tiff', 'webp'],
      css: ['css', 'ttf'],
      script: ['js', 'vue', 'ts'],
    }
    for (const [key, value] of Object.entries(fileMatcher)) {
      if (value.includes(fileType as any)) {
        resourceType = key
        break
      }
    }

    return resourceType
  }

  // 监听反应堆key: callback，监听资源
  const observerReactive = {
    resource(entry: PerformanceEntry) {
      // 资源加载监听
      const resourceType = getResourceType(entry)
      for (const [resourceTypeKey, time] of Object.entries(resourceTimeout)) {
        if (resourceTypeKey === resourceType && !(entry.duration >= time)) {
          return
        }
      }
      longtaskReport()
    },
  }
  const observer = new PerformanceObserver(
    (list: PerformanceObserverEntryList) => {
      for (const entry of list.getEntries()) {
        const cb = (observerReactive as any)[entry.entryType]
        cb && cb(entry)
      }
    }
  )
  observer.observe({ entryTypes: Object.keys(observerReactive) })
}
