import React, { Suspense } from 'react'

function RouteLoader() {
  return (
    <div className="flex items-center justify-center min-h-32">
      <div className="w-8 h-8 bg-gradient-primary rounded-lg animate-pulse" />
    </div>
  )
}

export function LazyRoute({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<RouteLoader />}>
      {children}
    </Suspense>
  )
}
