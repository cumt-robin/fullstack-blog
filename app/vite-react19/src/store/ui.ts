import { create } from 'zustand'

interface UIState {
  isMenuVisible: boolean
  setIsMenuVisible: (visible: boolean) => void
}

export const useUIStore = create<UIState>((set) => ({
  isMenuVisible: false,
  setIsMenuVisible: (visible: boolean) => set({ isMenuVisible: visible }),
}))
