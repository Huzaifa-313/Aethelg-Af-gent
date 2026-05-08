# AETHELGARD MERGED FILE
# Origin Repository: claude-code-info
# Original Path: app\theme-init.ts
# Merge Date: 2026-05-07T19:14:26.955456
# ---

/** Inline in layout via Script — avoids flash of wrong theme */
export const themeInitScript = `(function(){try{var s=localStorage.getItem("theme");var d=s==="dark"||(s!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d);}catch(e){}})();`;
