## 
Web resource loading monitoring, callback, reporting, etc  
前端监控资源加载上报

## Getting Started

### Install
```shell
 npm i web-resource-monitor
```

### How to use
```typescript
import { report } from 'web-resource-monitor'

report((entry: PerformanceEntry)=>{
  console.log(entry)
})

```

## License

[MIT](https://opensource.org/licenses/MIT)

Copyright (c) zhuyue
