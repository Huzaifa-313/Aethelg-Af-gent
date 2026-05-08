# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: after-effects-automation-main\ae_automation\mixins\js\selectLayerByLayer.jsx
# Merge Date: 2026-05-07T19:26:21.272430
# ---

//
// Select Item
// ------------------------------------------------------------
// Language: javascript
//
deselectAllLayers();

_layer=FindLayerByComp("{comp_name}", "{layer_name}");
_layer.selected=true;