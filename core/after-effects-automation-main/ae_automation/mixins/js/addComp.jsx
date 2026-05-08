# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: after-effects-automation-main\ae_automation\mixins\js\addComp.jsx
# Merge Date: 2026-05-07T19:26:17.519430
# ---

//
// Check if item exists
// ------------------------------------------------------------
// Language: javascript
//
var _comp=app.project.items.addComp("{compName}", {compWidth}, {compHeight}, {pixelAspect}, {duration}, {frameRate})
_comp.parentFolder=FindItemByName("{folderName}");