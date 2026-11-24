import { inject, onUnmounted, provide, ref } from 'vue'

const copyNoticeKey = Symbol('copyNotice')
export const copyNoticeDuration = 2000

export function provideCopyNotice() {
  const noticeId = ref(0)
  let nextId = 0
  let timeout

  provide(copyNoticeKey, () => {
    clearTimeout(timeout)
    noticeId.value = ++nextId
    timeout = setTimeout(() => { noticeId.value = 0 }, copyNoticeDuration)
  })

  onUnmounted(() => clearTimeout(timeout))
  return noticeId
}

export function useCopyNotice() {
  return inject(copyNoticeKey)
}
