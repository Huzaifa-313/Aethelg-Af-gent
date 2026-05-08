# AETHELGARD MERGED FILE
# Origin Repository: thepopebot-1.2.72
# Original Path: templates\app\components\ui\label.jsx
# Merge Date: 2026-05-07T19:25:13.438465
# ---

export function Label({ children, className = '', ...props }) {
  return (
    <label
      className={`text-sm font-medium text-foreground ${className}`}
      {...props}
    >
      {children}
    </label>
  );
}
