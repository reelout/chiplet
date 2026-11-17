import { generateUniqueId } from '#util'
import { useConst } from './useConst'

export function useUniqueId(prefix?: string, suffix?: string) {
  return useConst(() => {
    return generateUniqueId(prefix, suffix)
  })
}
