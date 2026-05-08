# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: after-effects-automation-main\ae_automation\mixins\js\create_folder.jsx
# Merge Date: 2026-05-07T19:26:20.812429
# ---

//
// Create Folder
// ------------------------------------------------------------
// Language: javascript
//

function create_folder(folderName,parentFolder){
    _folder=app.project.items.addFolder(folderName);
    //if parentFolder is null or empty, then the folder will be created in the root folder
    if(parentFolder!=""){
        _folder.parentFolder = FindItemByName(parentFolder);
    }
}

create_folder("{folderName}","{parentFolder}");