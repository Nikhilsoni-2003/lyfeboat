import * as React from "react";

interface UniversalErrorBoundaryProps {
  error: any;
}

export const UniversalErrorBoundary: React.FC<UniversalErrorBoundaryProps> = ({
  error,
}) => {
  console.log("🔥 Caught error:", error);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Something went wrong!</h1>
      <pre>{error?.message || String(error)}</pre>
      <pre>{error}</pre>
      {error?.stack && (
        <details>
          <pre>{error.stack}</pre>
        </details>
      )}
    </div>
  );
};

interface ErrorBoundaryState {
  error: any;
}

export class ClientErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: any) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { error };
  }

  componentDidCatch(error: any, info: any) {
    console.error("🔥 Caught in ClientErrorBoundary:", error, info);
  }

  render() {
    if (this.state.error) {
      return <UniversalErrorBoundary error={this.state.error} />;
    }
    return this.props.children;
  }
}
