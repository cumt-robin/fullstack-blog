import { create } from 'zustand'
import { getLocalData } from '@/utils/bom'
import type { CommentUserInfo, UserDTO } from '@/bean/dto'
import type { LoginModel } from '@/bean/xhr'
import { userService } from '@/services/user'

interface AuthState {
  token: string | null
  userInfo: UserDTO | null
  commentUserInfo: CommentUserInfo | null
  setToken: (token: string | null) => void
  setUserInfo: (userInfo: UserDTO | null) => void
  setCommentUserInfo: (commentUserInfo: CommentUserInfo | null) => void
  clearUserSession: () => Promise<void>
  dispatchLogin: (payload: LoginModel) => Promise<UserDTO>
  dispatchLogout: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: getLocalData({ key: 'token' }),
  userInfo: getLocalData<UserDTO>({ key: 'userInfo', parse: true }),
  commentUserInfo: getLocalData<CommentUserInfo>({ key: 'commentUserInfo', parse: true }),

  setToken: (token: string | null) => {
    if (token === null) {
      localStorage.removeItem('token')
      set({ token: '' })
    } else {
      localStorage.setItem('token', token)
      set({ token })
    }
  },

  setUserInfo: (userInfo: UserDTO | null) => {
    if (userInfo === null) {
      localStorage.removeItem('userInfo')
      set({ userInfo: null })
    } else {
      localStorage.setItem('userInfo', JSON.stringify(userInfo))
      set({ userInfo })
    }
  },

  setCommentUserInfo: (commentUserInfo: CommentUserInfo | null) => {
    if (commentUserInfo === null) {
      localStorage.removeItem('commentUserInfo')
      set({ commentUserInfo: null })
    } else {
      localStorage.setItem('commentUserInfo', JSON.stringify(commentUserInfo))
      set({ commentUserInfo })
    }
  },

  clearUserSession: async () => {
    get().setToken(null)
    get().setUserInfo(null)
  },

  dispatchLogin: async (payload: LoginModel) => {
    const { data } = await userService.login(payload)
    get().setToken(data.token)
    get().setUserInfo(data)
    return data
  },

  dispatchLogout: async () => {
    await userService.logout()
    await get().clearUserSession()
  },
}))

// Selectors
export const selectUserInfo = (state: AuthState) => state.userInfo
export const selectCommentUserInfo = (state: AuthState) => state.commentUserInfo
export const selectIsAuthed = (state: AuthState) => !!state.token
