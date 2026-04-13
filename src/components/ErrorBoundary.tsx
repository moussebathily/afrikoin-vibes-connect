import React from 'react'
import { AlertTriangle, RefreshCw, Wifi, WifiOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  isOffline: boolean
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, isOffline: !navigator.onLine }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error }
  }

  componentDidMount() {
    window.addEventListener('online', this.handleOnline)
    window.addEventListener('offline', this.handleOffline)
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.handleOnline)
    window.removeEventListener('offline', this.handleOffline)
  }

  handleOnline = () => {
    this.setState({ isOffline: false })
    // Auto-retry if we were in error state and came back online
    if (this.state.hasError) {
      this.setState({ hasError: false, error: undefined })
    }
  }

  handleOffline = () => {
    this.setState({ isOffline: true })
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.isOffline && !this.state.hasError) {
      return (
        <>
          {this.props.children}
          <div className="fixed bottom-20 left-4 right-4 z-50 animate-in slide-in-from-bottom">
            <Card className="bg-warning/10 border-warning shadow-lg">
              <CardContent className="flex items-center gap-3 py-3 px-4">
                <WifiOff className="h-5 w-5 text-warning shrink-0" />
                <p className="text-sm text-warning-foreground">
                  Pas de connexion internet. Certaines fonctionnalités peuvent être limitées.
                </p>
              </CardContent>
            </Card>
          </div>
        </>
      )
    }

    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      const isNetworkError = this.state.error?.message?.toLowerCase().includes('fetch') ||
        this.state.error?.message?.toLowerCase().includes('network') ||
        this.state.error?.message?.toLowerCase().includes('load')

      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-destructive/10 rounded-full">
                  {isNetworkError ? (
                    <WifiOff className="h-8 w-8 text-destructive" />
                  ) : (
                    <AlertTriangle className="h-8 w-8 text-destructive" />
                  )}
                </div>
              </div>
              <CardTitle>
                {isNetworkError ? 'Problème de connexion' : 'Oops! Une erreur s\'est produite'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-center">
                {isNetworkError
                  ? 'Impossible de charger les données. Vérifiez votre connexion internet.'
                  : 'L\'application a rencontré une erreur inattendue. Veuillez réessayer.'}
              </p>
              
              {(import.meta as any).env?.DEV && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm text-muted-foreground">
                    Détails de l'erreur
                  </summary>
                  <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto max-h-40">
                    {this.state.error?.message}
                    {'\n'}
                    {this.state.error?.stack}
                  </pre>
                </details>
              )}
              
              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => this.setState({ hasError: false, error: undefined })}
                  className="w-full"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Réessayer
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                  className="w-full"
                >
                  Recharger l'application
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}
