# AETHELGARD MERGED FILE
# Origin Repository: thepopebot-1.2.72
# Original Path: templates\app\components\ui\card.jsx
# Merge Date: 2026-05-07T19:25:13.411465
# ---

export function Card({ children, className = '' }) {
  return (
    <div className={`rounded-lg border border-border bg-muted p-6 ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return <div className={`mb-4 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = '' }) {
  return <h2 className={`text-lg font-semibold text-foreground ${className}`}>{children}</h2>;
}

export function CardDescription({ children, className = '' }) {
  return <p className={`text-sm text-muted-foreground ${className}`}>{children}</p>;
}

export function CardContent({ children, className = '' }) {
  return <div className={className}>{children}</div>;
}
