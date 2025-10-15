import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Puedes registrar el error en un servicio externo aquí
    console.error('Error capturado por ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h2>Ha ocurrido un error inesperado. Por favor, recarga la página.</h2>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;