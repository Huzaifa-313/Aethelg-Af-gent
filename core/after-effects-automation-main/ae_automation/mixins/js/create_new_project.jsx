# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: after-effects-automation-main\ae_automation\mixins\js\create_new_project.jsx
# Merge Date: 2026-05-07T19:26:20.827429
# ---

// Create a new After Effects project
// This closes the current project and creates a new one

app.project.close(CloseOptions.DO_NOT_SAVE_CHANGES);
app.newProject();

outputLogs("New project created");
