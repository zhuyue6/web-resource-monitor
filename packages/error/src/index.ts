import { createListener } from '@web-resource-monitor/shared'

interface Collection {
  url: string,
  lineno: number,
  colno: number,
  message: string
  stack: string
  browser: string
  error: ErrorEvent
}

interface ErrorListener {
  collectionList: Collection[]
  start(): void
  destroy(): void
  on(key: 'error', fn: (...rest: any[]) => void): void
  off(key: string): void
  emit(key: string, ...arg: any[]): void
}

function errorCollection(errorListener: ErrorListener, error: ErrorEvent) {
  const collect = {
    url: error.filename,
    lineno: error.lineno,
    colno: error.colno,
    message: error.message ?? error.error.message,
    stack: error.error.stack,
    browser: window.navigator.userAgent
  }
  
  errorListener.collectionList.push({
    ...collect, 
    error
  })
  errorListener.emit('error', collect, error)
}

export function createErrorListener() {
  const listener = createListener()
  const errorListener: ErrorListener  = {
    collectionList: [],
    on: listener.on,
    off: listener.off,
    emit: listener.emit,
    start: () => {},
    destroy: () => {}
  }

  function errorListenerEvent(error: ErrorEvent)  {
    errorCollection(errorListener, error)
  }

  errorListener.start = () => {
    window.addEventListener('error', errorListenerEvent)
  }

  errorListener.destroy = () => {
    window.removeEventListener('error', errorListenerEvent)
  }

  return errorListener
}