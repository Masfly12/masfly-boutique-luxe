import { Component, type ReactNode, type ErrorInfo } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}
interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Error Boundary React classique.
 * Intercepte les erreurs de rendu dans l'arbre enfant et
 * affiche une UI de secours au lieu de planter toute la page.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // En production, envoyer ici vers Sentry ou tout autre outil de monitoring
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  handleReset = () => this.setState({ hasError: false, error: undefined });

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background text-foreground px-4">
          <div className="text-5xl">⚠️</div>
          <h1 className="font-display text-2xl font-bold">Une erreur est survenue</h1>
          <p className="text-muted-foreground text-sm text-center max-w-sm">
            {this.state.error?.message || "Erreur inattendue. Veuillez rafraîchir la page."}
          </p>
          <div className="flex gap-3 mt-2">
            <button
              onClick={this.handleReset}
              className="px-4 py-2 bg-primary text-primary-foreground rounded text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Réessayer
            </button>
            <a
              href="/"
              className="px-4 py-2 border border-border rounded text-sm font-medium hover:bg-secondary transition-colors"
            >
              Retour à l'accueil
            </a>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}