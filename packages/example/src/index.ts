import { createMonitor, getResourceConfigDefault, createResourceListener, createErrorListener } from 'web-resource-monitor/src/index.ts'


const {fileMatcherDefault, resourceTimeoutConfigDefault} = getResourceConfigDefault()
const monitor = createMonitor({
  resourceListenerConfig: {
    resourceTimeoutConfig: {
      ...resourceTimeoutConfigDefault,
      lll: 10
    },
    fileMatcher: {
      ...fileMatcherDefault,
      lll: ['js']
    }
  }
})
monitor.start()

monitor.resourceListener.on('loaded', (a, b)=>{
  console.log(a, b)
})

monitor.resourceListener.on('loadedTimeout', (a, b)=>{
  console.log(a, b)
})

monitor.errorListener.on('error', (a, b)=>{
  console.log(a, b)
})

setTimeout(()=>{ AAA }, 3000)

const scriptdom = document.createElement('script')

scriptdom.setAttribute('src', 'http://code.jquery.com/jquery-1.11.0.min.js')

document.body.appendChild(scriptdom)

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
