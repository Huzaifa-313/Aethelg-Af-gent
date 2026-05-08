# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: after-effects-automation-main\ae_automation\mixins\js\add_comp_to_templates.jsx
# Merge Date: 2026-05-07T19:26:17.561435
# ---

//
// Add component to templates
// ------------------------------------------------------------
// Language: javascript
//

_comp=FindItemByName("{compName}");

_comp.layers.add(app.project.items[{CompTemplateID}]);

_comp.layers[1].startTime ={start_time};
_comp.layers[1].inPoint  = {inPoint};
_comp.layers[1].stretch  = {stretch};
_comp.layers[1].outPoint  = {end_time};