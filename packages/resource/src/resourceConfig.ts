const audio = ['wav', 'mp3', 'wma', 'midi', 'acc', 'cda', 'ape', 'ra']
const video = ['mp4', 'mpeg', 'avi', '3gp', 'rm', 'wmv', 'flv', 'bd', 'mkv']
const img = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'webp']
const css = ['css', 'ttf']
const script = ['js', 'vue', 'ts']

export const fileMatcherDefault = {
  audio,
  video,
  img,
  css,
  script
}

// 各资源加载的时长
export interface ResourceTimeoutConfig {
  script: number
  css: number
  xmlhttprequest: number
  fetch: number
  audio: number
  video: number
  img: number
}

export const resourceTimeoutConfigDefault: ResourceTimeoutConfig = {
  script: 100,
  css: 100,
  xmlhttprequest: 200,
  fetch: 200,
  audio: 5000,
  video: 10000,
  img: 500,
}