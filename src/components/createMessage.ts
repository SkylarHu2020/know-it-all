import { createApp } from 'vue'
import Message from './Message.vue'
export type MessageType = 'success' | 'error' | 'default'

const createMessage = (message: string, type: MessageType, timeout = 2000) => {
  // 用函数的模式来创建一个组件, 第一个参数是组件名称，第二个参数是组件的props
  const messageInstance = createApp(Message, {
    message,
    type
  })
  // 将messageInstance挂载在某个DOM节点上
  // 新建节点
  const mountNode = document.createElement('div')
  document.body.appendChild(mountNode)
  messageInstance.mount(mountNode)
  setTimeout(() => {
    messageInstance.unmount(mountNode)
    document.body.removeChild(mountNode)
  }, timeout)
}

export default createMessage
