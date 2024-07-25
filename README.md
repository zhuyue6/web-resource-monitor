## web-resource-monitor
Web resource loading monitoring, callback, reporting, etc.  
前端监控资源加载上报
  
If a long resource loading time triggers a callback, you can call HTTP to report the resource file with a long loading time.  
如果资源加载长会触发回调，此时可以调用http上报长加载时长的资源文件

## Getting Started

### Install
```shell
 npm i web-resource-monitor
```

<!-- const audio = ['wav', 'mp3', 'wma', 'midi', 'acc', 'cda', 'ape', 'ra']
const video = ['mp4', 'mpeg', 'avi', '3gp', 'rm', 'wmv', 'flv', 'bd', 'mkv']
const img = ['jpg', '.jpeg', 'png', 'gif', 'bmp', 'tiff', 'webp']
const css = ['css', 'ttf']
const script = ['js', 'vue', 'ts'] -->

### default

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
  createReport({
    resourceTimeoutConfig: {
      media: 1000
    }
    fileMatcher: {
      media: ['mp4', 'mp3', 'jpg']
    }
  })
  // reset a script, will merge default
  createReport({
    resourceTimeoutConfig: {
      script: 1000
    }
    fileMatcher: {
      script: ['mp4', 'mp3', 'jpg']
    }
  })
```


### How to use
```typescript
import { createReport } from 'web-resource-monitor'
import axios from 'axios'

interface Collection {
  name: string
  fileType: string,
  resourceType: string
  initiatorType?: string
  duration: number
}

const report = createReport()
report.start()

// listen loaded event
report.on('loaded', (collect: Collection, entry: PerformanceEntry) => {
  // After sending an HTTP request, the database exists and can be analyzed using a BI chart
  // if you need more attrs, use entry
  axios.post('xxxxx', collect)
})

// listen loaded event
report.on('loadedTimeout', (collect: Collection, entry: PerformanceEntry) => {
  console.log(resourceType, duration, entry)
  // After sending an HTTP request, the database exists and can be analyzed using a BI chart
  // if you need more attrs, use entry
  axios.post('xxxxx', collect)
})

```

## License

[MIT](https://opensource.org/licenses/MIT)

Copyright (c) zhuyue
