import { createResourceListener, type ResourceReportConfig } from '@web-resource-monitor/resource'
import { createErrorListener } from '@web-resource-monitor/error'
export { createResourceListener, createErrorListener }

/**
 * @deprecated Please use createResourceListener instead.
 */
const createReport = createResourceListener

export { createReport }

interface Monitor {
  resourceListener: ReturnType<typeof createResourceListener>
  errorListener: ReturnType<typeof createErrorListener>
  start: ()=>void
  destroy: ()=>void
}

interface CreateMonitorParams {
  resourceListenerConfig: ResourceReportConfig
}

export function createMonitor(params?: CreateMonitorParams) {
  let monitor: Monitor | null = {
    resourceListener: createResourceListener(params?.resourceListenerConfig),
    errorListener: createErrorListener(),
    start: () => {
      monitor?.resourceListener.start()
      monitor?.errorListener.start()
    },
    destroy: () => {
      monitor?.resourceListener.destroy()
      monitor?.errorListener.destroy()
      monitor = null
    }
  }
  return monitor
}


