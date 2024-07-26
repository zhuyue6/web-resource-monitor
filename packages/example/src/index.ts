import { createMonitor, createResourceListener, createErrorListener } from '@web-resource-monitor/core'

const monitor = createMonitor()
monitor.start()

monitor.resourceListener.on('loaded', (a, b)=>{
  console.log(a, b)
})

monitor.errorListener.on('error', (a, b)=>{
  console.log(a, b)
})

// setTimeout(()=>{ AAA }, 3000)


// const resourceListener = createResourceListener()
// resourceListener.start()
// resourceListener.on('loaded', (a, b)=>{
//   console.log(a, b)
// })


// const errorListener =  createErrorListener()
// errorListener.start()
// errorListener.on('error', (a, b)=>{
//   console.log(a, b)
// })
