import { LoadingSpinner } from './LoadingSpinner'

export function LoadingPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  )
}
