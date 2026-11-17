import { Component, type PropsWithChildren } from 'react'

interface Props extends PropsWithChildren {}

interface State {
  error: unknown
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  resetError = () => {
    this.setState({ error: null })
  }

  static getDerivedStateFromError(error: unknown): State {
    return { error }
  }

  componentDidCatch() {}

  render() {
    if (this.state.error) {
      return null
    }

    return this.props.children
  }
}
