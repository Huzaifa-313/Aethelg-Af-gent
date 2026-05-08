# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: after-effects-automation-main\ae_automation\mixins\js\save_project.jsx
# Merge Date: 2026-05-07T19:26:21.200429
# ---

// Save the current project to a specified path
// Parameters: {projectPath}

var projectFile = new File("{projectPath}");
app.project.save(projectFile);

outputLogs("Project saved to: {projectPath}");
