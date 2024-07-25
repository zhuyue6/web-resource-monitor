import { fileMatcherDefault, resourceTimeoutConfigDefault, type ResourceTimeoutConfig } from './resourceConfig'
import { createListener } from './utils'

// 获取资源类型
function getType(
  entry: PerformanceEntry & {
    initiatorType?: string
  },
  report: ReportInstance
) {
  let resourceType = ''
  // 通过请求的资源名后缀类型判断
  const fileTypes = /([^\s.])*$/.exec(String(entry.name as string).replace(/\?\S*/, '')) 
  const fileType = fileTypes && fileTypes[0]

  for (const [key, value] of Object.entries(report.fileMatcher)) {
    if (value.includes(fileType as any)) {
      resourceType = key
      break
    }
  }

  return [fileType, resourceType]
}

interface ReportConfig {
  fileMatcher: typeof fileMatcherDefault
  resourceTimeoutConfig: ResourceTimeoutConfig,
}

interface Collection {
  name: string
  fileType: string,
  resourceType: string
  initiatorType?: string
  duration: number
  entry: PerformanceEntry
}

interface ReportInstance extends ReportConfig {
  loadedList: Collection[]
  loadedTimeoutList: Collection[]
  start?(): void
  destory?(): void
  on?(key: 'loaded' | 'collectTimeout', fn: (...rest: any[]) => void): void
  off?(key: string): void
  emit(key: string, ...arg: any[]): void
}

function longReourceCollection(report: ReportInstance, fileType: string, resourceType: string, entry: PerformanceEntry, type='normal') {
  const collect = {
    name: entry.name,
    fileType,
    resourceType: resourceType,
    initiatorType: (entry as any)?.initiatorType,
    duration: entry.duration,
  }
  
  report.loadedList.push({
    ...collect, 
    entry
  })
  report.emit('loaded', collect, entry)
  if (type === 'timeout') {
    report.emit('loadedTimeout', collect, entry)
    report.loadedTimeoutList.push({
      ...collect,
      entry
    })
  }
}

function createPerformanceObserver(observerReactive: {[index: string]: (entry: PerformanceEntry) => void}) {
  return new PerformanceObserver(
    (list: PerformanceObserverEntryList) => {
      for (const entry of list.getEntries()) {
        const observerReactiveCb = (observerReactive as any)[entry.entryType]
        observerReactiveCb && observerReactiveCb(entry)
      }
    }
  )
}

/**
 *
 * @param cb callback
 * @param reportConfig report config
 */

export function createReport(reportConfig?: ReportConfig) {
  const listener = createListener()
  const report: ReportInstance = {
    resourceTimeoutConfig: { ...resourceTimeoutConfigDefault, ...reportConfig!.resourceTimeoutConfig} ,
    fileMatcher: { ...fileMatcherDefault, ...reportConfig!.fileMatcher },
    loadedList: [],
    loadedTimeoutList: [],
    on: listener.on,
    off: listener.off,
    emit: listener.emit,
    ...reportConfig
  }

  const observerReactive = {
    resource(entry: PerformanceEntry) {
      // 资源加载监听
      const [fileType, resourceType] = getType(entry, report)
      for (const [resourceTypeKey, time] of Object.entries(report.resourceTimeoutConfig).reverse()) {
        longReourceCollection(report, <string>fileType, <string>resourceType, entry)
        if (resourceTypeKey === resourceType && entry.duration >= time) {
          return longReourceCollection(report, <string>fileType, <string>resourceType,  entry, 'timeout')
        }
      }
    },
  }
  let observer: null | PerformanceObserver = createPerformanceObserver(observerReactive)

  report.start = () => {
    observer?.observe({ entryTypes: Object.keys(observerReactive) })
  }
  report.destory = () => {
    observer?.disconnect()
    observer = null
  }

  return report
}
