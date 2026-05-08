# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: after-effects-automation-main\ae_automation\mixins\js\add_marker.jsx
# Merge Date: 2026-05-07T19:26:17.575431
# ---

//
// Add Marker
// ------------------------------------------------------------
// Language: javascript
//


function addMarker(compName, layer_name, marker_name, marker_time) {
    
    layer=FindLayerByComp(compName,layer_name);
    var mv = new MarkerValue(marker_name);
    layer.property("Marker").setValueAtTime(marker_time, mv);
}

addMarker("{comp_name}","{layer_name}","{marker_name}",{marker_time})