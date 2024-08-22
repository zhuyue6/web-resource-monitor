import { fileMatcherDefault, resourceTimeoutConfigDefault, type ResourceTimeoutConfig } from './config'
import { createListener } from '@web-resource-monitor/shared'

function getType(
  entry: PerformanceEntry & {
    initiatorType?: string
  },
  resource: ResourceListener
) {
  const resourceType: string[] = []
  // Judging by the suffix type of the requested resource name
  const fileTypes = /([^\s.])*$/.exec(String(entry.name as string).replace(/\?\S*/, '')) 
  const fileType = fileTypes && fileTypes[0]

  for (const [key, value] of Object.entries(resource.fileMatcher)) {
    if (value.includes(fileType as any)) {
      resourceType.push(key)
    }
  }

  return [fileType, resourceType]
}

export interface ResourceReportConfig {
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

interface ResourceListener extends ResourceReportConfig {
  loadedList: Collection[]
  loadedTimeoutList: Collection[]
  start(): void
  destroy(): void
  on(key: 'loaded' | 'loadedTimeout', fn: (...rest: any[]) => void): void
  off(key: string): void
  emit(key: string, ...arg: any[]): void
}

function longReourceCollection(report: ResourceListener, fileType: string, resourceType: string, entry: PerformanceEntry, type='normal') {
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
    report.loadedTimeoutList.push({
      ...collect,
      entry
    })
    report.emit('loadedTimeout', collect, entry)
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
 * @param resourceConfig report config
 * @returns ResourceListener
 */
export function createResourceListener(resourceConfig?: ResourceReportConfig) {
  const listener = createListener()
  const resourceListener: ResourceListener = {
    resourceTimeoutConfig: resourceConfig?.resourceTimeoutConfig ?? resourceTimeoutConfigDefault,
    fileMatcher: resourceConfig?.fileMatcher ?? fileMatcherDefault,
    loadedList: [],
    loadedTimeoutList: [],
    on: listener.on,
    off: listener.off,
    emit: listener.emit,
    start: () => {},
    destroy: () => {}
  }

  const observerReactive = {
    resource(entry: PerformanceEntry) {
      const [fileType, resourceType] = getType(entry, resourceListener)
      for (const [resourceTypeKey, time] of Object.entries(resourceListener.resourceTimeoutConfig).reverse()) {
        if (resourceType?.includes(resourceTypeKey)) {
          const timeout = entry.duration >= time ? 'timeout' : undefined
          longReourceCollection(resourceListener, <string>fileType, <string>resourceTypeKey,  entry, timeout)
        }
      }
    },
  }
  let observer: null | PerformanceObserver = createPerformanceObserver(observerReactive)

  resourceListener.start = () => {
    observer?.observe({ entryTypes: Object.keys(observerReactive) })
  }
  resourceListener.destroy = () => {
    observer?.disconnect()
    observer = null
  }

  return resourceListener
}

/**
 * @returns  {fileMatcherDefault, resourceTimeoutConfigDefault}
 */
export function getResourceConfigDefault() {
  return {
    fileMatcherDefault,
    resourceTimeoutConfigDefault
  }
}