# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: after-effects-automation-main\ae_automation\mixins\js\selectLayerByIndex.jsx
# Merge Date: 2026-05-07T19:26:21.259430
# ---

//
// Select Item
// ------------------------------------------------------------
// Language: javascript
//
deselectAllLayers();

_layer=FindLayerByLayerIndex("{comp_name}", "{layer_index}");
_layer.selected=true;