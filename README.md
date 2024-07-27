## web-resource-monitor
Web resource loading monitoring, js error callback, reporting, etc.  
捕获前端监控资源加载和异常错误上报
  
If a long resource loading time triggers a callback, HTTP can be called to report the resource file with a long loading time, and the file type and timeout settings can be customized
如果资源加载长会触发回调，此时可以调用http上报长加载时长的资源文件，并可以自定义文件类型和超时设定

Bugs or features can be raised here:  
有问题或者扩展功能可以讨论：  

[**github: https://github.com/zhuyue6/web-resource-monitor.git/issues**](https://github.com/zhuyue6/web-resource-monitor.git/issues)

## Getting Started

### Install
```shell
 npm i web-resource-monitor
```

### resource type matcher and timeout default

match type | value
-----|-----
audio | wav mp3 wma midi acc cda ape ra
video | mp4 mpeg avi 3gp rm wmv flv bd mkv
img | jpg jpeg png gif bmp tiff webp
css | css ttf
script | js vue ts  
   
type | timeout
-----|-----
audio | 5000
video | 10000
img | 500
css | 100
script | 100

if you want to custom

```typescipt
  // use a new media attr
  createResourceListener({
    resourceTimeoutConfig: {
      media: 1000
    },
    fileMatcher: {
      media: ['mp4', 'mp3', 'jpg']
    }
  })
  // reset a script, will merge default
  createResourceListener({
    resourceTimeoutConfig: {
      script: 1000
    },
    fileMatcher: {
      script: ['mp4', 'mp3', 'jpg']
    }
  })
```


### How to use

#### ResourceListener  

```typescript
import { createResourceListener } from 'web-resource-monitor'
import axios from 'axios'

interface Collection {
  name: string
  fileType: string,
  resourceType: string
  initiatorType?: string
  duration: number
}


const resourceListener = createResourceListener()
resourceListener.start()

// listen all loaded event
resourceListener.on('loaded', (collect: Collection, entry: PerformanceEntry) => {
  // After sending an HTTP request, the database exists and can be analyzed using a BI chart
  // if you need more attrs, use entry
  axios.post('xxxxx', collect)
})

// or only listen loadedTimeout event
resourceListener.on('loadedTimeout', (collect: Collection, entry: PerformanceEntry) => {
  console.log(collect)
  // After sending an HTTP request, the database exists and can be analyzed using a BI chart
  // if you need more attrs, use entry
  axios.post('xxxxx', collect)
})


// destroy listener
resourceListener.destroy()
```  


#### ErrorListener  
```typescript
  import { createErrorListener } from 'web-resource-monitor'

  interface Collection {
    url: string,
    lineno: number,
    colno: number,
    message: string
    stack: string
    browser: string
  }
  const errorListener =  createErrorListener()
  errorListener.start()
  errorListener.on('error', (collect: Collection, error: ErrorEvent) => {
    // After sending an HTTP request, the database exists and can be analyzed using a BI chart
    // if you need more attrs, use error
    axios.post('xxxxx', collect)
  })
  
  // destroy listener
  errorListener.destroy()
```  

#### both use  
```typescript 
  import { createMonitor } from 'web-resource-monitor'

  interface CreateMonitorParams {
    resourceListenerConfig: ResourceReportConfig
  }
  const createMonitorParams: CreateMonitorParams | undefined
  
  const monitor = createMonitor(createMonitorParams)
  monitor.start()
  
  monitor.resourceListener.on('loadedTimeout', (collect: Collection, entry: PerformanceEntry)=>{
    //Same as above
  })

  monitor.errorListener.on('error', (collect: Collection, error: ErrorEvent)=>{
    //Same as above
  })

  // destroy monitor
  monitor.destroy()
```  

#### umd 
use umd and perload can capture more information
```html
<!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <script src="/index.min.js" rel="perload" async>
        const monitor = window.webResourceMonitor.createMonitor()
        monitor.start()
        monitor.resourceListener.on('loadedTimeout', (a, b)=>{
          console.log(a, b)
        })
        monitor.errorListener.on('error', (a, b)=>{
          console.log(a, b)
        })
      </script>
    </head>
    <body></body>
  </html>
```

## License

[MIT](https://opensource.org/licenses/MIT)

Copyright (c) zhuyue
