export function createListener() {
  const depends = new Map()
  const listener = {
    on(key: string, cb: (...arg: any[])=> void) {
      if (cb === depends.get(key)) {
        return
      }
      depends.set(key, cb)
    },
    emit(key: string, ...arg: any[]) {
      const cb = depends.get(key)
      cb?.(...arg)
    },
    off(key: string) {
      depends.delete(key)
    },
    destroy() {
      depends.clear()
    }
  }
  return listener
}