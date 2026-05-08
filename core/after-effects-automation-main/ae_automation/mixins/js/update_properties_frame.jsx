# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: after-effects-automation-main\ae_automation\mixins\js\update_properties_frame.jsx
# Merge Date: 2026-05-07T19:26:21.318431
# ---

//
// Update Comp at Key
// ------------------------------------------------------------
// Language: javascript
//

function updateCompPropertiesAtKey(compName, layer_name, property_name, property_value, frame) {
   
    property=propertyParser(FindLayerByComp(compName,layer_name),property_name);
    property.setValueAtTime(frame,valueParser(property_value));

}

updateCompPropertiesAtKey("{comp_name}","{layer_name}","{property_name}","{value}","{frame}")