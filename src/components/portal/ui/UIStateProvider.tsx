'use client'

import React, { createContext, useCallback, useContext, useState } from 'react'

export const SIDEBAR_COLLAPSED_COOKIE = 'cl_sidebar_collapsed'
export const ACTIVITY_HIDDEN_COOKIE = 'cl_activity_hidden'

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365

type UIStateContextValue = {
  sidebarCollapsed: boolean
  activityHidden: boolean
  toggleSidebar: () => void
  toggleActivity: () => void
  setSidebarCollapsed: (v: boolean) => void
  setActivityHidden: (v: boolean) => void
}

const UIStateContext = createContext<UIStateContextValue | null>(null)

function writeCookie(name: string, value: boolean) {
  if (typeof document === 'undefined') return
  document.cookie = `${name}=${value ? '1' : '0'}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`
}

export interface UIStateProviderProps {
  children: React.ReactNode
  initialSidebarCollapsed?: boolean
  initialActivityHidden?: boolean
}

export function UIStateProvider({
  children,
  initialSidebarCollapsed = false,
  initialActivityHidden = false,
}: UIStateProviderProps) {
  const [sidebarCollapsed, setSidebarCollapsedState] = useState(initialSidebarCollapsed)
  const [activityHidden, setActivityHiddenState] = useState(initialActivityHidden)

  const setSidebarCollapsed = useCallback((v: boolean) => {
    setSidebarCollapsedState(v)
    writeCookie(SIDEBAR_COLLAPSED_COOKIE, v)
  }, [])

  const setActivityHidden = useCallback((v: boolean) => {
    setActivityHiddenState(v)
    writeCookie(ACTIVITY_HIDDEN_COOKIE, v)
  }, [])

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsedState((prev) => {
      const next = !prev
      writeCookie(SIDEBAR_COLLAPSED_COOKIE, next)
      return next
    })
  }, [])

  const toggleActivity = useCallback(() => {
    setActivityHiddenState((prev) => {
      const next = !prev
      writeCookie(ACTIVITY_HIDDEN_COOKIE, next)
      return next
    })
  }, [])

  return (
    <UIStateContext.Provider
      value={{
        sidebarCollapsed,
        activityHidden,
        toggleSidebar,
        toggleActivity,
        setSidebarCollapsed,
        setActivityHidden,
      }}
    >
      {children}
    </UIStateContext.Provider>
  )
}

export function useUIState(): UIStateContextValue {
  const ctx = useContext(UIStateContext)
  if (!ctx) {
    throw new Error('useUIState must be used within a UIStateProvider')
  }
  return ctx
}

export function useUIStateOptional(): UIStateContextValue | null {
  return useContext(UIStateContext)
}
