# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: after-effects-automation-main\ae_automation\mixins\js\importFile.jsx
# Merge Date: 2026-05-07T19:26:21.036430
# ---

//
// Rename Item
// ------------------------------------------------------------
// Language: javascript
//


var _File = File("{filePath}");
var _Item = app.project.importFile(new ImportOptions(_File));
_Item.name = "{fileName}";
_Item.parentFolder=FindItemByName("{cacheFolder}");