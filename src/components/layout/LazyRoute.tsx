import React, { Suspense } from 'react'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { SkeletonCard } from '@/components/ui/skeleton-card'

function RouteLoader() {
  return (
    <div className="p-4 space-y-4">
      <SkeletonCard />
      <SkeletonCard />
    </div>
  )
}

export function LazyRoute({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<RouteLoader />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  )
}
