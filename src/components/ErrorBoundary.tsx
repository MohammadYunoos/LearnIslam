// src/components/ErrorBoundary.tsx
// Catches React render errors app-wide, reports them to Crashlytics, and
// shows a recovery screen instead of a blank white screen.
import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import { recordError } from '../lib/crashlytics'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    void recordError(error, `React componentDidCatch: ${info.componentStack ?? ''}`)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-screen bg-teal-900 px-6 text-center">
          <div>
            <p className="text-5xl mb-3">⚠️</p>
            <h3 className="text-white font-bold text-lg mb-2">Something went wrong</h3>
            <p className="text-sand text-sm mb-5">Please restart the app to continue.</p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="bg-gold text-teal-900 font-bold rounded-xl py-3 px-8 text-sm"
            >
              Try again
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
