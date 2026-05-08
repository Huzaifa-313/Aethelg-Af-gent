# AETHELGARD MERGED FILE
# Origin Repository: claude-code5
# Original Path: src\tools\NotebookReadTool\prompt.ts
# Merge Date: 2026-05-07T19:17:46.038127
# ---

export const DESCRIPTION =
  'Extract and read source code from all code cells in a Jupyter notebook.'
export const PROMPT = `Reads a Jupyter notebook (.ipynb file) and returns all of the cells with their outputs. Jupyter notebooks are interactive documents that combine code, text, and visualizations, commonly used for data analysis and scientific computing. The notebook_path parameter must be an absolute path, not a relative path.`
