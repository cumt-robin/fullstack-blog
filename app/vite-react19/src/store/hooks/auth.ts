import { useAuthStore, selectIsAuthed } from '../auth'

export const useIsAuthed = () => {
  return useAuthStore(selectIsAuthed)
}
